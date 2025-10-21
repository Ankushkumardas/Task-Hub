import React, { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "~/components/provider/authcontext";
import { motion, AnimatePresence } from "framer-motion";
import Header from "~/components/layout/header";
import type { Workspace } from "~/types";
import SidebarComponent from "~/components/layout/sidebarcomponent";

const DashboardLayout = () => {
  const { logout, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [iscreatingworkspace, setiscreatingworkspace] = useState(false);
  const [currentworkspace, setcurrentworkspace] = useState<Workspace | null>(
    null
  );
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
  if (!isAuthenticated) {
    return <Navigate to={"/signup"} />;
  }

  const handleworkspaceselected = (workspace: Workspace) => {
    setcurrentworkspace(workspace);
  };
  return (
    <div className="w-full h-screen flex">
      {/* sidebar component */}
      <SidebarComponent currentworkspace={currentworkspace}/>
      <div className=" flex flex-1 flex-col h-full">
        <Header
          onworkspaceselected={handleworkspaceselected}
          selectedworkspace={null}
          oncreatedworkspace={() => setiscreatingworkspace(true)}
        />
        <main className=" flex-1 overflow-y-auto p-4 h-full w-full">
          <div className=" container mx-auto sm:px-2 lg:px-4 py-0 md:px-3 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
