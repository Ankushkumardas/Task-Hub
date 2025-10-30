import { zodResolver } from "@hookform/resolvers/zod";
import { SelectTrigger } from "@radix-ui/react-select";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem } from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useInviteMutation } from "~/hooks/useWorkspace";
import { inviteMemberSchema } from "~/lib/schema";
const InviteMemberDialogBox = ({
  isopen,
  opopnechange,
  workspaceMembers,
  workspaceid,
}: {
  isopen: boolean;
  opopnechange: (open: boolean) => void;
  workspaceMembers: any;
  workspaceid: string;
}) => {
  const [invitetab, setivnitetab] = React.useState<"email" | "link">("email");
  const [linkcopied, setlinkcopied] = React.useState(false);
  const form = useForm<z.infer<typeof inviteMemberSchema>>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const { mutate } = useInviteMutation(workspaceid);

  const onSubmit = (data: any) => {
    // backend expects { email: string, role: "admin" | "member" | "viewer" | "owner" }
    const payload = { email: data.email, role: data.role };
    mutate(payload, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Member invited successfully");
        form.reset();
        opopnechange(false);
      },
      onError: (err: any) => {
        const msg = err?.message || "Failed to invite member";
        toast.error(msg);
      },
    });
  };

  return (
    <Dialog open={isopen} onOpenChange={opopnechange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Members to Workspace</DialogTitle>
          <DialogDescription>
            Invite members to your workspace using the link below:
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="email"
          className="mt-4"
          onValueChange={(value) => setivnitetab(value as "email" | "link")}
        >
          <TabsList>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter email" className="mb-4" />
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Role</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-[150px]">
                            <span>{field.value}</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                  Invite
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="link" className="mt-4">
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/workspace-invite/${workspaceid}`}
                className="flex-1"
              />
              <button
                type="button"
                className="px-3 py-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/workspace-invite/${workspaceid}`);
                  setlinkcopied(true);
                  setTimeout(() => setlinkcopied(false), 2000);
                }}
              >
                {linkcopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialogBox;
