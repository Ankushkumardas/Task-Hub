import mongoose, { model, Schema } from "mongoose";
const workspaceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  color: {
    type: String,
    default: "white",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  members:[
    {
        user:{type:mongoose.Schema.Types.ObjectId,
        ref:"User"},
        role:{type:String,enum:["owner", "member", "viewer", "admin"],default:"member"},joinedAt: { type: Date, default: Date.now() },
    }
  ],
  projects:[
    {type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    }
  ]
},{timestamps:true});

const Workspace = model("Workspace", workspaceSchema);
export default Workspace;
