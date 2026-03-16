import { z } from "zod";

export const signInFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .min(1, "Password is required"),
});

export type SignInFormInput = z.infer<typeof signInFormSchema>;
