import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import CustomError from "../errors/error-index.js";
import { StatusCodes } from "http-status-codes";
import CommentReply from "../models/CommentReply.js";
import { createNotification } from "./notificationController.js";
import User from "../models/User.js";

export const createComment = async (req, res) => {
  const { text, postId } = req.body;
  if (!text || !postId) {
    throw new CustomError.BadRequestError("All values must be provided");
  }
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new CustomError.NotFoundError("Post Not Found");
  }
  const comment = await Comment.create({
    text,
    post: postId,
    user: req.user.userId,
  });
  post.comments.push(comment._id);
  await post.save();
  const currentUser = await User.findOne({ _id: req.user.userId });
  await createNotification({
    type: "comment",
    from: currentUser._id,
    to: post.user,
    text: `${currentUser.username} has commented on your post`,
    postId,
  });
  res.status(StatusCodes.CREATED).json({ msg: "Comment Created" });
};

export const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;
  if (!commentId) {
    throw new CustomError.BadRequestError("commentId needs to be provided");
  }

  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new CustomError.BadRequestError(
      "You have No Comment With Specified Id"
    );
  }

  const post = await Post.findOne({ _id: comment.post });
  if (!post) {
    throw new CustomError.NotFoundError("Post Not Found");
  }

  const myPost = post.user.toString() === req.user.userId;

  if (!myPost && comment.user.toString() !== req.user.userId) {
    throw new CustomError.UnauthorizedError(
      "You are not authorized to delete this comment"
    );
  }

  post.comments = post.comments.filter(
    (comm) => comm._id.toString() !== comment._id.toString()
  );

  await post.save();
  await comment.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Comment Deleted" });
};

export const editComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { text } = req.body;
  if (!commentId) {
    throw new CustomError.BadRequestError("commentId needs to be provided");
  }
  if (!text) {
    throw new CustomError.BadRequestError("text needs to be provided");
  }
  const comment = await Comment.findOne({
    _id: commentId,
    user: req.user.userId,
  });
  if (!comment) {
    throw new CustomError.BadRequestError(
      "You have No Comment With Specified Id"
    );
  }
  comment.text = text;
  await comment.save();
  return res.status(StatusCodes.OK).json({ msg: "Comment Updated" });
};

export const getPostComments = async (req, res) => {
  const { id: postId } = req.params;
  if (!postId) {
    throw new CustomError.BadRequestError("postId needs to be provided");
  }

  const post = await Post.findOne({ _id: postId }).populate({
    path: "comments",
    options: { sort: { createdAt: -1 } },
    populate: [
      {
        path: "user",
        select: "username profilePicture _id",
      },
      {
        path: "replies",
        populate: {
          path: "user",
          select: "username profilePicture _id",
        },
      },
    ],
  });

  const enrichedComments = post.comments.map((comment) => ({
    ...comment.toObject(),
    myPost: post.user._id.toString() === req.user.userId,
    myComment: comment.user._id.toString() === req.user.userId,
  }));

  res.status(StatusCodes.OK).json({
    nbHits: post.comments.length,
    comments: enrichedComments,
  });
};

export const createCommentReply = async (req, res) => {
  const { id: commentId } = req.params;
  const { text } = req.body;

  if (!commentId) {
    throw new CustomError.BadRequestError("commentId needs to be provided");
  }
  if (!text) {
    throw new CustomError.BadRequestError("Text must be provided");
  }

  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError("Comment not found");
  }

  // 1. Create the reply
  const reply = await CommentReply.create({
    user: req.user.userId,
    comment: commentId,
    text,
  });

  // 2. Push the reply's _id into comment.replies
  comment.replies.push(reply._id);
  await comment.save();

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Reply created successfully", reply });
};

export const deleteCommentReply = async (req, res) => {
  const { commentId, replyId } = req.body;

  if (!commentId || !replyId) {
    throw new CustomError.BadRequestError(
      "commentId and replyId must be provided"
    );
  }

  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError("Comment not found");
  }

  const reply = await CommentReply.findOne({ _id: replyId });
  if (!reply) {
    throw new CustomError.NotFoundError("Reply not found");
  }

  // 1. Check if the user owns the reply
  if (reply.user.toString() !== req.user.userId) {
    throw new CustomError.UnauthorizedError(
      "You are not authorized to delete this reply"
    );
  }

  // 2. Remove the reply from Comment's replies array
  comment.replies = comment.replies.filter((rId) => rId.toString() !== replyId);
  await comment.save();

  // 3. Delete the reply document itself
  await reply.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Reply deleted successfully" });
};

export const getCommentReplies = async (req, res) => {
  const { id: commentId } = req.params;
  if (!commentId) {
    throw new CustomError.BadRequestError("commentId needs to be provided");
  }
  const comment = await Comment.findOne({ _id: commentId }).populate({
    path: "replies",
    populate: {
      path: "user",
      select: "username profilePicture",
    },
  });
  if (!comment) {
    throw new CustomError.NotFoundError("Comment not Found");
  }
  res
    .status(StatusCodes.OK)
    .json({ nbHits: comment.replies.length, replies: comment.replies });
};
