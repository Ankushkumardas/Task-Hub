import React, { useState } from "react";
import type { Workspace } from "~/types";
import { useAuth } from "../provider/authcontext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
const SidebarComponent = ({
  currentworkspace,
}: {
  currentworkspace: Workspace | null;
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [iscollapse, setiscollapse] = useState(false);
  const navitems = [
    { title: "Dashboard", href: "/dashboard", icon: "" },
    { title: "Workspace", href: "/workspace", icon: "" },
    { title: "My Tasks", href: "/my-tasks", icon: "" },
    { title: "Members", href: "/members", icon: "" },
    { title: "Archieved", href: "/archieved", icon: "" },
    { title: "Settings", href: "/settings", icon: "" },
  ];
  return (
    <div
      className={`h-screen flex flex-col transition-all duration-300 ${
        iscollapse ? "w-16" : "w-46"
      } border border-slate-200 border-r`}
    >
      <div className="flex items-center justify-between p-3 ">
        <span
          className={` text-md transition-all duration-300 ${
            iscollapse ? "hidden" : "block"
          }`}
        >
          {currentworkspace ? currentworkspace.name : "No Workspace"}
        </span>
        <Button
          variant={"outline"}
          className="text-gray-400 hover:text-white focus:outline-none"
          onClick={() => setiscollapse(!iscollapse)}
        >
          {iscollapse ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </Button>
      </div>
      <nav className="flex-1 p-2">
        {navitems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="flex items-center gap-3 p-2 rounded hover:bg-slate-200 transition-colors duration-200"
          >
            {/* Placeholder for icon */}
            <span
              className={`transition-all duration-300 ${
                iscollapse ? "hidden" : "block"
              }`}
            >
              {item.title}
            </span>
          </a>
        ))}
      </nav>
      {/* <div className="p-3">
            <div className={`mb-2 ${iscollapse ? 'hidden' : 'block'}`}>
                <div className="font-semibold">{user?.name}</div>
                <div className="text-xs text-gray-400">{user?.email}</div>
            </div>
            <button
                onClick={logout
                }
                className="w-full bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
            >
                {iscollapse ? <span>!</span> : <span>Logout</span>}
            </button>
        </div> */}
    </div>
  );
};

export default SidebarComponent;
