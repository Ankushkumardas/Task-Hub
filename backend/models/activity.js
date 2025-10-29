import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      required: true,
      enum: [
      "created_task",
      "updated_task",
      "updated_task_description",
      "updated_task_status",
      "updated_task_assignee",
      "updated_task_priority",
      "created_suntask",
      "updated_suntask",
      "completed_suntask",
      "completed_task",
      "created_project",
      "updated_project",
      "completed_project",
      "added_member",
      "removed_member",
      "added_comment",
      "created_workspace",
      "updated_workspace",
      "joined_workspace",
      "transferred_workspace_ownership",
      "added_attachment",
      ],
    },
    resourceType: {
      type: String,
      required: true,
      enum: [
        "Task",
        "Subtask",
        "Project",
        "Workspace",
        "Comment",
        "User",
        "Attachment",
      ],
    },
    detail: { type: Object, required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);
const Activity = mongoose.model("Activity", activitySchema);
export default Activity;