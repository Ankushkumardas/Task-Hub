import Project from "../models/projects.js";
import Workspace from "../models/workspace.js";
import Task from "../models/task.js";
import Activity from "../models/activity.js";
export const createTask = async (req, res) => {
  try {
    const { projectid } = req.params;
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
    } = req.body;

    const project = await Project.findById(projectid);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const workspace = await Workspace.findById(project.workspace);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const ismember = workspace.members.find(
      (member) => member.user.toString() === req.user.id
    );
    if (!ismember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this workspace" });
    }
    const newtask = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
      project: projectid,
      createdBy: req.user.id,
    });
    await newtask.save();
    project.tasks.push(newtask._id);
    await project.save();
    return res
      .status(201)
      .json({ message: "Task created successfully", task: newtask });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskDetails = async (req, res) => {
  try {
    const { taskid } = req.params;
    const task = await Task.findById(taskid)
      .populate("assignees")
      .populate("createdBy")
      .populate({
        path: "project",
        populate: {
          path: "members.user",
          select: "name email",
        },
      })
      .populate("watchers");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project).populate(
      "members.user",
      "name email"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    // normalize subtasks to include `completed` boolean for the client
    const taskObj = task.toObject ? task.toObject() : task;
    taskObj.subtasks = (taskObj.subtasks || []).map((st) => ({
      ...st,
      completed: st.completed ?? st.comleted ?? st.isCompleted ?? false,
    }));
    return res.status(200).json({ message: "Task details", task: taskObj, project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTasktitle = async (req, res) => {
  try {
    const { taskid } = req.params;
    const { title } = req.body;
    const task = await Task.findById(taskid);
    if (!task) {
      return res.status(401).json({ message: "Task not found" });
    }
    // Fix: task.project may be ObjectId, not object
    const projectid = task.project._id ? task.project._id : task.project;
    const project = await Project.findById(task.project._id);
    if (!project) {
      return res.status(401).json({ message: "Project not found" });
    }
    // Fix: project.members may be array of {user: ObjectId} or {user: {_id: ...}}
    const ismember = project.members.some((m) => {
      if (m.user._id) {
        return m.user._id.toString() === req.user._id.toString();
      }
      return m.user.toString() === req.user._id.toString();
    });
    if (!ismember) {
      return res.status(401).json({ message: "member not found" });
    }
    const oldtitle = task.title;
    task.title = title;
    await task.save();
    //record activity (optional)
    try {
      await recordActivity({
        userid: req.user.id,
        action: "updated_task",
        resourceType: "Task",
        details: {
          oldtitle,
          newtitle: title,
        },
        resourceid: task._id,
      });
    } catch (activityError) {
      console.error("Activity log error:", activityError);
    }

    res.status(200).json({ message: "task title updated", task, project });
  } catch (error) {
    console.error("Update task title error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskDescription = async (req, res) => {
  try {
    const { taskid } = req.params;
    const { description } = req.body;
    const task = await Task.findById(taskid);
    if (!task) {
      return res.status(401).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project._id);
    if (!project) {
      return res.status(401).json({ message: "Project not found" });
    }
    const ismember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!ismember) {
      return res.status(401).json({ message: "member not found" });
    }
    const olddescription = task.description;
    task.description = description;
    await task.save();
    //record activity (optional)
    try {
      const activity = await recordActivity({
        userid: req.user.id,
        action: "updated_task_description",
        resourceType: "Task",
        details: {
          olddescription,
          newdescription: description,
        },
        resourceid: task._id,
      });
    } catch (activityError) {
      console.error("Activity log error:", activityError);
    }
    res
      .status(200)
      .json({ message: "task description updated", task, project });
  } catch (error) {
    console.error("Update task description error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskid } = req.params;
    const { status } = req.body;
    const task = await Task.findById(taskid);
    if (!task) {
      return res.status(401).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project._id);
    if (!project) {
      return res.status(401).json({ message: "Project not found" });
    }
    const ismember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!ismember) {
      return res.status(401).json({ message: "member not found" });
    }

    const oldstatus = task.status;
    // Debug log
    console.log("Updating status:", { taskid, oldstatus, newstatus: status });
    task.status = status;
    await task.save();
    //record activity (optional)
    try {
      const activity = await recordActivity({
        userid: req.user.id,
        action: "updated_task_status",
        resourceType: "Task",
        details: {
          oldstatus,
          newstatus: status,
        },
        resourceid: task._id,
      });
    } catch (activityError) {
      console.error("Activity log error:", activityError);
    }
    res.status(200).json({ message: "task status updated", task, project });
  } catch (error) {
    console.error("Update task status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskAssignee = async (req, res) => {
  try {
    const { taskid } = req.params;
    const { assignees } = req.body;
    const task = await Task.findById(taskid);
    if (!task) {
      return res.status(401).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project._id);
    if (!project) {
      return res.status(401).json({ message: "Project not found" });
    }
    const ismember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!ismember) {
      return res.status(401).json({ message: "member not found" });
    }
    const oldassignees = task.assignees;
    task.assignees = assignees ? [assignees] : [];
    await task.save();
    //record activity (optional)
    try {
      const activity = await recordActivity({
        userid: req.user.id,
        action: "updated_task_assignee",
        resourceType: "Task",
        details: {
          oldassignees,
          new: assignees ? [assignees] : [],
        },
        resourceid: task._id,
      });
    } catch (activityError) {
      console.error("Activity log error:", activityError);
    }
    res.status(200).json({ message: "task assignee updated", task, project });
  } catch (error) {
    console.error("Update task assignee error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
async function recordActivity({
  userid,
  action,
  resourceType,
  details,
  resourceid,
}) {
  const activity = new Activity({
    user: userid,
    action,
    resourceType,
    detail: details,
    resourceId: resourceid,
  });
  await activity.save();
  return activity;
}


export const updateTaskPriority = async (req, res) => {
  try {
    const { taskid } = req.params;
    const { priority } = req.body;
    const task = await
        Task.findById(taskid);  
    if (!task) {
      return res.status(401).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project._id);
    if (!project) {
      return res.status(401).json({ message: "Project not found" });
    }
    const ismember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!ismember) {
        return res.status(401).json({ message: "member not found" });
    }
    const oldpriority = task.priority;
    task.priority = priority;
    await task.save();
    //record activity (optional)
    try {
        await recordActivity({
        userid: req.user.id,
        action: "updated_task_priority",
        resourceType: "Task",
        details: {
            oldpriority,
            newpriority: priority,
        },
        resourceid: task._id,
        });
    }
    catch (activityError) {
        console.error("Activity log error:", activityError);
    }
    res.status(200).json({ message: "task priority updated", task, priority: task?.priority });
  } catch (error) {
    console.error("Update task priority error:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
};

export const addSubtaskToTask = async (req, res) => {
  try {
    const { taskid } = req.params;
    const { title } = req.body;
    const task = await Task.findById(taskid);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }   
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const ismember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!ismember) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }
    // normalize subtask fields: support existing variants and new `completed` field
    const newSubtask = {
      title,
      // write to multiple keys for compatibility with older documents
      comleted: false,
      isCompleted: false,
      completed: false,
    };
    task.subtasks.push(newSubtask);
    await task.save();
//recorrd activity (optional)
    try {
      await recordActivity({
        userid: req.user.id,
        action: "created_suntask",
        resourceType: "Subtask",
        details: {
          title,
          taskId: task._id,
        },
        resourceid: task._id,
      });
    } catch (activityError) {
        console.error("Activity log error:", activityError);
    };

    // return a normalized subtask shape (use `completed` as canonical)
    const returned = { ...newSubtask, completed: false };
    res.status(201).json({ message: "Subtask added", subtask: returned });
  } catch (error) {
    console.error("Add subtask error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatesubtask=async (req,res)=>{
  try {
    const { taskid, subtaskid } = req.params;
    // accept `completed` from client (this matches route validation)
    const { title, completed } = req.body;
    const
        task = await Task.findById(taskid); 
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const subtask = task.subtasks.find((st) => st._id.toString() === subtaskid);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }
  subtask.title = title;
  // normalize and persist the boolean across possible field names
  subtask.comleted = completed;
  subtask.isCompleted = completed;
  subtask.completed = completed;
    await task.save();
    //record activity (optional)
    try {
        await recordActivity({
        userid: req.user.id,
        action: "updated_suntask",
        resourceType: "Subtask",
        details: {
            subtaskid,
            title,
            isCompleted,
        },
        resourceid: task._id,
        });
    }
    catch (activityError) {
        console.error("Activity log error:", activityError);
    };

    // normalize response to include `completed` boolean
    const respSubtask = Object.assign({}, subtask.toObject ? subtask.toObject() : subtask, {
      completed: completed,
    });
    res.status(200).json({ message: "Subtask updated", subtask: respSubtask });
  }
    catch (error) {
    console.error("Update subtask error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubtask = async (req, res) => {
  try {
    const { taskid, subtaskid } = req.params;
    const task = await Task.findById(taskid);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }   
    const subtask = task.subtasks.id(subtaskid);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }
    subtask.remove();
    await task.save();
    res.status(200).json({ message: "Subtask deleted" });
  }
    catch (error) {
    console.error("Delete subtask error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};