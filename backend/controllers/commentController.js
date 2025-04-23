import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import CustomError from "../errors/error-index.js";
import { StatusCodes } from "http-status-codes";

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
  res.status(StatusCodes.CREATED).json({ msg: "Comment Created" });
};

export const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;
  if (!commentId) {
    throw new CustomError.BadRequestError("commentId needs to be provided");
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
    populate: {
      path: "user",
      select: "username profilePicture _id",
    },
  });
  res
    .status(StatusCodes.OK)
    .json({ nbHits: post.comments.length, comments: post.comments });
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
    throw new CustomError.NotFoundError("Comment Not Found ");
  }
  comment.replies.push({ text, user: req.user.userId });
  await comment.save();
  res.status(StatusCodes.OK).json({ msg: "Reply Created" });
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

  const replyIndex = comment.replies.findIndex(
    (reply) => reply._id.toString() === replyId
  );

  if (replyIndex === -1) {
    throw new CustomError.NotFoundError("Reply not found");
  }

  const reply = comment.replies[replyIndex];
  if (reply.user.toString() !== req.user.userId) {
    throw new CustomError.UnauthorizedError(
      "You are not authorized to delete this reply"
    );
  }

  comment.replies.splice(replyIndex, 1);
  await comment.save();

  res.status(StatusCodes.OK).json({ msg: "Reply deleted successfully" });
};
