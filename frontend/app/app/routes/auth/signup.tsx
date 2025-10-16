import { useForm } from "react-hook-form";
import { z } from "zod";
import { signupschema } from "~/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Link } from "react-router";
//
type SignupSchema = z.infer<typeof signupschema>;

const Signup = () => {

  const form = useForm({
    resolver: zodResolver(signupschema),
    defaultValues: {
      email: "",
      password: "",
      name:"",
      confirmpassword:""
    },
  });

  const handlesubmit = (data: SignupSchema) => {
    console.log(data);
  };
  return (
    <div className="h-screen w-full flex items-center justify-center ">
      <Card className=" w-1/5 shadow-md">
        <CardHeader>
          <CardTitle className=" text-center text-lg">Welcome to TashHub</CardTitle>
          <CardDescription className="text-center">Signup with your credentials</CardDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlesubmit)} className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="name" placeholder="Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
              <FormField 
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ConfirmPassword</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="confirmpassword"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="text-center">Signup</Button>
            </form>
            <CardFooter className="mx-auto mt-2">
              <div className=" ">
                <p className=" text-center">Already have an account? <span className=" text-blue-500">
                 <Link to={'/login'}>Login</Link> </span></p>
              </div>
            </CardFooter>
          </Form>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Signup;
