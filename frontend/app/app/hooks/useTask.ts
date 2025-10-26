import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskForm } from "~/components/tasks/CreateTaskDialog";
import { fetchdata, postdata } from "~/lib/fetchutil";

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

export const useTaskQuery=(taskid:string)=>{
    return useQuery({
        queryKey:["task",taskid],
        queryFn:()=>fetchdata(`/tasks/${taskid}`)
    })
}