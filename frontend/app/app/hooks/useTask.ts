import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskForm } from "~/components/tasks/CreateTaskDialog";
import { fetchdata, postdata, updatedata } from "~/lib/fetchutil";

export const useCreatetask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { projectid: string; taskdata: CreateTaskForm }) =>
            postdata(`/tasks/${data.projectid}/create-task`, data.taskdata),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["project", data.projectid],
            });
        },
    });
};

export const useTaskQuery = (taskid: string) => {
    return useQuery({
        queryKey: ["task", taskid],
        queryFn: () => fetchdata(`/tasks/${taskid}`)
    })
}


export const useUpdateTasktitle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { taskid: string; title: string }) =>
            updatedata(`/tasks/${data.taskid}/title`, { title: data.title }),
        onSuccess: (result: any, variables: { taskid: string; title: string }) => {
            queryClient.invalidateQueries({
                queryKey: ["task", variables.taskid]
            });
        }
    });
};