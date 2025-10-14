import {z} from 'zod';

export const loginschema=z.object({
    email:z.string().email("Invalid email address").min(10),
    password:z.string().min(4,"password length should be more than 4 letters"),
    // confirmpassword:z.string().min(4,"password length should be more than 4 letters")
})