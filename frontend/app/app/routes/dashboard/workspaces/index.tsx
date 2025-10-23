import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import {  useGetWorkspacesQuery } from "~/hooks/useWorkspace";
import { motion } from "framer-motion";
import CreateWorkspace from "~/components/workspace/CreateWorkspace";
import { Button } from "~/components/ui/button";
import type { Workspace } from "~/types";
import NoDataFound from "./noDatafound";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import WorkspaceAvatar from "~/components/workspace/workspaceavatar";
import {format} from 'date-and-time';
import { User } from "lucide-react";

const Workspaces = () => {
  const [iscreatingworkspace, setiscreatingworkspace] = useState(false);

  const { data: workspaces, isPending, isLoading } = useGetWorkspacesQuery();
  // console.log(workspaces.worskspaces);

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
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className=" font-semibold text-lg">Workspaces</h2>
          <Button onClick={() => setiscreatingworkspace(true)}>
            New Workspace
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4  ">
          {workspaces.worskspaces.length > 0 &&
            workspaces.worskspaces.map((w: any) => (
              <WorkspaceCard key={w._id} workspace={w} />
            ))}
              {workspaces.worskspaces.length === 0 && (
              <div className="col-span-full flex items-center justify-center min-h-[600px]">
                <NoDataFound
                title="No Workspace found"
                descritpion="Create a new workspace to get started"
                buttontext="Create Workspace"
                buttonAction={() => setiscreatingworkspace(true)}
                />
              </div>
              )}
        </div>
      </div>

      <CreateWorkspace
        iscreatingworkspace={iscreatingworkspace}
        setiscreatingworkspace={setiscreatingworkspace}
      />
    </>
  );
};

export default Workspaces;

export const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className=" transition-all cursor-pointer hover:shadow-md"
    >
      <Link to={`/workspaces/${workspace._id}`} className=" rounded-md">
        <Card>
          <CardHeader>
            <div className="flex gap-3 items-center justify-between">

              <div className="flex items-center gap-3">
                <WorkspaceAvatar name={workspace.name} color={workspace.color} />
                <div>
                  <CardTitle className="text-base font-semibold">
                    {workspace.name}
                  </CardTitle>
                  <span className="text-xs text-gray-500 block">
                    CreatedAt {workspace.updatedAt
                      ? format(new Date(workspace.updatedAt), 'ddd, MM DD YYYY')
                      : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <User className="w-6 h-6 p-1 rounded-md bg-slate-200" />
                <span>{workspace.members.length}{workspace.members.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <CardDescription className="mt-2">
              {workspace?.description || "No description"}
            </CardDescription>
            <p className=" text-slate-500">
            View the wrokspace details and projects 
          </p>
          </CardHeader>
          
        </Card>
      </Link>
    </motion.div>
  );
};
