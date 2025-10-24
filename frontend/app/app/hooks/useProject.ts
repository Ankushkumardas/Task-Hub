import { useMutation, useQueryClient } from "@tanstack/react-query"
// Backend payload type for project creation
export type ProjectCreatePayload = {
    title: string;
    description?: string;
    status: string;
    startDate?: Date;
    endDate?: Date;
    tags?: string[];
    members?: { user: string; role: "manager" | "contributor" | "viewer" }[];
};
import { postdata } from "~/lib/fetchutil"

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { projectData: ProjectCreatePayload; workspaceid: string }) => {
            return postdata(`/projects/${data.workspaceid}/create-project`, data.projectData);
        },
        onSuccess: (_data: any, variables: { projectData: ProjectCreatePayload; workspaceid: string }) => {
            queryClient.invalidateQueries({
                queryKey: ["workspace", variables.workspaceid],
            });
        },
    });
};