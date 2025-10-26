import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircleIcon } from 'lucide-react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
interface TaskCardProps {
    task: any;
    onclick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onclick }) => {
    return (
        <Card onClick={onclick} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>{task.title}</span>
                <span>{task.status!=="To Do"&&(<Button variant={"ghost"} onClick={()=>console.log("To do")}><AlertCircleIcon/></Button>)}
                {task.status!=="In Progress"&&(<Button variant={"ghost"} onClick={()=>console.log("In Progress")}><AlertCircleIcon/></Button>)}
                {task.status!=="Done"&&(<Button variant={"ghost"} onClick={()=>console.log("Done")}><AlertCircleIcon/></Button>)}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{task.status}</span>
            </CardTitle>
            <div className="flex gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-600' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                {task.priority}
                </span>
                {task.dueDate && (
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                )}
            </div>
            </CardHeader>
            <CardContent>
            <p className="mb-2 text-gray-700">{task.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>Assignees: {task.assignees?.length || 0}</span>
                <span>{
                    task.assignees&& task.assignees.length>0 &&(
                        <div>{task.assignees.slice(0,5).map((m:any)=>(
                            <Avatar key={m._id} title={m.name}>
                                <AvatarImage src={m.profilePicture}/>
                                <AvatarFallback >
                                    {m.name}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                        {task.assignees.length>5 &&(
                            <span>+{task.assignees.legth-5}</span>
                        )}
                        </div>
                    )}</span>
                <span>Comments: {task.comments?.length || 0}</span>
                <span>Attachments: {task.attachments?.length || 0}</span>
                <div>

                <span>Subtasks: {task.subtasks?.length || 0}</span>
                <span>{task.subtasks&&task.subtasks.length>0&&(
                    <div>
                        {task.subtasks.filter((st:any)=>st.completed).length}/{task.subtasks.length} subtasks
                    </div>
                )}</span>
                </div>
                <span>Tags: {task.tags?.length || 0}</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
                Created: {new Date(task.createdAt).toLocaleDateString()} | Updated: {new Date(task.updatedAt).toLocaleDateString()}
            </div>
            </CardContent>
        </Card>
    );
};

export default React.memo(TaskCard);

