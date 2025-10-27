import { SelectContent, SelectItem } from '@radix-ui/react-select'
import React from 'react'
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useTaskUpdateStatus } from '~/hooks/useTask';
import type { TaskStatus } from '~/types';

const TaskStatusSelector = ({status,taskid}:{taskid:string,status:string}) => {
  const {mutate,isPending}=useTaskUpdateStatus();
  
  const handlestatuschnage=(value:string)=>{
    mutate({taskid,status:value as TaskStatus},{onSuccess:(data:any)=>{
        console.log("Status updated");
        console.log(data)
        toast.success("Status updated")
    },onError:(error:any)=>{
        console.log("Error updating status",error)
        toast.error("Error updating status")
    }});
  } 
  // Ensure default value is always valid
  const validStatuses = ["To Do", "In Progress", "Done"];
  const selectValue = validStatuses.includes(status) ? status : "To Do";
  return (
    <div className="w-30">
      <Select
        value={selectValue}
        onValueChange={handlestatuschnage}
      >
        <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue>{selectValue}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded shadow-md">
          <SelectItem value="To Do" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">To Do</SelectItem>
          <SelectItem value="In Progress" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">In Progress</SelectItem>
          <SelectItem value="Done" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default TaskStatusSelector
