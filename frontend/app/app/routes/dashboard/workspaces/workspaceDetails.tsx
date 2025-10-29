import React, { useState } from "react";
import { useParams } from "react-router";
import CreateprojectDialogBox from "~/components/projects/CreateprojectDialogBox";
import ProjectList from "~/components/workspace/projectList";
import WorkspaceHeader from "~/components/workspace/WorkspaceHeader";
import { useGetWorkspaceQuery } from "~/hooks/useWorkspace";
import type { Workspace, Project } from "~/types";

const WorkspaceDetails = () => {
  const { workspaceid } = useParams();
  const [iscreatedproject, setiscreatedproject] = useState(false);
  const [isInviteMember, setisInviteMember] = useState(false);

  if (!workspaceid) {
    return (
      <div className=" h-screen flex items-center justify-center font-semibold text-lg">
        No workspace found
      </div>
    );
  }

  const { data, isLoading, isError, error } = useGetWorkspaceQuery(workspaceid as string) as {
    data: { projects: Project[]; workspace: Workspace };
    isLoading: boolean;
    isError: boolean;
    error: any;
  }
  const workspace = data?.workspace;
  console.log(data?.projects, "workspace projects");

  if (isLoading) {
    return <div>isLoading...</div>;
  }
  if (isError) {
    return <div>Error loading workspace: {error?.message || "Unknown error"}</div>;
  }

  if (!workspace) {
    return (
      <div className=" h-screen flex items-center justify-center font-semibold text-lg">
        Workspace data not available
      </div>
    );
  }

  return (
    <div>
     <WorkspaceHeader
  workspace={workspace}
  members={workspace?.members}
     iscreatedproject={()=>setiscreatedproject(true)}
     isInviteMember={()=>setisInviteMember(true)}
     />

     <ProjectList
  workspaceid={workspace?._id}
  project={data?.projects}
     onCreateproject={()=>setiscreatedproject(true)}
     />

     <CreateprojectDialogBox
     isopen={iscreatedproject}
     opopnechange={setiscreatedproject}
     workspaceid={workspaceid}
  workspaceMembers={workspace?.members as any}
     />
    </div>
  );
};

export default WorkspaceDetails;

