import { useMutation, useQuery } from "@tanstack/react-query"
import { fetchdata, postdata, updatedata } from "~/lib/fetchutil"

export const useUserProfileQuery = () => {
    return useQuery({
        queryKey: ["user", "profile"],
        queryFn: async () => fetchdata("/users/profile"),
    })
}   

export const usechangePasswordmutation=()=>{
    return useMutation({
      mutationFn:(data:{currentpassword:string,newpassword:string,confirmpassword:string})=>updatedata('/users/profile/changepassword',data)
    })
}

export const useUpdateProfilemutation=()=>{
    return useMutation({
        mutationFn:(data:{name?:string,email?:string})=>updatedata('/users/profile',data)
    })
}