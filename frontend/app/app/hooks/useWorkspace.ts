import { useMutation, useQuery } from "@tanstack/react-query"
import type { WorkspaceForm } from "~/components/workspace/CreateWorkspace"
import { fetchdata, postdata } from "~/lib/fetchutil"

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceForm) => postdata("/workspaces", data),
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchdata("/workspaces"),
  });
};

export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => fetchdata(`/workspaces/${workspaceId}/projects`),
  });
};