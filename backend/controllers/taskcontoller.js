import Project from '../models/projects.js'
import Workspace from '../models/workspace.js'
import Task from '../models/task.js'

export const createTask=async(req,res)=>{
    try {
        const {projectid}=req.params;
        const {title,description,status,priority,dueDate,assignees}=req.body;

        const project=await Project.findById(projectid);
        if(!project){
            return res.status(404).json({message:"Project not found"});
        }
        const workspace=await Workspace.findById(project.workspace);    
        if(!workspace){
            return res.status(404).json({message:"Workspace not found"});
        }
        const ismember=workspace.members.find(member=>member.user.toString()===req.user.id);
        if(!ismember){
            return res.status(403).json({message:"You are not a member of this workspace"});
        }
        const newtask=new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            assignees,
            project:projectid,
            createdBy:req.user.id
        });
        await newtask.save();
        project.tasks.push(newtask._id);
        await project.save();
        return res.status(201).json({message:"Task created successfully",task:newtask});
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}

export const getTaskDetails=async(req,res)=>{
    try {
        const {taskid}=req.params;
        const task=await Task.findById(taskid)
            .populate('assignees')
            .populate('createdBy')
            .populate("project");
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        const project=await Project.findById(task.project).populate("members.user","name email");
        if(!project){
            return res.status(404).json({message:"Project not found"});
        }
        return res.status(200).json({message:"Task details",task});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
}