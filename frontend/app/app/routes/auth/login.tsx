import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginschema } from "~/lib/schema";
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
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "~/hooks/useauth";
import { useAuth } from "~/components/provider/authcontext";
import { toast } from "sonner";
type LoginSchema = z.infer<typeof loginschema>;
const Login = () => {
  const navigate=useNavigate();
  const form = useForm({
    resolver: zodResolver(loginschema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  interface LoginSchema {
    email: string;
    password: string;
  }

  const { mutate, isPending } = useLoginMutation();
  const {login,setisAuthenticated } = useAuth();
  const handlesubmit = (data: LoginSchema) => {
    mutate(data, {
      onSuccess: (data) => {
        toast.success("Account Login Successfull",data);
        setisAuthenticated(true)
        login(data)        
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error("Login failed");
        console.log(error);
      },
    });
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-2">
      <Card className="w-full max-w-60 sm:max-w-60 md:max-w-70 lg:max-w-80 shadow-md">
      <CardHeader>
        <CardTitle className="text-center text-lg">Welcome Back</CardTitle>
        <CardDescription className="text-center">
        Login with your credentials
        </CardDescription>
        <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlesubmit)}
          className="flex flex-col gap-2"
        >
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
          name="password"
          render={({ field }) => (
            <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <FormLabel className="text-blue-400">
              <Link to={"/forgot-password"}>Forgot password?</Link>
              </FormLabel>
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
          <Button type="submit" className="text-center" disabled={isPending}>
          Login
          </Button>
        </form>
        <CardFooter className="mx-auto mt-2">
          <div>
          <p>
            Don't have an account?{" "}
            <span className="text-blue-500">
            <Link to={"/signup"}>Signup</Link>{" "}
            </span>
          </p>
          </div>
        </CardFooter>
        </Form>
      </CardHeader>
      </Card>
    </div>
  );
};

export default Login;
