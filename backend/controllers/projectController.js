import Project from "../models/projects.js";
import Workspace from "../models/workspace.js";
import Task from "../models/task.js";

export const createProject = async (req, res) => {
  try {
    const { workspaceid } = req.params;
    const {
      title,
      description,
      status,
      startDate,
      dueDate,
      tags,
      members,
    } = req.body;

    const workspace = await Workspace.findById(workspaceid);
    if (!workspace) {
      return res.status(401).json({ message: "Workspace not found" });
    }
    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res
        .status(401)
        .json({ message: "You are not a member of this workspace" });
    }

    const tagsArray = Array.isArray(tags) ? tags : [];

    const newProject = new Project({
      title,
      description,
      workspace: workspaceid,
      status,
      startDate,
      dueDate,
      tags: tagsArray,
      members,
      createdBy: req.user._id,
    });

    await newProject.save();

    workspace.projects.push(newProject._id);
    await workspace.save();

    res
      .status(200)
      .json({
        message: "New project created successfully",
        newProject,
        workspace,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { projectid } = req.params;
    // console.log()
    const user=req.user._id
    const project = await Project.findById(projectid);
    if (!project) {
      return res.status(401).json({ message: "Project not found" });
    }
    const member=project.members;
    const isMember = project.members.some(
      (member) => member.user.toString() == req.user._id.toString()
    );
    if (!isMember) {
      return res
      .status(401)
      .json({ message: "You are not a member of this project " });
    }
    return res.status(200).json({ message: "Project details",project,member,user});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internel server error " });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { projectid } = req.params;
    const project = await Project.findById(projectid).populate("members.user");
    if (!project) {
      return res.status(401).json({ message: "Project not found" });
    }
    const isMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res
        .status(401)
        .json({ message: "You are not a member of this project " });
    }
  const tasks = await Task.find({ project: projectid, isArchieved: false });
  // .populate("assignees", "name email");
  // Always return project.members for frontend
  return res.status(200).json({ message: "Project details with task details", project, tasks, members: project.members });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
