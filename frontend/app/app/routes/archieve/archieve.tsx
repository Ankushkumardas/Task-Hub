import React from "react";
import { useParams } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useGetArchivedProjectsQuery } from "~/hooks/useWorkspace";

const Archieve = () => {
  const { workspaceid } = useParams<{ workspaceid: string }>();
  console.log(workspaceid);
  const { data } = useGetArchivedProjectsQuery(workspaceid ?? "");
  console.log(data?.workspace?.projects);
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Archived Tasks</h1>
      {data?.workspace?.projects?.length === 0 && (
        <span className="text-muted-foreground">No projects found.</span>
      )}
      {data?.workspace?.projects?.map((project: any) => (
        <div key={project._id} className="mb-6">
          <h2 className="text-[16px] mb-2">
            <span className=" font-semibold">Project: </span>
            <span className="text-slate-600 font-medium ">{project.title.charAt(0).toUpperCase() + project.title.slice(1)}</span>
            </h2>
          <div className="flex flex-wrap gap-4">
            {project.tasks.length === 0 ? (
              <span className="text-muted-foreground">
                No archived tasks in this project.
              </span>
            ) : (
              project.tasks.map((task: any) => (
                <Card key={task._id} className="w-full max-w-md">
                    <CardHeader className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-md font-medium">{task.title}</h3>
                            <Badge variant="outline" className="text-xs px-2 py-1">{task.status}</Badge>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">{task.priority}</Badge>
                            <Badge variant="secondary" className="text-xs">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-600 mb-2">
                                    {task.description.length > 100
                                        ? task.description.slice(0, 100) + "..."
                                        : task.description}
                                </p>
                                <div className="mb-2">
                                    <span className="font-semibold text-xs">Assignees:</span>
                                    {task.assignees && task.assignees.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {task.assignees.map((assignee: any) => (
                                                <Badge key={assignee._id} variant="outline" className="text-xs">{assignee.name}</Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground ml-1">None</span>
                                    )}
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold text-xs">Tags:</span>
                                    {task.tags && task.tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {task.tags.map((tag: any, idx: number) => (
                                                <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground ml-1">None</span>
                                    )}
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold text-xs">Subtasks:</span>
                                    {task.subtasks && task.subtasks.length > 0 ? (
                                        <ul className="list-disc list-inside text-xs text-slate-500 mt-1">
                                            {task.subtasks.map((subtask: any) => (
                                                <li key={subtask._id}>{subtask.title}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-xs text-muted-foreground ml-1">None</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="mb-2">
                                    <span className="font-semibold text-xs">Comments:</span>
                                    <Badge variant="outline" className="text-xs ml-1">{task.comments?.length ?? 0}</Badge>
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold text-xs">Attachments:</span>
                                    <Badge variant="outline" className="text-xs ml-1">{task.attachments?.length ?? 0}</Badge>
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold text-xs">Watchers:</span>
                                    <Badge variant="outline" className="text-xs ml-1">{task.watchers?.length ?? 0}</Badge>
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold text-xs">Created At:</span>
                                    <span className="text-xs ml-1">
                                        {task.createdAt ? new Date(task.createdAt).toLocaleString() : "N/A"}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold text-xs">Updated At:</span>
                                    <span className="text-xs ml-1">
                                        {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Archieve;
