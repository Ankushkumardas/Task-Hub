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

export const useGetWorkspaceQuery = (workspaceid: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceid],
    queryFn: async () => fetchdata(`/workspaces/${workspaceid}/projects`),
  });
};

export const useGetWorkspaceStatsQuery = (workspaceid: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceid],
    queryFn: async () => fetchdata(`/workspaces/${workspaceid}/stats`),
  });
};