import React from "react";
import { useNavigate, useParams } from "react-router";
import { useTaskQuery } from "~/hooks/useTask";
import TaskTitle from "./TaskTitle";
import { Button } from "~/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import TaskStatusSelector from "./TaskStatusSelector";
import { AnimatePresence, motion } from "framer-motion";
import TaskDescription from "./TaskDescription";
import TaskAssigneesSelector from "./TaskAssigneesSelector";
import TaskPriority from "./TaskPriority";
import SubtasksDetails from "./SubtasksDetails";
import Watchers from "./watchers";
import Activity from "./Activity";

const TaskDetails = () => {
  const { taskid, projectid, workspaceid } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useTaskQuery(taskid as string);
  console.log(data?.task)
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <AnimatePresence>
          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: "linear",
              repeat: Infinity,
            }}
            className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full"
          />
        </AnimatePresence>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full p-3  mt-2"
    >
      <div className="flex items-center justify-between mb-8">
      <Button
        onClick={() => {}}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold shadow transition"
      >
        {data.task.watchers ? (
        <>
          <EyeOff className="w-5 h-5" />
          <span>UnWatch</span>
        </>
        ) : (
        <>
          <Eye className="w-5 h-5" />
          <span>Watch</span>
        </>
        )}
      </Button>
      <Button
        variant="destructive"
        onClick={() => {}}
        className="px-4 py-2 rounded-lg font-semibold shadow hover:scale-105"
      >
        Delete Task
      </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column: Subtasks, Tags, Attachments, Comments, Project */}
      <div className="flex flex-col gap-6 border p-3 rounded-md bg-white shadow-md">
        {/* Subtasks */}
        <div>
          <span className="font-semibold text-gray-600">Subtasks:</span>
          <SubtasksDetails subtasks={data.task.subtasks||[]} taskid={taskid ?? ""} />  
        </div>
        {/* Tags */}
        <div>
          <span className="font-semibold text-gray-600">Tags:</span>{" "}
          {data.task?.tags && data.task.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {data.task.tags.map((tag: string, idx: number) => (
            <span
          key={idx}
          className="px-3 py-1 bg-gradient-to-r from-purple-200 to-purple-400 text-purple-900 rounded-full text-xs font-semibold shadow hover:scale-105 transition"
            >
          {tag}
            </span>
          ))}
        </div>
          ) : (
        <span className="text-gray-400 ml-2">No tags</span>
          )}
        </div>
        {/* Attachments */}
        <div>
          <span className="font-semibold text-gray-600">Attachments:</span>
          {data.task?.attachments && data.task.attachments.length > 0 ? (
        <div className="flex flex-col gap-2 mt-2">
          {data.task.attachments.map((att: any, idx: number) => (
            <a
          key={idx}
          href={att.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-gradient-to-r from-green-200 to-green-400 text-green-900 rounded-lg text-xs font-semibold shadow hover:underline hover:scale-105 transition"
            >
          {att.name || att}
            </a>
          ))}
        </div>
          ) : (
        <span className="text-gray-400 ml-2">No attachments</span>
          )}
        </div>
        {/* Comments */}
        <div>
          <span className="font-semibold text-gray-600">Comments:</span>
          {data.task?.comments && data.task.comments.length > 0 ? (
        <div className="flex flex-col gap-2 mt-2">
          {data.task.comments.map((comment: any, idx: number) => (
            <div
          key={idx}
          className="bg-gray-100 rounded-lg px-3 py-2 text-gray-700 shadow hover:scale-105 transition"
            >
          <span className="font-semibold">{comment.user?.name || "User"}:</span>{" "}
          {comment.text || comment}
            </div>
          ))}
        </div>
          ) : (
        <span className="text-gray-400 ml-2">No comments</span>
          )}
        </div>
        {/* watchers */}
        <div>
          <Watchers watchers={data.task?.watcher||[]}/>
        </div>
        {/* Project */}
        <div>
          <span className="font-semibold text-gray-600">Project:</span>
          {data.task?.project ? (
        <div className="ml-2 mt-2 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow">
          <div className="mb-2">
            <span className="font-semibold">Title:</span>{" "}
            <span className="text-blue-700">{data.task.project.title}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Description:</span>{" "}
            <span className="text-gray-600">{data.task.project.description}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Status:</span>{" "}
            <span className="text-blue-700">{data.task.project.status}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Due Date:</span>{" "}
            <span className="text-blue-700">
          {data.task.project.dueDate
            ? new Date(data.task.project.dueDate).toLocaleString()
            : "-"}
            </span>
          </div>
          <div>
            <span className="font-semibold">Members:</span>
            {data.task.project.members &&
            data.task.project.members.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.task.project.members.map((member: any, idx: number) => (
              <span
            key={idx}
            className="px-3 py-1 bg-gradient-to-r from-blue-300 to-blue-500 text-white rounded-full text-xs font-semibold shadow"
              >
            {member.role} - {member.user.name} <span className="text-gray-200">({member.user.email})</span>
              </span>
            ))}
          </div>
            ) : (
          <span className="text-gray-400 ml-2">No members</span>
            )}
          </div>
        </div>
          ) : (
        <span className="text-gray-400 ml-2">No project info</span>
          )}
        </div>
      </div>
      
      {/* Right Column: All other details */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 border p-6 rounded-xl bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-lg">
        {/* Left: Title, Description, Status, Priority */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <TaskTitle
              title={data.task.title}
              taskid={data.task._id}
              key={data.task.title}
            />
            <TaskPriority priority={data.task.priority} taskid={data.task._id} />
          </div>
          <div>
            <span className="font-semibold text-gray-600">Description:</span>
            <TaskDescription description={data.task.description} taskid={taskid as string} />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-600">Status:</span>
            <TaskStatusSelector status={data.task.status} taskid={data.task._id} />
          </div>
          <div>
            <span className="font-semibold text-gray-600">Due Date:</span>{" "}
            {data.task?.dueDate ? (
              <span className="text-blue-700 font-medium">
                {new Date(data.task.dueDate).toLocaleString()}
                {" ("}
                {formatDistanceToNow(new Date(data.task.dueDate), {
                  addSuffix: true,
                })}
                {")"}
              </span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
          <div className="flex gap-4">
            <div>
              <span className="font-semibold text-gray-600">Created:</span>{" "}
              <span className="text-gray-500">
                {data.task?.createdAt &&
                  formatDistanceToNow(new Date(data.task.createdAt), {
                    addSuffix: true,
                  })}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Updated:</span>{" "}
              <span className="text-gray-500">
                {data.task?.updatedAt &&
                  formatDistanceToNow(new Date(data.task.updatedAt), {
                    addSuffix: true,
                  })}
              </span>
            </div>
          </div>
          <Button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold shadow transition"
          >
            {data.task.isArchieve ? (
              <>
                <EyeOff className="w-5 h-5" />
                <span>UnArchive</span>
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                <span>Archive</span>
              </>
            )}
          </Button>
        </div>
        {/* Right: Created By, Assignees */}
        <div className="flex flex-col gap-6 justify-between">
          <div>
            <span className="font-semibold text-gray-600">Created By:</span>{" "}
            {data.task?.createdBy ? (
              <span className="text-blue-700 font-medium">
                {data.task.createdBy.name} <span className="text-gray-500">({data.task.createdBy.email})</span>
              </span>
            ) : (
              <span className="text-gray-400 ml-2">Unknown</span>
            )}
          </div>
          <div>
            <span className="font-semibold text-gray-600">Assignees:</span>
            <TaskAssigneesSelector
              assignees={data.task.assignees}
              taskid={taskid as string}
              task={data?.task}
              projectmember={data?.project?.members}
            />
          </div>
          {/* Add more info blocks here if needed */}
        </div>
      </div>

      {/* Activity */}
      <div>
            <Activity resourceid={data?.task?._id}/>
      </div>
      </div>
    </motion.div>
  );
};

export default TaskDetails;
