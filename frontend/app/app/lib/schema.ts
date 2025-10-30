import { z } from 'zod';
import { ProjectStatus } from '~/types';

export const loginschema = z.object({
    email: z.string().email("Invalid email address").min(10),
    password: z.string().min(4, "password length should be more than 4 letters"),
    // confirmpassword:z.string().min(4,"password length should be more than 4 letters")
});

export const signupschema = z.object({
    email: z.string().email("Invalid email address").min(10),
    password: z.string().min(4, "password length should be more than 4 letters"),
    name: z.string().min(4, " Must be more tahn 4 letters"),
    confirmpassword: z.string().min(4, "Must be more than 4 letters")
}).refine((data) => data.password === data.confirmpassword, {
    message: "Password does not match",
    path: ["confirmpassword"],
});

export const resetpasswordschema = z.object({
    newpassword: z.string().min(4, "password length should be more than 4 letters"),
    confirmpassword: z.string().min(4, "confirm password with new password"),
}).refine((data) => data.newpassword === data.confirmpassword, {
    message: "Password does not match",
    path: ["confirmpassword"],
});


export const forgotpasswordschema = z.object({
    email: z.string().email("Invalid email address")
});

export const workspaceSchema = z.object({
    name: z.string().min(4, "Name must be 4 characters long"),
    color: z.string().min(3, "Color must be 2 characters long "),
    description: z.string().optional()
})

export const projectSchema = z.object({
    title: z.string().min(1, "Title must be at least 3 characters"),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.string().min(1, "Start date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    members: z
        .array(
            z.object({
                user: z.string(),
                role: z.enum(["manager", "contributor", "viewer"]),
            })
        )
        .optional(),
    tags: z.string().optional(),
    // tags: z.array(z.string()).optional(),
    // createdBy: z.string().min(1, "CreatedBy is required"),
    // isArchieved: z.boolean().optional()
});

export const createTaskSchema=z.object({
    title:z.string().min(1,"Title is required"),
    description:z.string().optional(),
    dueDate:z.string().optional(),
    assignees:z.array(z.string()).optional(),
    status:z.enum(["To Do","In Progress","Done"]).optional(),
    priority:z.enum(["Low","Medium","High"]).optional(),
})


export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member", "viewer"]),
});