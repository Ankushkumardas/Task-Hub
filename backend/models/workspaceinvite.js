    import mongoose from "mongoose";
    const workspaceInviteSchema = new mongoose.Schema(
      {
        workspaceid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["owner", "member", "viewer", "admin"],
            default: "member",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expiresAt:{
            type:Date,
            required:true,
        }
      },
      { timestamps: true }
    );  
    const WorkspaceInvite = mongoose.model("WorkspaceInvite", workspaceInviteSchema);
    export default WorkspaceInvite;