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
  // createBy: z.string().min(1, "Created by is required"), 
  // members: z.array(
  //   z.object({
  //     user: z.string().min(1, "User is required"), // Should be ObjectId string
  //     role: z.enum(["owner", "member", "viewer", "admin"]).default("member"),
  //   })
  // ).optional(),
  // projects: z.array(z.string()).optional(), // Should be array of ObjectId strings
});