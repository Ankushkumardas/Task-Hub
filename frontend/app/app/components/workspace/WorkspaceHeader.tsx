import React from "react";
import type { User, Workspace } from "~/types";
import WorkspaceAvatar from "./workspaceavatar";
import { Button } from "../ui/button";
import { Plus, UserPlus } from "lucide-react";

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
    <div>
      <div>
        <div className=" flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3 p-2 ">
            <div className=" flex md:items-center gap-3">
              {
                workspace.color&&<WorkspaceAvatar color={workspace.color} name={workspace.name}/>
              }  
              <h2>{workspace.name}</h2>
            </div>
            <div className=" flex items center justify-center flex-col">
                <div>

                <Button variant={"outline"} className="w-8 h-8" onClick={isInviteMember}>
                    <UserPlus/>
                </Button>
                    Add Member
                </div>
                <div>

                <Button variant={"outline"} className="w-8 h-8" onClick={iscreatedproject}>
                    <Plus/>
                </Button>
                    Create Project 
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHeader;
