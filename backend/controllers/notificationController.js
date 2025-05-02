import { StatusCodes } from "http-status-codes";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
// import Message from '../models/'
import CustomError from "../errors/error-index.js";

export const createNotification = async ({ from, to, type, postId, text }) => {
  if (!from || !to || !type || !text) {
    throw new CustomError.BadRequestError("All fields must be provided");
  }

  if (from === to) {
    return;
  }

  const userTo = await User.findById(to);
  if (!userTo) {
    throw new CustomError.NotFoundError("User To not found");
  }

  if ((type === "like" || type === "comment") && postId) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new CustomError.NotFoundError("Post not found");
    }
  }

  const query = { from, to, type };
  if (postId && (type === "like" || type === "comment")) {
    query.postId = postId;
  }

  const existingNotification = await Notification.findOne(query);
  if (existingNotification) return;

  return await Notification.create({
    from,
    to,
    type,
    text,
    postId: postId || null,
  });
};

export const getAllNotifications = async (req, res) => {
  const { page = 1, type } = req.query;

  const queryObject = {
    to: req.user.userId,
  };
  if (type) {
    queryObject.type = type;
  }

  const limit = 10;
  const skip = (page - 1) * limit;

  const [notifications, totalNotifications] = await Promise.all([
    Notification.find(queryObject)
      .populate({
        path: "from",
        select: "username profilePicture _id",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(queryObject),
  ]);

  const hasNextPage = skip + notifications.length < totalNotifications;

  res.status(StatusCodes.OK).json({
    page: Number(page),
    nbHits: notifications.length,
    totalNotifications,
    hasNextPage,
    notifications,
  });
};

export const getSingleNotification = async (req, res) => {
  const { id: notificationId } = req.params;
  if (!notificationId) {
    throw new CustomError.BadRequestError(
      "Notification Id needs to be provided"
    );
  }
  const notification = await Notification.findOne({
    _id: notificationId,
    to: req.user.userId,
  })
    .populate({
      path: "from",
      select: "username profilePicture _id",
    })
    .populate({
      path: "to",
      select: "username profilePicture _id",
    });

  if (!notification) {
    throw new CustomError.NotFoundError("Notification was not found");
  }
  res.status(StatusCodes.OK).json({ notification });
};

export const markAsRead = async (req, res) => {
  const { id: notificationId } = req.params;
  if (!notificationId) {
    throw new CustomError.BadRequestError(
      "Notification Id needs to be provided"
    );
  }
  const notification = await Notification.findOne({
    _id: notificationId,
    to: req.user.userId,
  });

  if (!notification) {
    throw new CustomError.NotFoundError("Notification was not found");
  }
  notification.isRead = true;
  await notification.save();
  res.status(StatusCodes.OK).json({ msg: "Notification Read" });
};

export const markAllAsRead = async (req, res) => {
  const notifications = await Notification.updateMany(
    { to: req.user.userId, isRead: false },
    { $set: { isRead: true } }
  );

  if (notifications.matchedCount === 0) {
    throw new CustomError.NotFoundError("No unread notifications found");
  }

  res.status(StatusCodes.OK).json({ msg: "All Notifications Marked as Read" });
};

export const deleteNotification = async (req, res) => {
  const { id: notificationId } = req.params;
  if (!notificationId) {
    throw new CustomError.BadRequestError(
      "Notification id needs to be provided"
    );
  }
  const notification = await Notification.findOne({
    _id: notificationId,
    to: req.user.userId,
  });
  if (!notification) {
    throw new CustomError.NotFoundError("Notification was not found");
  }
  await notification.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Notification Deleted" });
};

export const deleteAllNotifications = async (req, res) => {
  const notifications = await Notification.deleteMany({ to: req.user.userId });
  res.status(StatusCodes.OK).json({ msg: "Deleted All Notifications" });
};
