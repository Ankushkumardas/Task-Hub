import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useUpdateTaskAssignees } from "~/hooks/useTask";
import type { ProjectMember, Task, User } from "~/types";

const TaskAssigneesSelector = ({
  assignees,
  projectmember,
  task,
  taskid,
}: {
  assignees: User[];
  taskid: string;
  task: Task;
  projectmember: { user: User; role: ProjectMember }[];
}) => {
  console.log(assignees);
  const [selectedid, setselectedid] = React.useState<string[]>(
    assignees.map((a) => a._id)
  );
  const [dropdownopen, setdropdownopen] = React.useState(false);

  const handleselectAll = () => {
    const allisd = projectmember.map((pm) => pm.user._id);
    setselectedid(allisd);
  };
  const handleunselectall = () => {
    setselectedid([]);
  };
  const {mutate,isPending}=useUpdateTaskAssignees()
  const handlesave = () => {
    mutate(
      { taskid, assignees: selectedid },
      {
        onSuccess: (data: any) => {
          toast.success("Assignees Updated");
          console.log(data);
        },
        onError: (error: any) => {
          toast.error("Assignees not updated");
        },
      }
    )
    setdropdownopen(false);
  }
  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-gray-900 text-lg">Assignees</h1>
      <div>
      {selectedid.length === 0 ? (
        <span className="text-gray-400">No assignees</span>
      ) : (
        <div className="flex flex-wrap gap-3">
        {projectmember
          .filter((pm) => selectedid.includes(pm.user._id))
          .map((pm) => (
          <div
            key={pm.user._id}
            className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm font-medium shadow"
          >
            <Avatar>
            <AvatarImage
              src={pm.user.profilepicture || undefined}
              alt={pm.user.name || "User Avatar"}
              className="w-6 h-6 rounded-full"
            />
            <AvatarFallback>
              {pm.user.name
              ? pm.user.name.charAt(0).toUpperCase()
              : "U"}
            </AvatarFallback>
            </Avatar>
            <span>
            {pm.user.name || pm.user.email || "Unnamed User"}
            </span>
          </div>
          ))}
        </div>
      )}
      </div>

      {/* dropdown for selecting assignees */}
      <div className="relative">
      <Button
        onClick={() => setdropdownopen(!dropdownopen)}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {selectedid.length === 0
        ? "Select Assignees"
        : `${selectedid.length} Assignees Selected`}
      </Button>
      {dropdownopen && (
        <div className="absolute z-20 mt-2 w-full max-h-72 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-xl">
        <div className="flex gap-2 items-center justify-between p-3 border-b border-gray-200 text-xs bg-gray-50">
          <Button
          onClick={handleselectAll}
          className="bg-green-500 text-white hover:bg-green-600 px-2 py-1 rounded"
          size="sm"
          >
          Select All
          </Button>
          <Button
          onClick={handleunselectall}
          className="bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded"
          size="sm"
          >
          Unselect All
          </Button>
        </div>
        <div className="divide-y divide-gray-100">
          {projectmember.map((pm) => (
          <div
            key={pm.user._id}
            className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition"
            onClick={() => {
            if (selectedid.includes(pm.user._id)) {
              setselectedid(
              selectedid.filter((id) => id !== pm.user._id)
              );
            } else {
              setselectedid([...selectedid, pm.user._id]);
            }
            }}
          >
            <input
            type="checkbox"
            checked={selectedid.includes(pm.user._id)}
            readOnly
            className="accent-blue-600"
            />
            <Avatar>
            <AvatarImage
              src={pm.user.profilepicture || undefined}
              alt={pm.user.name || "User Avatar"}
              className="w-6 h-6 rounded-full"
            />
            <AvatarFallback>
              {pm.user.name
              ? pm.user.name.charAt(0).toUpperCase()
              : "U"}
            </AvatarFallback>
            </Avatar>
            <span className="text-gray-800">
            {pm.user.name || pm.user.email || "Unnamed User"}
            </span>
          </div>
          ))}
        </div>
        <div className="p-3 border-t border-gray-200 flex justify-end bg-gray-50">
          <Button
          onClick={() => setdropdownopen(false)}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-1 rounded"
          size="sm"
          >
          Cancel
          </Button>
          <Button
          onClick={handlesave}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-1 rounded"
          size="sm"
          >
          Save
          </Button>
        </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TaskAssigneesSelector;
