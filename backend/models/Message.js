import mongoose from "mongoose";
import Chat from "./Chat.js";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.post("save", async function (doc) {
  await Chat.findByIdAndUpdate(
    doc.chat,
    { lastMessage: doc._id },
    { new: true }
  );
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
