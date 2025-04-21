import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
      maxLength: 60,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    numLikes: {
      type: Number,
      default: 0,
    },
    numComments: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ["text", "image"],
    },
  },
  { timestamps: true }
);

// Sync numLikes and numComments before saving
postSchema.pre("save", function () {
  this.numLikes = this.likes?.length || 0;
  this.numComments = this.comments?.length || 0;
});

export default mongoose.model("Post", postSchema);
