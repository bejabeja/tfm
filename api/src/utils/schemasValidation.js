import { z } from "zod";

export const updateUserSchema = z.object({
    username: z.string().min(2, "Username is required").max(50, "Username must be less than 50 characters"),
    location: z.string().min(2, "Location is required").max(50, "No valid location"),
    name: z
        .string()
        .max(50, "Max 50 characters")
        .nullable(), 

    about: z
        .string()
        .max(1000, "Max 1000 characters")
        .nullable(), 

    bio: z
        .string()
        .max(160, "Max 160 characters")
        .nullable(),
});
