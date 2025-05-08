import { z } from "zod";

export const updateUserSchema = z.object({
    username: z.string()
        .min(2, "Username is required")
        .max(50, "Username must be less than 50 characters")
        .regex(/^\S+$/, "Username cannot contain spaces"),
    location: z.string()
        .min(2, "Location is required")
        .max(50, "No valid location"),
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

export const signupSchema = z.object({
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
}).refine((data) => {
    return data.password === data.confirmPassword;
}, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const createItinerarySchema = z
    .object({
        title: z
            .string()
            .min(2, "Title is required")
            .max(50, "Title must be less than 50 characters"),

        destination: z
            .object({
                name: z.string(),
                label: z.string(),
                coordinates: z.object({
                    lat: z.number(),
                    lon: z.number(),
                }),
            }),

        description: z
            .string()
            .max(500, "Description must be less than 500 characters")
            .optional(),

        startDate: z
            .string(),

        endDate: z
            .string(),

        places: z
            .array(
                z.object({
                    id: z.string().uuid().optional(),

                    description: z
                        .string()
                        .max(500, "Description must be less than 500 characters")
                        .optional()
                        .or(z.literal("other")),

                    category: z
                        .string()
                        .optional(),

                    infoPlace: z
                        .object({
                            name: z.string(),
                            label: z.string(),
                            coordinates: z.object({
                                lat: z.number(),
                                lon: z.number(),
                            }),
                        }),
                })
            )
            .min(1, "At least one place is required"),

        budget: z
            .string()
            .refine(val => !isNaN(Number(val)), "Must be a number")
            .transform(val => parseFloat(val)),

        currency: z
            .string()
            .min(1, "Currency is required")
            .max(3, "Currency code too long"),

        numberOfTravellers: z
            .string()
            .refine(val => !isNaN(Number(val)), "Must be a number")
            .transform(val => parseInt(val, 10)),

        category: z
            .string()
    })
    .refine((data) => data.endDate >= data.startDate, {
        message: "End date must be after or equal to start date",
        path: ["endDate"],
    })
    .refine((data) => data.destination.name && data.destination.label, {
        message: "Please select a valid destination from the list",
        path: ["destination"]
    })
    ;