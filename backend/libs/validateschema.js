import { z } from "zod";

export const loginschema = z.object({
  email: z.string().email("Invalid email address").min(10),
  password: z.string().min(4, "password length should be more than 4 letters"),
});

export const signupschema = z
  .object({
    email: z.string().email("Invalid email address").min(10),
    password: z
      .string()
      .min(4, "password length should be more than 4 letters"),
    name: z.string().min(4, " Must be more tahn 4 letters"),
    confirmpassword: z.string().min(4, "Must be more than 4 letters"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Password does not match",
    path: ["confirmpassword"],
  });

export const resetpasswordschrma = z.object({
  // token: z.string().min(1,"Token is required"),
  newpassword: z.string().min(4, "password length should be more than 4 letters"),
  confirmpassword: z.string().min(4, "confirm password with new password"),
}) .refine((data) => data.newpassword === data.confirmpassword, {
    message: "Password does not match",
    path: ["confirmpassword"],
  });

export const emailschema=z.object({
    email:z.string().email("Invalid email address")
});

export const workspaceSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().optional(),
  color: z.string().min(1,"Color is required"),

});

export const projectSchema=z.object({
  title: z.string().min(1,"Project name is required").trim(),
  description: z.string().optional(),
  status:z.enum(["Planning","In Progress","Completed","On Hold","Cancellled"]).default("Planning"),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.string().min(1, "End date is required"),
  tags: z.array(z.string()).optional(),
  members: z.array(
    z.object({
      user: z.string().min(1, "User is required"), // Should be ObjectId string
      role: z.enum(["manager", "contributor", "viewer"]).default("contributor"),
    })
  ).optional(), 
})

export const taskSchema=z.object({
  title: z.string().min(1,"Task title is required").trim(),
  description: z.string().optional(), 
  status:z.enum(["To Do","In Progress","Completed","Done"]).default("To Do"),
  priority:z.enum(["Low","Medium","High","Critical"]).default("Medium"),
  dueDate: z.string().min(1, "Due date is required"),
  assignees: z.array(z.string()).optional(), // Should be array of ObjectId strings
});