import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { resetpasswordschema } from "~/lib/schema";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { useResetpassowrdmutation } from "~/hooks/useauth";
import { toast } from "sonner";

const Resetpassword = () => {
  const [searchparams] = useSearchParams();
  const [success,setsuccess]=useState(false);
  const token = searchparams.get("token");
  const { mutate, isPending } = useResetpassowrdmutation();
  const form = useForm({
    resolver: zodResolver(resetpasswordschema),
    defaultValues: {
      newpassword: "",
      confirmpassword: "",
    },
  });
  const handleSubmit = (data: z.infer<typeof resetpasswordschema>) => {
    if(!token){
      toast.error("Invalid token")
      return;
    }
    mutate({...data,token:token as string}, {
  onSuccess: (data: any) => {
        setsuccess(true)
        console.log(data);
        toast.success(data?.message)
      },
  onError: (error: any) => {
toast.error("erro in reseting password")
        console.log(error);
      },
    });
  };

  return (
    <div className=" h-screen w-full flex items-center justify-center">
      <Card className=" w-1/5 shadow-md">
        <CardHeader>
          <CardTitle className=" text-center text-lg">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter the credentials
          </CardDescription>
          <CardContent>
            {success ? (
              <div className="flex justify-center items-center h-screen">
                <HiOutlineCheckBadge size={42} className="text-green-500 " />
                <h1 className=" text-center">Password reset successfull</h1>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex flex-col gap-2"
                >
                  <FormField
                    control={form.control}
                    name="newpassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="New password"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmpassword"
                    render={({ field }) => (
                      <FormItem>
                        <div className=" flex items-center justify-between">
                          <FormLabel>Confirm Password</FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="text-center"
                    disabled={isPending}
                  >
                    {isPending ? "Loading" : "Reset password"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Resetpassword;
