import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { useProjectQuery } from "~/hooks/useProject";
import { getProjectProgress } from "~/lib";
import type { Project, Task, TaskStatus } from "~/types";
import CreateTaskDialog from "~/components/tasks/CreateTaskDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import TaskCard from "~/components/tasks/TaskCard";

const ProjectDetails = () => {
  const { projectid, workspaceid } = useParams<{
    projectid: string;
    workspaceid: string;
  }>();

  const navigate = useNavigate();
  const [isCreatetask, setisCreatetask] = useState(false);
  const [taskfilter, settaskfilter] = useState<TaskStatus | "all">("all");

  const { data, isLoading, refetch } = useProjectQuery(projectid as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  const { project, tasks } = data as { project: Project; tasks: Task[] };
  const projectprogress = getProjectProgress(tasks);
  const projectMembers = project.members || [];

  const handleTaskClick = (taskid: string) => {
    navigate(`/workspaces/${workspaceid}/projects/${projectid}/tasks/${taskid}`);
  };

  return (
    <div className="p-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-2">
            ← Back
          </Button>
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          {project.description && (
            <p className="text-gray-600 mt-1">{project.description}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex flex-col items-start w-full sm:w-auto">
            <span className="text-sm text-gray-700 font-medium mb-1">Progress</span>
            <Progress value={projectprogress} className="w-40" />
            <span className="text-sm text-gray-600 mt-1">{projectprogress}%</span>
          </div>
          <Button onClick={() => setisCreatetask(true)}>+ Add Task</Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="w-full">
        {/* Tab Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <TabsList className="flex gap-2">
            <TabsTrigger value="all" onClick={() => settaskfilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="todo" onClick={() => settaskfilter("To Do")}>
              To Do
            </TabsTrigger>
            <TabsTrigger value="inprogress" onClick={() => settaskfilter("In Progress")}>
              In Progress
            </TabsTrigger>
            <TabsTrigger value="done" onClick={() => settaskfilter("Done")}>
              Done
            </TabsTrigger>
          </TabsList>

          {/* Status Counts */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="px-3 text-sm">
              {tasks.filter((t) => t.status === "To Do").length} To Do
            </Button>
            <Button variant="outline" className="px-3 text-sm">
              {tasks.filter((t) => t.status === "In Progress").length} In Progress
            </Button>
            <Button variant="outline" className="px-3 text-sm">
              {tasks.filter((t) => t.status === "Done").length} Done
            </Button>
          </div>
        </div>

        {/* Task Columns */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <TaskColumn
              title="To Do"
              tasks={tasks.filter((t) => t.status === "To Do")}
              ontaskClick={handleTaskClick}
            />
            <TaskColumn
              title="In Progress"
              tasks={tasks.filter((t) => t.status === "In Progress")}
              ontaskClick={handleTaskClick}
            />
            <TaskColumn
              title="Done"
              tasks={tasks.filter((t) => t.status === "Done")}
              ontaskClick={handleTaskClick}
            />
          </div>
        </TabsContent>

        <TabsContent value="todo">
          <TaskColumn
            title="To Do"
            tasks={tasks.filter((t) => t.status === "To Do")}
            ontaskClick={handleTaskClick}
          />
        </TabsContent>

        <TabsContent value="inprogress">
          <TaskColumn
            title="In Progress"
            tasks={tasks.filter((t) => t.status === "In Progress")}
            ontaskClick={handleTaskClick}
          />
        </TabsContent>

        <TabsContent value="done">
          <TaskColumn
            title="Done"
            tasks={tasks.filter((t) => t.status === "Done")}
            ontaskClick={handleTaskClick}
          />
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreatetask}
        onOpenChange={setisCreatetask}
        projectid={projectid ?? ""}
        projectmember={projectMembers as any}
        refetchTasks={refetch}
      />
    </div>
  );
};

export default ProjectDetails;

type TaskColumnProps = {
  title: string;
  tasks: Task[];
  ontaskClick: (taskid: string) => void;
};

const TaskColumn = ({ title, tasks, ontaskClick }: TaskColumnProps) => {
  return (
    <div className="bg-gray-50 rounded-2xl shadow-sm p-4 border border-gray-200 min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-600 bg-gray-200 rounded-full px-3 py-1">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {tasks.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No Tasks</div>
        ) : (
          tasks.map((t) => (
            <div
              key={t._id}
              className="w-full"
              onClick={() => ontaskClick(t._id)}
            >
              <TaskCard key={t._id} task={t} onclick={() => ontaskClick(t._id)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
