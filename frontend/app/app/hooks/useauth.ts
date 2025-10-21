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
//for forgotpassowrd route
export const useForgotpasswordmutation = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => postdata('/auth/reset-password-request', data),
  });
};
//to resetpassword woth the new password
export const useResetpassowrdmutation=()=>{
return useMutation({
  mutationFn:(data:{newpassword:string,confirmpassword:string,token:string})=>postdata('/auth/reset-password',data)
})
}