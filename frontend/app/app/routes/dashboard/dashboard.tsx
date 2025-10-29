import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "~/components/provider/authcontext";
import { motion, AnimatePresence } from "framer-motion";
import Header from "~/components/layout/header";
import type { Workspace } from "~/types";
import SidebarComponent from "~/components/layout/sidebarcomponent";
import CreateWorkspace from "~/components/workspace/CreateWorkspace";
import { fetchdata } from "~/lib/fetchutil";
//in react-router-v& we have a feature where we cann load teh data before teh page load
export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([fetchdata("/workspaces")]);
    return { workspaces };
  } catch (error) {
    console.log(error);
    return { workspaces: [] };
  }
};

const DashboardLayout = () => {
  const { logout, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const [iscreatingworkspace, setiscreatingworkspace] = useState(false);
  const [currentworkspace, setcurrentworkspace] = useState<Workspace | null>(
    null
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/signup");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // 🔹 Show spinner while loading
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <AnimatePresence>
          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: "linear",
              repeat: Infinity,
            }}
            className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full"
          />
        </AnimatePresence>
      </div>
    );
  }
  const handleworkspaceselected = (workspace: Workspace) => {
    setcurrentworkspace(workspace);
  };
  return (
    <div className="w-full h-screen flex">
      <SidebarComponent currentworkspace={currentworkspace} />
      <div className=" flex flex-1 flex-col h-full">
        {isAuthenticated && user && (
          <Header
            onworkspaceselected={handleworkspaceselected}
            selectedworkspace={currentworkspace}
            oncreatedworkspace={() => setiscreatingworkspace(true)}
            logout={logout ? () => { logout(); } : () => {}}
          />
        )}
        <main className=" flex-1 overflow-y-auto px-4 h-full w-full">
          <div className=" mx-auto container px-2 sm:px-2 lg:px-4 py-0 md:py-4 w-full h-full">
            <Outlet />
          </div>
        </main> 
      </div>
      <CreateWorkspace
        iscreatingworkspace={iscreatingworkspace}
        setiscreatingworkspace={setiscreatingworkspace}
      />
    </div>
  );
};

export default DashboardLayout;
