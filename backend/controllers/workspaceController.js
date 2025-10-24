import Project from "../models/projects.js";
import Workspace from "../models/workspace.js";
export const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });
    res
      .status(200)
      .json({ message: "Workspace created  successfully", workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internel server error" });
  }
};

export const getWorkspaces = async (req, res) => {
  try {
    const worskspaces = await Workspace.find({
      "members.user": [req.user._id],
    }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Workspaces", worskspaces });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internel server error" });
  }
};

export const getWorkspace = async (req, res) => {
  try {
    const { worspaceid } = req.params;
    const workspace = await Workspace.findById(worspaceid).populate(
      "members.user",
      "name email"
    );
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    res.status(200).json({ message: "Workspace found", workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internel server error" });
  }
};

export const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceid } = req.params;
  const workspace = await Workspace.findOne({
      _id: workspaceid,
      "members.user": req.user._id,
    }).populate("members.user", "name email");
    if (!workspace) {
      return res.status(401).json({ message: "Workspace not found" });
    }
    const projects = await Project.find({
      workspace: workspaceid,
      isArchieved: false,
      // members: { $in: [req?.user._id] },
    })
      .sort({ createAt: -1 })
      // .populate("tasks", "status");
    res
      .status(200)
      .json({ message: "workspace Projects", projects, workspace });
  } catch (error) {
    console.log(error);
  }
};
