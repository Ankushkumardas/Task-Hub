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

export const useGetWorkspaceMembersQuery = (workspaceid: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceid, "members"],
    // return the members array directly so callers can treat `data` as an array
    queryFn: async () => {
      const res = await fetchdata(`/workspaces/${workspaceid}/members`);
      return res?.members ?? [];
    },
    // don't run this query until we have a workspace id
    enabled: Boolean(workspaceid),
  });
};

export const useGetArchivedProjectsQuery = (workspaceid: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceid, "archived-projects"],
    queryFn: async () => fetchdata(`/workspaces/${workspaceid}/archieve`),
    enabled: Boolean(workspaceid),
  });
};

export const useInviteMutation = (workspaceid: string) => {
  return useMutation({
    mutationFn: async (data: { email: string; role: "admin" | "member" | "viewer" |"owner"}) =>
      postdata(`/workspaces/${workspaceid}/invite-members`, data),
  });
}