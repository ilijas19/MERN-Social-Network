import mongoose from "mongoose";

const commentReplySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    text: {
      type: String,
      maxLength: 60,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CommentReply", commentReplySchema);
