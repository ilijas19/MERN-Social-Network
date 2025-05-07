import { StatusCodes } from "http-status-codes";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import CustomError from "../errors/error-index.js";

export const createChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new CustomError.BadRequestError("userId needs to be provided");
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }

  const existingChat = await Chat.findOne({
    users: { $all: [req.user.userId, userId], $size: 2 },
  }).populate({
    path: "lastMessage",
    populate: {
      path: "sender",
      select: "username profilePicture",
    },
  });

  if (existingChat) {
    if (existingChat.deletedBy.includes(req.user.userId)) {
      existingChat.deletedBy = existingChat.deletedBy.filter(
        (id) => id.toString() !== req.user.userId.toString()
      );
      await existingChat.save();
    }

    if (existingChat.lastMessage) {
      if (existingChat.lastMessage.sender.username !== req.user.username) {
        const lastMessage = await Message.findOne({
          _id: existingChat.lastMessage._id,
        });
        lastMessage.read = true;
        await lastMessage.save();
      }
    }

    return res.status(StatusCodes.OK).json({
      msg: "Joining existing chat",
      chatId: existingChat._id,
      otherUser: {
        username: user.username,
        _id: user._id,
        profilePicture: user.profilePicture,
      },
    });
  }
  const chat = await Chat.create({ users: [user._id, req.user.userId] });
  return res.status(StatusCodes.OK).json({
    msg: "Chat Created",
    chatId: chat._id,
    otherUser: {
      username: user.username,
      _id: user._id,
      profilePicture: user.profilePicture,
    },
  });
};

export const getAllChats = async (req, res) => {
  const userId = req.user.userId;

  const chats = await Chat.find({
    users: userId,
    deletedBy: { $ne: userId },
  })
    .populate("users", "username profilePicture")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "username profilePicture",
      },
    })
    .sort({ updatedAt: -1 });

  const modifiedChats = chats.map((chat) => {
    return {
      chatId: chat._id,
      otherUser: chat.users.find((u) => u._id.toString() !== req.user.userId),
      lastMessage: chat.lastMessage,
    };
  });

  res.status(StatusCodes.OK).json({ chats: modifiedChats });
};

export const deleteChatForUser = async (req, res) => {
  const { id: chatId } = req.params;
  const userId = req.user.userId;

  if (!chatId) {
    throw new CustomError.BadRequestError("chatId needs to be provided");
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new CustomError.NotFoundError("Chat not found");
  }

  // Check if user is participant
  const isParticipant = chat.users.some(
    (id) => id.toString() === userId.toString()
  );
  if (!isParticipant) {
    throw new CustomError.BadRequestError("Not part of this chat");
  }

  // Update deletion tracking
  const existingDeletionIndex = chat.deletedAt.findIndex(
    (entry) => entry.user.toString() === userId.toString()
  );

  // Update or create deletion entry
  if (existingDeletionIndex >= 0) {
    // Update existing deletion timestamp
    chat.deletedAt[existingDeletionIndex].deletedAt = new Date();
  } else {
    // Add new deletion entry
    chat.deletedAt.push({
      user: userId,
      deletedAt: new Date(),
    });
  }

  // Update deletedBy array
  if (!chat.deletedBy.includes(userId)) {
    chat.deletedBy.push(userId);
  }

  // Check if both users deleted the chat
  if (chat.deletedBy.length === 2) {
    await Message.deleteMany({ chat: chatId });
    await chat.deleteOne();
    return res.status(StatusCodes.OK).json({ msg: "Chat deleted" });
  }

  await chat.save();
  return res.status(StatusCodes.OK).json({ msg: "Chat deleted" });
};

export const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  if (!chatId) {
    throw new CustomError.BadRequestError("Chat Id needs to be provided");
  }
  if (!text) {
    throw new CustomError.BadRequestError("text needs to be provided");
  }
  const chat = await Chat.findOne({ _id: chatId });
  if (!chat) {
    throw new CustomError.NotFoundError("Chat Not Found");
  }
  if (!chat.users.some((id) => id.toString() === req.user.userId)) {
    throw new CustomError.UnauthorizedError("You are not part of this chat");
  }

  let message = await Message.create({
    sender: req.user.userId,
    chat: chat._id,
    text,
  });

  message = await message.populate("sender", "username profilePicture");

  res.status(StatusCodes.OK).json({ msg: "message sent", message });
};

export const getChatMessages = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;
  const { id: chatId } = req.params;
  const userId = req.user.userId;

  const chat = await Chat.findById(chatId)
    .populate("users", "username profilePicture")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "username profilePicture" },
    });

  if (!chat) throw new CustomError.NotFoundError("Chat not found");

  // Check participation
  const isParticipant = chat.users.some(
    (user) => user._id.toString() === userId.toString()
  );
  if (!isParticipant) {
    throw new CustomError.BadRequestError("Not part of this chat");
  }

  // Update last message read status
  if (
    chat.lastMessage &&
    chat.lastMessage.sender.username !== req.user.username
  ) {
    const lastMessage = await Message.findById(chat.lastMessage._id);
    lastMessage.read = true;
    await lastMessage.save();
  }

  // Find most recent deletion time
  const userDeletions = chat.deletedAt.filter(
    (entry) => entry.user.toString() === userId.toString()
  );
  const latestDeletion =
    userDeletions.length > 0
      ? new Date(Math.max(...userDeletions.map((d) => d.deletedAt)))
      : null;

  // Build filter
  const filter = { chat: chatId };
  if (latestDeletion) {
    filter.createdAt = { $gt: latestDeletion };
  }

  // Get messages
  const totalMessages = await Message.countDocuments(filter);
  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "username profilePicture");

  const hasNextPage = skip + messages.length < totalMessages;

  res.status(StatusCodes.OK).json({
    page: Number(page),
    hasNextPage,
    messages: messages.reverse(),
    otherUser: chat.users.find((u) => u._id.toString() !== userId),
  });
};

export const createMessage = async ({ chatId, text, senderId }) => {
  try {
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      throw new CustomError.NotFoundError("Chat Not Found");
    }
    const message = await Message.create({
      chat: chatId,
      text,
      sender: senderId,
    });

    chat.lastMessage = message._id;
  } catch (error) {
    console.log(error);
  }
};
