import Project from '../models/projects.js'
import Workspace from '../models/workspace.js'
import Task from '../models/task.js'
import Activity from '../models/activity.js'
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
        const task = await Task.findById(taskid)
            .populate('assignees')
            .populate('createdBy')
            .populate({
            path: 'project',
            populate: {
                path: 'members.user',
                select: 'name email'
            }
            }).populate("watchers");
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        const project=await Project.findById(task.project).populate("members.user","name email");
        if(!project){
            return res.status(404).json({message:"Project not found"});
        }
        return res.status(200).json({message:"Task details",task,project});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const updateTasktitle=async(req,res)=>{
    try {
        const {taskid}=req.params;
        const {title}=req.body;
        const task=await Task.findById(taskid);
        if(!task){
                return res.status(401).json({message:"Task not found"})
        }
        // Fix: task.project may be ObjectId, not object
        const projectid = task.project._id ? task.project._id : task.project;
        const project=await Project.findById(task.project._id);
        if(!project){
                 return res.status(401).json({message:"Project not found"})
        }
        // Fix: project.members may be array of {user: ObjectId} or {user: {_id: ...}}
        const ismember=project.members.some((m)=>{
            if (m.user._id) {
                return m.user._id.toString()===req.user._id.toString();
            }
            return m.user.toString()===req.user._id.toString();
        });
        if(!ismember){
                 return res.status(401).json({message:"member not found"})
        }
        const oldtitle=task.title;
        task.title=title;
        await task.save();
        //record activity (optional)
            const activity=await Activity({
                    userid:req.user.id,
                    action:"updated_task",
                    resourceType:"Task",
                    details:{
                            oldtitle,
                            newtitle:title
                    },
                    resourceid:task._id
            });
        
        res.status(200).json({message:"task title updated",task,project,activity});
    } catch (error) {
        console.error('Update task title error:', error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const updateTaskDescription=async(req,res)=>{
  try {
    const {taskid}=req.params;
    const {description}=req.body;
    const task=await Task.findById(taskid);
    if(!task){
        return res.status(401).json({message:"Task not found"})
    }   
    const project=await Project.findById(task.project._id);
    if(!project){
         return res.status(401).json({message:"Project not found"})
    }   
    const ismember=project.members.some((m)=>m.user.toString()===req.user._id.toString());
    if(!ismember){
         return res.status(401).json({message:"member not found"})
    }
    const olddescription=task.description;
    task.description=description;   
    await task.save();
    //record activity (optional)
    const activity=await recordActivity({
        userid:req.user.id,
        action:"updated_task_description",  
        resourceType:"Task",
        details:{
            olddescription,
            newdescription:description
        },
        resourceid:task._id
    });
    res.status(200).json({message:"task description updated",task,project});
  }
    catch (error) {     
    res.status(500).json({message:"Internal server error"});
  }
};