import { useMutation } from "@tanstack/react-query"
import type { WorkspaceForm } from "~/components/workspace/CreateWorkspace"
import { postdata } from "~/lib/fetchutil"

export const useCreateWorkspace=()=>{
    return useMutation({
        mutationFn:async(data:WorkspaceForm)=>postdata('/workspaces',data)
    })
}