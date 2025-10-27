import React from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useUpdateTaskPriority } from "~/hooks/useTask";
import type { TaskPriority } from "~/types";

const TaskPrioritySelector = ({
  priority,
  taskid,
}: {
  priority: TaskPriority;
  taskid: string;
}) => {
  const { mutate } = useUpdateTaskPriority();
  const handlevaluechange = (value: TaskPriority) => {
    mutate(
      { taskid, priority: value },
      {
        onSuccess: (data: any) => {
          console.log("Priority updated");
          console.log(data);
          toast.success("Priority updated");
        },
        onError: (error: any) => {
          console.log("Error updating priority", error);
          toast.error("Error updating priority");
        },
      }
    );
  };

  return (
    <div className=" flex items-center gap-2">
      <Select value={priority} onValueChange={handlevaluechange}>
        <span className=" text-md font-semibold">Priority :</span>
        <SelectTrigger className=" border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue>{priority}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="Low"
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Low
          </SelectItem>
          <SelectItem
            value="Medium"
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Medium
          </SelectItem>
          <SelectItem
            value="High"
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          >
            High
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskPrioritySelector;
