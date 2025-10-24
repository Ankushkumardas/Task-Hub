import React from "react";
import type { User, Workspace } from "~/types";
import WorkspaceAvatar from "./workspaceavatar";
import { Button } from "../ui/button";
import { Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface WorkspaceHeaderProps {
  workspace: Workspace;
  members: {
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
  }[];
  iscreatedproject: () => void;
  isInviteMember: () => void;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  workspace,
  members,
  iscreatedproject,
  isInviteMember,
}) => {
  return (
    <div className="bg-white rounded-lg p-2 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="flex items-center gap-4">
        {workspace.color && (
        <WorkspaceAvatar color={workspace.color} name={workspace.name} />
        )}
        <div>
        <h2 className="text-2xl font-semibold text-gray-900">{workspace.name}</h2>
        {workspace.description && (
          <p className="text-gray-500 text-sm mt-1">{workspace.description}</p>
        )}
        </div>
      </div>
      <div className="flex gap-3 mt-4 md:mt-0">
        <Button
        variant="outline"
        className="flex items-center gap-2 px-4 py-2"
        onClick={isInviteMember}
        >
        <UserPlus className="w-4 h-4" />
        Add Member
        </Button>
        <Button
        variant="outline"
        className="flex items-center gap-2 px-4 py-2"
        onClick={iscreatedproject}
        >
        <Plus className="w-4 h-4" />
        Create Project
        </Button>
      </div>
      </div>
      {members.length > 0 && (
      <div className="mt-6 flex gap-2 items-center ">
        <span className=" justify-center text-sm font-medium flex items-center text-gray-700 mb-2">Members</span>
        <div className="flex -space-x-2">
        {members.map((m) => (
          <Avatar key={m.user.name} title={m.user.name} className="  ">
          <AvatarImage src={m.user.profilepicture} alt={m.user.name} />
          <AvatarFallback className="bg-slate-200 text-gray-700 font-medium flex items-center justify-center w-8 h-8 rounded-full">
            {m.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
          </Avatar>
        ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default WorkspaceHeader;
