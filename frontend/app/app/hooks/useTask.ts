import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskForm } from "~/components/tasks/CreateTaskDialog";
import { fetchdata, postdata, updatedata } from "~/lib/fetchutil";
import type { TaskPriority, TaskStatus } from "~/types";

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

export const useTaskUpdateStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { taskid: string; status: TaskStatus }) =>
            updatedata(`/tasks/${data.taskid}/status`, { status: data.status }),
        onSuccess: (result: any, variables: { taskid: string; status: TaskStatus }) => {
            queryClient.invalidateQueries({
                queryKey: ["task", variables.taskid]
            });
        }
    });
};

export const useUpdateTaskDescription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { taskid: string; description: string }) =>
            updatedata(`/tasks/${data.taskid}/description`, { description: data.description }),
        onSuccess: (result: any, variables: { taskid: string; description: string }) => {
            queryClient.invalidateQueries({
                queryKey: ["task", variables.taskid]
            });
        }
    });
};

export const useUpdateTaskAssignees=()=>{
        const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(data:{taskid:string,assignees:string[]})=>updatedata(`/tasks/${data.taskid}/assignees`,{assignees:data.assignees}),
        onSuccess: (result: any, variables: { taskid: string; assignees: string[] }) => {
            queryClient.invalidateQueries({
                queryKey: ["task", variables.taskid]
            });
        }
    })
}

export const useUpdateTaskPriority=()=>{
        const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(data:{taskid:string,priority:TaskPriority})=>updatedata(`/tasks/${data.taskid}/priority`,{priority:data.priority}),
        onSuccess: (result: any, variables: { taskid: string; priority: TaskPriority }) => {
            queryClient.invalidateQueries({
                queryKey: ["task", variables.taskid]
            });
        }
    })
}

export const useAddSubtaskToTask=()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(data:{taskid:string,title:string})=>postdata(`/tasks/${data.taskid}/add-subtask`,{title:data.title}),
        onSuccess: (result: any, variables: { taskid: string; title: string }) => {
            queryClient.invalidateQueries({
                queryKey: ["task", variables.taskid]
            });
        }
    })
}

export const useUpdateSubtaskOfTask=()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(data:{taskid:string,subtaskid:string,title:string,completed:boolean})=>updatedata(`/tasks/${data.taskid}/update-subtask/${data.subtaskid}`,{title:data.title,completed:data.completed}),
        onSuccess: (result: any, variables: { taskid: string; subtaskid:string; title: string ,completed:boolean}) => {
            queryClient.invalidateQueries({
                queryKey: ["task", variables.taskid]
            });
        }
    })
}
