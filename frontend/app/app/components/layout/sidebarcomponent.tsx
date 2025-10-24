import React, { useEffect, useState } from "react";
import type { Workspace } from "~/types";
import { useAuth } from "../provider/authcontext";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";

const SidebarComponent = ({
  currentworkspace,
}: {
  currentworkspace: Workspace | null;
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [iscollapse, setiscollapse] = useState(false);
  const navitems = [
    { title: "Dashboard", href: "/dashboard", icon: <RxDashboard size={16}/> },
    { title: "Workspace", href: "/workspaces", icon: <IoSettingsOutline size={16}/>},
    { title: "My Tasks", href: "/my-tasks", icon: <IoSettingsOutline size={16}/>},
    { title: "Members", href: "/members", icon: <IoSettingsOutline size={16}/> },
    { title: "Archieved", href: "/archieved", icon: <IoSettingsOutline size={16}/> },
    { title: "Settings", href: "/settings", icon: <IoSettingsOutline size={16}/> },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setiscollapse(true);
      } else {
        setiscollapse(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <div
      className={`h-screen flex flex-col transition-all duration-300 ${
        iscollapse ? "w-16 " : "w-46"
      } border border-slate-200 border-r`}
    >
      <div className="flex items-center justify-between p-3 ">
        <span
          className={` text-lg ml-2  font-semibold transition-all duration-300 ${
            iscollapse ? "hidden" : "block"
          }`}
        >
          TaskHub
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
      <nav className="flex-1 p-2 space-y-1 w-full">
        {navitems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <button
              key={item.title}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 p-2 rounded transition-colors duration-200 w-full ${
                isActive
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                  : "text-gray-700 hover:bg-slate-200"
              }`}
              onClick={() => {
                if (item.href === "/workspaces") {
                  navigate(item.href);
                } else if (currentworkspace && currentworkspace._id) {
                  navigate(`${item.href}/${currentworkspace._id}`);
                } else {
                  navigate(item.href);
                }
              }}
            >
              <p className="">
                {item.icon}
                </p>
              <span
                className={`transition-all duration-300 w-full text-left ${
                  iscollapse ? "hidden" : "block"
                }`}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarComponent;
