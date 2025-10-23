import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { workspaceSchema } from "~/lib/schema";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authcontext";
import { Button } from "../ui/button";
import { useCreateWorkspace } from "~/hooks/useWorkspace";
import { toast } from "sonner";

interface CreateWorkspaceProps {
  iscreatingworkspace: boolean;
  setiscreatingworkspace: (iscreatingworkspace: boolean) => void;
}

//
export const colorOptions = [
  "#FFCDD2", // light red
  "#F8BBD0", // light pink
  "#E1BEE7", // light purple
  "#D1C4E9", // light deep purple
  "#C5CAE9", // light indigo
  "#BBDEFB", // light blue
  "#B3E5FC", // light light blue
  "#B2EBF2", // light cyan
  "#B2DFDB", // light teal
  "#C8E6C9", // light green
  "#DCEDC8", // light light green
];

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({
  iscreatingworkspace,
  setiscreatingworkspace,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateWorkspace();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated)
    return (
      <div>
        <Navigate to="/login" replace={true} />
      </div>
    );

  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      color: colorOptions[0],
      description: "",
    },
  });

  const onsumbit = (data: WorkspaceForm) => {
    mutate(data, {
      onSuccess: (data: any) => {
        setiscreatingworkspace(false);
        toast.success(data?.message);
        navigate(`/workspaces/${data.workspace._id}`);
      },
      onError: (error: any) => {
        console.log(error);
        toast.error("Error in creating workspace");
      },
    });
    console.log("craete workspace data", data);
  };
  function cn(...classes: (string | false | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Dialog
        open={iscreatingworkspace}
        onOpenChange={setiscreatingworkspace}
        modal={true}
      >
        <DialogContent className="max-h-[80vh] w-100 overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsumbit)}>
              <div className=" space-y-2">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Workspace name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Workspace description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  name="color"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className=" flex gap-2">
                          {colorOptions.map((color) => (
                            <div
                              key={color}
                              className={cn(
                                `w-6 h-6 rounded-full`,
                                field.value === color &&
                                  `border-1 border-blue-500`
                              )}
                              style={{ backgroundColor: color }}
                              onClick={() => field.onChange(color)}
                            ></div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <DialogFooter className="mt-2 ">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "CreateTracing.." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateWorkspace;
