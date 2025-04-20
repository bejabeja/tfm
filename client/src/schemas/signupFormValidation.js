import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string()
      .min(2, "Username is required")
      .max(50, "Username must be less than 50 characters")
      .regex(/^\S+$/, "Username cannot contain spaces"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password confirmation must be at least 6 characters long"),
    location: z.string()
      .min(2, "Location is required")
      .max(50, "No valid location"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });