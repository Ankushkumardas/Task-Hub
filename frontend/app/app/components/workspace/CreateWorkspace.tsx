import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { workspaceSchema } from "~/lib/schema";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authcontext";
import { Button } from "../ui/button";

interface CreateWorkspaceProps {
  iscreatingworkspace: boolean;
  setiscreatingworkspace: (iscreatingworkspace: boolean) => void;
}
const isPending=false;
// 
export const colorOptions = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "teal",
    "pink",
    "navy",
    "limegreen",
];

type WorkspaceForm = z.infer<typeof workspaceSchema>;

const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({
  iscreatingworkspace,
  setiscreatingworkspace,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);
  if (isLoading) return null;
  if (!isAuthenticated) return null;

  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      color: colorOptions[0],
      description: "",
    },
  });

  const onsumbit = (data: WorkspaceForm) => {
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
                            {colorOptions.map((color)=>(
                                <div key={color} className={cn(`w-6 h-6 rounded-full`,field.value===color&&`border-1 border-blue-500`)} style={{backgroundColor:color}}onClick={()=>field.onChange(color)}></div>
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
{isPending?"CreateTracing..":"Create"}
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
