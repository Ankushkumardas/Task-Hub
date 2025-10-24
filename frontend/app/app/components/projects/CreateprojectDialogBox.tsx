import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import type z from "zod";
import { projectSchema } from "~/lib/schema";
import { ProjectStatus, type Members } from "~/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover } from "../ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Checkbox } from "../ui/checkbox";
import { useCreateProject } from "~/hooks/useProject";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-and-time";

interface CreateprojectDialogBoxProps {
  isopen: boolean;
  opopnechange: (value: boolean) => void;
  workspaceid: string;
  workspaceMembers: Members[];
}

export type ProjectSchema = z.infer<typeof projectSchema>;

const CreateprojectDialogBox: React.FC<CreateprojectDialogBoxProps> = ({
  isopen,
  opopnechange,
  workspaceMembers,
  workspaceid,
}) => {
  const form = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: ProjectStatus.PLANNING,
      startDate: "",
      endDate: "",
      members:[],
      tags:"",
    },
  });

const {mutate,isPending}=useCreateProject();

  const onsubmit = (data: ProjectSchema) => {
    if (!workspaceid) return;
    const payload = {
      title: data.title,
      description: data.description,
      status: data.status,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
      members: data.members || [],
    };

    mutate(
      { projectData: payload, workspaceid: workspaceid },
      {
        onSuccess: (data) => {
          toast.success("Project added successfully");
          form.reset();
          opopnechange(false);
          console.log(data)
        },
        onError: (error: any) => {
          toast.error("Error while adding project");
          // Log backend validation errors if present
          if (error.response && error.response.data && error.response.data[0]?.errors?.issues) {
            console.error("Validation issues:", error.response.data[0].errors.issues);
          } else {
            console.error(error);
          }
        },
      }
    );
  };

  return (
    <div className=" ">
      <Dialog open={isopen} onOpenChange={opopnechange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Create a new project to get started
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Project title" className="input input-bordered w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Project description" className="input input-bordered w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your value" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ProjectStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={
                              "w-full justify-start text-left font-normal" +
                              (!field.value ? "text-muted-foreground" : "")
                            }
                          >
                            <CalendarIcon className="size-4 mr-2" />
                            {field.value ? (
                              format(new Date(field.value), "PPPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : undefined);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={
                              "w-full justify-start text-left font-normal" +
                              (!field.value ? "text-muted-foreground" : "")
                            }
                          >
                            <CalendarIcon className="size-4 mr-2" />
                            {field.value ? (
                              format(new Date(field.value), "PPPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : undefined);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
               <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tags to be seperated by comma ," className="input input-bordered w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
<FormField
  control={form.control}
  name="members"
  render={({ field }) => {
    const selectedMembers = field.value || [];

    return (
      <FormItem>
        <FormLabel>Members</FormLabel>
        <FormControl>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal min-h-11"
              >
                {selectedMembers.length === 0 ? (
                  <span className="text-muted-foreground">
                    Select Members
                  </span>
                ) : selectedMembers.length <= 2 ? (
                  selectedMembers.map((m) => {
                    const member = workspaceMembers.find(
                      (wm) => wm.user._id === m.user
                    );

                    return `${member?.user.name} (${member?.role})`;
                  })
                ) : (
                  `${selectedMembers.length} members selected`
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-full max-w-60 overflow-y-auto"
              align="start"
            >
              <div className="flex flex-col gap-2">
                {workspaceMembers.map((member) => {
                  const selectedMember = selectedMembers.find(
                    (m) => m.user === member.user._id
                  );

                  return (
                    <div
                      key={member._id}
                      className="flex items-center gap-2 p-2 border rounded"
                    >
                      <Checkbox
                        checked={!!selectedMember}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([
                              ...selectedMembers,
                              {
                                user: member.user._id,
                                role: "contributor",
                              },
                            ]);
                          } else {
                            field.onChange(
                              selectedMembers.filter(
                                (m) => m.user !== member.user._id
                              )
                            );
                          }
                        }}
                        id={`member-${member.user._id}`}
                      />
                      <span className="truncate flex-1">
                        {member.user.name}
                      </span>

                      {selectedMember && (
                        <Select
                          value={selectedMember.role}
                          onValueChange={(role) => {
                            field.onChange(
                              selectedMembers.map((m) =>
                                m.user === member.user._id
                                  ? {
                                      ...m,
                                      role: role as
                                        | "contributor"
                                        | "manager"
                                        | "viewer",
                                    }
                                  : m
                              )
                            );
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manager">
                              Manager
                            </SelectItem>
                            <SelectItem value="contributor">
                              Contributor
                            </SelectItem>
                            <SelectItem value="viewer">
                              Viewer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>
              <Button type="submit" className="mt-4 w-full btn btn-primary">
               {isPending?"Creating project":" Create Project"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateprojectDialogBox;
