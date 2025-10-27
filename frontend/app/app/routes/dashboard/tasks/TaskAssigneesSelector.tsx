import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Button } from "~/components/ui/button";
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
  return (
    <div>
      <h1 className=" font-semibold text-black">Assignees</h1>
      <div className="mt-2">
        {selectedid.length === 0 ? (
          <span className="text-gray-500">No assignees</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {projectmember
              .filter((pm) => selectedid.includes(pm.user._id))
              .map((pm) => (
                <>
                  <div
                    key={pm.user._id}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold shadow-sm"
                  >
                    <Avatar>
                      <AvatarImage
                        src={pm.user.profilepicture || undefined}
                        alt={pm.user.name || "User Avatar"}
                      />
                      <AvatarFallback>
                        {pm.user.name
                          ? pm.user.name.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="ml-1">
                    {pm.user.name || pm.user.email || "Unnamed User"}
                  </span>
                </>
              ))}
          </div>
        )}
      </div>

      {/* dropdown for selecting assignees */}
      <div className=" relative">
        <Button onClick={() => setdropdownopen(!dropdownopen)}>
          {selectedid.length === 0
            ? "Select Assignees"
            : `${selectedid.length} Assignees Selected`}
        </Button>
        {dropdownopen && (
          <div className=" absolute z-10 mt-2 w-60 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded shadow-lg">
            <div className=" flex gap-2 items-center justify-between p-2 border-b border-gray-200 text-xs">
              <Button onClick={handleselectAll}>Select All</Button>
              <Button onClick={handleunselectall}>Unselect All</Button>
            </div>
            {projectmember.map((pm) => (
              <div
                key={pm.user._id}
                className=" flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
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
                />
                <Avatar>
                  <AvatarImage
                    src={pm.user.profilepicture || undefined}
                    alt={pm.user.name || "User Avatar"}
                  />
                  <AvatarFallback>
                    {pm.user.name ? pm.user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <span>{pm.user.name || pm.user.email || "Unnamed User"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAssigneesSelector;
