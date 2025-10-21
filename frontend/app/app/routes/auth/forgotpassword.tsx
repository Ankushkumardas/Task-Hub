import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { HiOutlineCheckBadge } from "react-icons/hi2";

import { forgotpasswordschema } from "~/lib/schema";
import { FaArrowLeftLong } from "react-icons/fa6";

import type z from "zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForgotpasswordmutation } from "~/hooks/useauth";
import { Link } from "react-router-dom";
import { toast } from "sonner";
type FrogotPassword = z.infer<typeof forgotpasswordschema>;

const Forgotpassword = () => {
  const [issuccess, setissuccess] = useState(false);

  const { mutate: forgotpassword, isPending } = useForgotpasswordmutation();
  const form = useForm<FrogotPassword>({
    resolver: zodResolver(forgotpasswordschema),
    defaultValues: {
      email: "",
    },
  });

  const onsubmit = (data: FrogotPassword) => {
    console.log(data);
    forgotpassword(data, {
      onSuccess: (data) => {
        console.log(data);
        setissuccess(true);
        toast.success("reset password sent");
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message;
        console.log(error);
        toast.error(message);
      },
    });
  };

  return (
    <div className=" h-screen w-full flex items-center justify-center">
      <Card className=" w-1/5 shadow-md">
        <CardHeader>
          <CardTitle className=" text-center text-lg">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {issuccess ? (
            <div className="flex items-center justify-center flex-col">
              <HiOutlineCheckBadge size={42} className="text-green-500 "  />
              <h1  className=" text-center">Password reset email sent</h1>
              <p className=" text-center">Check your email for for a link to reset password</p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onsubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter the email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <Button type="submit">
                  {isPending ? <div>Loading</div> : <div>Reset Password</div>}
                </Button>
              </form>
            </Form>
          )}
          <CardFooter className=" mt-4">
            <div className="  ">
            <Link to={"/signup"} className=" flex  items-center gap-1">
              {" "}
              <FaArrowLeftLong />
              Back to Signup
            </Link>
          </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default Forgotpassword;
