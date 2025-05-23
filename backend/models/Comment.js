import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    text: {
      type: String,
      maxLength: 60,
      required: true,
    },
    replies: [
      {
        type: mongoose.Types.ObjectId,
        ref: "CommentReply",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
