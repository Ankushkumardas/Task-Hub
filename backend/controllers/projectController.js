import Project from "../models/projects.js";
import Workspace from "../models/workspace.js";

export const createProject = async (req, res) => {
    try {
        const { workspaceid } = req.params;
        const {
            title,
            description,
            status,
            startDate,
            endDate,
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
            return res.status(401).json({ message: "You are not a member of this workspace" });
        }

        const tagsArray = Array.isArray(tags) ? tags : [];

        const newProject = new Project({
            title,
            description,
            workspace: workspaceid,
            status,
            startDate,
            endDate,
            tags: tagsArray,
            members,
            createdBy: req.user._id,
        });

        await newProject.save();

        workspace.projects.push(newProject._id);
        await workspace.save();

        res.status(200).json({ message: "New project created successfully", newProject, workspace });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
