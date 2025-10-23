import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    mentions: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      offsett: { type: Number },
      length: { type: Number },
    },
    reactions: [
      {
        emoji: { type: String, required: true },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    attachments: [
      {
        filename: { type: String, required: true },
        fileurl: { type: String, required: true },
        filetype: { type: String, required: true },
        filesize: { type: Number, required: true },
      },
    ],
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
