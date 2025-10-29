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

export const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceid } = req.params;
    const workspace = await Workspace.findById(
       workspaceid
    );
    if (!workspace) {
      return res.status(401).json({ message: "Workspace not found" });
    }   
    const ismember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );  
    if (!ismember) {
      return res.status(401).json({ message: "You are not a member of this workspace" });
    } 
    const [totalProjects, projects] = await Promise.all([
      Project.countDocuments({
      workspace: workspaceid,
      }),
      Project.find({
      workspace: workspaceid,
      }).populate("tasks").sort({ createdAt: -1 }),
    ]);

  // Aggregate stats from projects, tasks, and subtasks
  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);

  const inProgressTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter((task) => task.status === "In Progress").length,
    0
  );

  const completedTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter((task) => task.status === "Completed").length,
    0
  );

  const pendingTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter((task) => task.status === "Pending").length,
    0
  );

  // Priority stats
  const priorityStats = projects.reduce((acc, project) => {
    project.tasks.forEach((task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
    });
    return acc;
  }, {});

  // Subtasks stats
  const totalSubtasks = projects.reduce(
    (acc, project) =>
      acc +
      project.tasks.reduce((subAcc, task) => subAcc + (task.subtasks ? task.subtasks.length : 0), 0),
    0
  );

  const completedSubtasks = projects.reduce(
    (acc, project) =>
      acc +
      project.tasks.reduce(
        (subAcc, task) =>
          subAcc +
          (task.subtasks
            ? task.subtasks.filter((subtask) => subtask.status === "Completed").length
            : 0),
        0
      ),
    0
  );

  const overdueTasks = projects.reduce(
    (acc, project) =>
      acc +
      project.tasks.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate) < new Date() &&
          task.status !== "Completed"
      ).length,
    0
  );

  // Upcoming tasks: tasks with dueDate in the future and not completed
  const upcomingTasks = projects.reduce(
    (acc, project) =>
      acc +
      project.tasks.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate) > new Date() &&
          task.status !== "Completed"
      ).length,
    0
  );

  // Status breakdown
  const statusStats = {
    todo: 0,
    inProgress: 0,
    completed: 0,
    done: 0,
  };

  projects.forEach((project) => {
    project.tasks.forEach((task) => {
      const status = (task.status || "").toLowerCase();
      if (status === "todo") statusStats.todo++;
      else if (status === "in progress") statusStats.inProgress++;
      else if (status === "completed") statusStats.completed++;
      else if (status === "done") statusStats.done++;
    });
  });

  // Helper for date ranges
  const getRangeCount = (start, end) => {
    let count = 0;
    projects.forEach((project) => {
      project.tasks.forEach((task) => {
        if (task.createdAt) {
          const createdDate = new Date(task.createdAt);
          if (createdDate >= start && createdDate <= end) count++;
        }
      });
    });
    return count;
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  const startOf6Months = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(startOfToday);
    day.setDate(startOfToday.getDate() - i);
    last7Days.push(day);
  }
  const last7DaysTasks = last7Days.map((day) => {
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    return {
      date: day.toISOString().slice(0, 10),
      count: getRangeCount(day, nextDay),
    };
  });

  // Last month, quarter, 6 months, year
  const lastMonthTasks = getRangeCount(startOfMonth, now);
  const lastQuarterTasks = getRangeCount(startOfQuarter, now);
  const last6MonthsTasks = getRangeCount(startOf6Months, now);
  const lastYearTasks = getRangeCount(startOfYear, now);

  // Tasks by status for each day of week
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const tasksByStatusPerDay = {};
  daysOfWeek.forEach((day) => {
    tasksByStatusPerDay[day] = { todo: 0, inProgress: 0, completed: 0, done: 0 };
  });

  projects.forEach((project) => {
    project.tasks.forEach((task) => {
      if (task.createdAt) {
        const createdDate = new Date(task.createdAt);
        const dayName = daysOfWeek[createdDate.getDay()];
        const status = (task.status || "").toLowerCase();
        if (status === "todo") tasksByStatusPerDay[dayName].todo++;
        else if (status === "in progress") tasksByStatusPerDay[dayName].inProgress++;
        else if (status === "completed") tasksByStatusPerDay[dayName].completed++;
        else if (status === "done") tasksByStatusPerDay[dayName].done++;
      }
    });
  });

  // Tasks trend from Sunday to Monday (last 7 days)
  const trendDaysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - today.getDay());
  const tasksTrend = {};
  for (let i = 0; i < 7; i++) {
    const date = new Date(lastSunday);
    date.setDate(lastSunday.getDate() + i);
    const key = trendDaysOfWeek[date.getDay()];
    tasksTrend[key] = 0;
  }
  projects.forEach((project) => {
    project.tasks.forEach((task) => {
      if (task.createdAt) {
        const createdDate = new Date(task.createdAt);
        if (createdDate >= lastSunday && createdDate <= today) {
          const dayName = trendDaysOfWeek[createdDate.getDay()];
          tasksTrend[dayName]++;
        }
      }
    });
  });

  // Get all subtasks from all projects and populate their data
  // Get all subtasks from all projects and populate their data with user/member info
  const allSubtasks = [];
  for (const project of projects) {
    for (const task of project.tasks) {
      if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
        for (const subtask of task.subtasks) {
          // If subtask has an assigned user, populate their info from workspace members
          let assignedUser = null;
          if (subtask.assignedTo) {
            const member = workspace.members.find(
              (m) => m.user.toString() === subtask.assignedTo.toString()
            );
            if (member && member.user && member.user.name) {
              assignedUser = {
                _id: member.user._id,
                name: member.user.name,
                email: member.user.email,
                role: member.role,
              };
            }
          }
          allSubtasks.push({
            ...subtask.toObject ? subtask.toObject() : subtask,
            assignedUser,
          });
        }
      }
    }
  }
 

  res.status(200).json({
    message: "Workspace stats",
    totalProjects,
    projects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    priorityStats,
    totalSubtasks,
    completedSubtasks,
    overdueTasks,
    upcomingTasks,
    statusStats,
    last7DaysTasks,
    lastMonthTasks,
    lastQuarterTasks,
    last6MonthsTasks,
    lastYearTasks,
    tasksByStatusPerDay,
    tasksTrend,
    allSubtasks
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internel server error" });
  }
};
