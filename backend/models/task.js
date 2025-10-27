import mongoose from "mongoose";

const taskschema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    watchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    completedAt: {
      type: Date,
    },
    estimatedHours: {
      type: Number,
      min: 0,
    },
    actualHours: {
      type: Number,
      min: 0,
    },
    tags: [{ type: String }],
    subtasks: [
      {
        title: { type: String, required: true },
        // keep legacy `comleted` for backwards compatibility, add `completed` as canonical field
        completed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    attachments: [
      {
        filename: { type: String, required: true },
        fileurl: { type: String, required: true },
        filetype: { type: String, required: true },
        filesize: { type: Number, required: true },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now() },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isArchieved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskschema);
export default Task;
