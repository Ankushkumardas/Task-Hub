import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTaskQuery } from '~/hooks/useTask';

const TaskDetails = () => {
    const {taskid,projectid,workspaceid}=useParams();
    const navigate=useNavigate();
    // console.log(taskid)
    const {data,isLoading}=useTaskQuery(taskid as string);
    if(isLoading){
        return <div className=' h-screen flex items-center justify-center'>
            Loading
        </div>
    }
    console.log(data.task)
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{data.task?.title}</h2>
      <div className="mb-2 text-gray-700">{data.task?.description}</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="font-semibold">Status:</span> {data.task?.status}
        </div>
        <div>
          <span className="font-semibold">Priority:</span> {data.task?.priority}
        </div>
        <div>
          <span className="font-semibold">Due Date:</span> {data.task?.dueDate ? new Date(data.task.dueDate).toLocaleString() : "-"}
        </div>
        <div>
          <span className="font-semibold">Created At:</span> {data.task?.createdAt ? new Date(data.task.createdAt).toLocaleString() : "-"}
        </div>
        <div>
          <span className="font-semibold">Updated At:</span> {data.task?.updatedAt ? new Date(data.task.updatedAt).toLocaleString() : "-"}
        </div>
        <div>
          <span className="font-semibold">Is Archived:</span> {data.task?.isArchieved ? "Yes" : "No"}
        </div>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Tags:</span>{" "}
        {data.task?.tags && data.task.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {data.task.tags.map((tag: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">{tag}</span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">No tags</span>
        )}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Assignees:</span>
        {data.task?.assignees && data.task.assignees.length > 0 ? (
          <ul className="list-disc ml-6">
            {data.task.assignees.map((assignee: any, idx: number) => (
              <li key={idx}>
                {assignee.name} ({assignee.email})
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-500 ml-2">No assignees</span>
        )}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Created By:</span>{" "}
        {data.task?.createdBy ? (
          <span>
            {data.task.createdBy.name} ({data.task.createdBy.email})
          </span>
        ) : (
          <span className="text-gray-500">Unknown</span>
        )}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Subtasks:</span>
        {data.task?.subtasks && data.task.subtasks.length > 0 ? (
          <ul className="list-disc ml-6">
            {data.task.subtasks.map((subtask: any, idx: number) => (
              <li key={idx}>{subtask.title || subtask}</li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-500 ml-2">No subtasks</span>
        )}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Attachments:</span>
        {data.task?.attachments && data.task.attachments.length > 0 ? (
          <ul className="list-disc ml-6">
            {data.task.attachments.map((att: any, idx: number) => (
              <li key={idx}>{att.name || att}</li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-500 ml-2">No attachments</span>
        )}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Comments:</span>
        {data.task?.comments && data.task.comments.length > 0 ? (
          <ul className="list-disc ml-6">
            {data.task.comments.map((comment: any, idx: number) => (
              <li key={idx}>{comment.text || comment}</li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-500 ml-2">No comments</span>
        )}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Project:</span>
        {data.task?.project ? (
          <div className="ml-2">
            <div><span className="font-semibold">Title:</span> {data.task.project.title}</div>
            <div><span className="font-semibold">Description:</span> {data.task.project.description}</div>
            <div><span className="font-semibold">Status:</span> {data.task.project.status}</div>
            <div><span className="font-semibold">Due Date:</span> {data.task.project.dueDate ? new Date(data.task.project.dueDate).toLocaleString() : "-"}</div>
            <div><span className="font-semibold">Members:</span>
              {data.task.project.members && data.task.project.members.length > 0 ? (
                <ul className="list-disc ml-6">
                  {data.task.project.members.map((member: any, idx: number) => (
                    <li key={idx}>{member.role} ({member.user})</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500 ml-2">No members</span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-gray-500 ml-2">No project info</span>
        )}
      </div>
    </div>
  )
}

export default TaskDetails
