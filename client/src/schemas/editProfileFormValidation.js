// TODOOOOOOOO
import { z } from "zod";

export const editProfileSchema = z.object({
  username: z.string().min(2, "Username must have at least 2 characters"),
  location: z.string().min(2, "Location must have at least 2 characters"),
  name: z.string().optional(),
  about: z.string().optional(),
  bio: z.string().optional(),
});
