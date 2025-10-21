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