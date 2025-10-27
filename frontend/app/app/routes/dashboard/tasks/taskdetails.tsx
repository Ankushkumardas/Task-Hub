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

const TaskDetails = () => {
  const { taskid, projectid, workspaceid } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useTaskQuery(taskid as string);
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
      className="max-w-xl  mt-10 p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-lg shadow-blue-100/40 border border-blue-100"
    >
      <div className="flex items-center justify-between mb-6">
      <Button
        onClick={() => {}}
        className="flex items-center gap-2 transition-all duration-200 hover:bg-blue-100"
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
        className="transition-all duration-200 hover:scale-105"
      >
        Delete Task
      </Button>
      </div>
      <TaskTitle
      title={data.task.title}
      taskid={data.task._id}
      key={data.task.title}
      />
      <div className="mb-4 text-gray-700 flex items-center gap-2 font-medium">
      <span className="font-semibold">Description:</span>
      <TaskDescription description={data.task.description} taskid={taskid as string} />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
      <div className=" flex items-center gap-2">
        <p>Status:</p>
        <TaskStatusSelector status={data.task.status} taskid={data.task._id} />
      </div>
      <div>
        <span className="font-semibold">Priority:</span>{" "}
        <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">
        {data.task?.priority}
        </span>
      </div>
      <div>
        <span className="font-semibold">Due Date:</span>{" "}
        {data.task?.dueDate ? (
        <span className="text-blue-700">
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
      <div>
        <span className="font-semibold">Created At:</span>{" "}
        <span className="text-gray-600">
        {data.task?.createdAt &&
          formatDistanceToNow(new Date(data.task.createdAt), {
          addSuffix: true,
          })}
        </span>
      </div>
      <div>
        <span className="font-semibold">Updated At:</span>{" "}
        <span className="text-gray-600">
        {data.task?.updatedAt &&
          formatDistanceToNow(new Date(data.task.updatedAt), {
          addSuffix: true,
          })}
        </span>
      </div>
      <div>
        <Button
        onClick={() => {}}
        className="flex items-center gap-2 transition-all duration-200 hover:bg-blue-100"
        >
        {data.task.isArchieve ? (
          <>
          <EyeOff className="w-5 h-5" />
          <span>UnArchieve</span>
          </>
        ) : (
          <>
          <Eye className="w-5 h-5" />
          <span>Archieve</span>
          </>
        )}
        </Button>
      </div>
      </div>
      <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-4"
      >
      <span className="font-semibold">Tags:</span>{" "}
      {data.task?.tags && data.task.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-1">
        {data.task.tags.map((tag: string, idx: number) => (
          <span
          key={idx}
          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 hover:bg-blue-200"
          >
          {tag}
          </span>
        ))}
        </div>
      ) : (
        <span className="text-gray-400">No tags</span>
      )}
      </motion.div>

      <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mb-4"
      >
        <TaskAssigneesSelector assignees={data.task.assignees} taskid={taskid as string} task={data?.task} projectmember={data?.project?.members} />
      </motion.div>

      <div className="mb-4">
      <span className="font-semibold">Created By:</span>{" "}
      {data.task?.createdBy ? (
        <span className="text-blue-700 font-medium">
        {data.task.createdBy.name} <span className="text-gray-500">({data.task.createdBy.email})</span>
        </span>
      ) : (
        <span className="text-gray-400">Unknown</span>
      )}
      </div>
      <div className="mb-4">
      <span className="font-semibold">Subtasks:</span>
      {data.task?.subtasks && data.task.subtasks.length > 0 ? (
        <ul className="list-disc ml-6">
        {data.task.subtasks.map((subtask: any, idx: number) => (
          <li key={idx} className="text-blue-700">{subtask.title || subtask}</li>
        ))}
        </ul>
      ) : (
        <span className="text-gray-400 ml-2">No subtasks</span>
      )}
      </div>
      <div className="mb-4">
      <span className="font-semibold">Attachments:</span>
      {data.task?.attachments && data.task.attachments.length > 0 ? (
        <ul className="list-disc ml-6">
        {data.task.attachments.map((att: any, idx: number) => (
          <li key={idx} className="text-blue-700">{att.name || att}</li>
        ))}
        </ul>
      ) : (
        <span className="text-gray-400 ml-2">No attachments</span>
      )}
      </div>
      <div className="mb-4">
      <span className="font-semibold">Comments:</span>
      {data.task?.comments && data.task.comments.length > 0 ? (
        <ul className="list-disc ml-6">
        {data.task.comments.map((comment: any, idx: number) => (
          <li key={idx} className="text-blue-700">{comment.text || comment}</li>
        ))}
        </ul>
      ) : (
        <span className="text-gray-400 ml-2">No comments</span>
      )}
      </div>
      <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="mb-4"
      >
      <span className="font-semibold">Project:</span>
      {data.task?.project ? (
        <div className="ml-2">
        <div>
          <span className="font-semibold">Title:</span>{" "}
          <span className="text-blue-700">{data.task.project.title}</span>
        </div>
        <div>
          <span className="font-semibold">Description:</span>{" "}
          <span className="text-gray-600">{data.task.project.description}</span>
        </div>
        <div>
          <span className="font-semibold">Status:</span>{" "}
          <span className="text-blue-700">{data.task.project.status}</span>
        </div>
        <div>
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
          <ul className="list-disc ml-6">
            {data.task.project.members.map((member: any, idx: number) => (
            <li key={idx} className="text-blue-700">
              {member.role} - {member.user.name} <span className="text-gray-500">({member.user.email})</span>
            </li>
            ))}
          </ul>
          ) : (
          <span className="text-gray-400 ml-2">No members</span>
          )}
        </div>
        </div>
      ) : (
        <span className="text-gray-400 ml-2">No project info</span>
      )}
      </motion.div>
    </motion.div>
  );
};

export default TaskDetails;
