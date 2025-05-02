import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    to: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["message", "follow", "like", "comment"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },

    messageId: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
