import { useMutation } from "@tanstack/react-query"
import { postdata } from "~/lib/fetchutil"
import type { SignupSchema } from "~/routes/auth/signup"
  interface LoginSchema{
    email:string;
    password:string
  }
export const useSignupMutation=()=>{
    return useMutation({
        mutationFn:(data:SignupSchema)=>postdata('/auth/register',data),

    })
};
export const useLoginMutation=()=>{
    return useMutation({
        mutationFn:(data:LoginSchema)=>postdata('/auth/login',data),

    })
};