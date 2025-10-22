import React from "react";
import type { Workspace } from "~/types";
import { useAuth } from "../provider/authcontext";
import { Button } from "../ui/button";
import { PiBellRinging } from "react-icons/pi";
import { FiPlus } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link, useLoaderData } from "react-router-dom";
import WorkspaceAvatar from "../workspace/workspaceavatar";

interface HeaderProps {
  onworkspaceselected: (workspace: Workspace) => void;
  selectedworkspace: Workspace | null;
  oncreatedworkspace: () => void;
}
const Header = ({
  oncreatedworkspace,
  onworkspaceselected,
  selectedworkspace,
}: HeaderProps) => {
  const { user, logout } = useAuth();

  const {workspaces}=useLoaderData() as any;
console.log(workspaces?.worskspaces)
    return (
    <div className="sticky top-0 z-40 border-b border-slate-200 shadow-xs p-2">
      <div className=" flex items-center justify-between sm:px-2 lg:px-4 py-0 md:px-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="h-9">
              {selectedworkspace ? (
                <>
                  {selectedworkspace?.color && (
                    <WorkspaceAvatar
                      color={selectedworkspace?.color}
                      name={selectedworkspace?.name}
                    />
                  )}
                  <span>{selectedworkspace?.name}</span>
                </>
              ) : (
                <div>
                  <span>Select Workspace</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent  className="w-38 bg-white z-50 p-2 shadow-sm rounded-md border border-slate-200 mt-1"
              align="start">
            <DropdownMenuLabel className="pl-2">Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {workspaces?.worskspaces?.map((workspace:any) => (
                <DropdownMenuItem
                  key={workspace._id}
                  onClick={() => onworkspaceselected(workspace)} className="flex gap-1 space-y-1 mt-1 pl-2"
                >
                  {workspace.color && (
                    <WorkspaceAvatar
                      color={workspace.color}
                      name={workspace.name}
                      
                    />
                  )}
                  <span className=" pl-1">{workspace.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className=" flex mt-1 items-center cursor-pointer" onClick={oncreatedworkspace}>
                   <FiPlus className="mr-2 "/> Create Workspace
                </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Button className="py-2" variant={"ghost"} size={"icon"}>
            <PiBellRinging />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className=" bg-slate-400 text-white w-8 h-8 rounded-full cursor-pointer">
                <Avatar className=" ">
                  <AvatarImage src={user?.profilepicture} />
                  <AvatarFallback className="">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-30 bg-white z-50 p-2 shadow-sm rounded-md border border-slate-200 mt-1"
              align="end"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="mt-1 text-blue-500">
                <Link to={"/user/profile"}>Profile</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel
                onClick={logout}
                className="cursor-pointer mt-1 text-red-500"
              >
                Logout
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
