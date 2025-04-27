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

const getToday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
};

export const createItinerarySchema = z
    .object({
        title: z
            .string()
            .min(2, "Title is required")
            .max(100, "Title must be less than 100 characters"),

        destination: z
            .string()
            .min(2, "Destination is required")
            .max(100, "Destination must be less than 100 characters"),

        description: z
            .string()
            .max(1000, "Description must be less than 1000 characters")
            .optional(),

        startDate: z
            .string()
            .transform((str) => new Date(str))
            .refine((date) => date >= getToday(), {
                message: "Start date must be today or in the future",
            }),

        endDate: z
            .string()
            .transform((str) => new Date(str))
            .refine((date) => date >= getToday(), {
                message: "End date must be today or in the future",
            }),

        placeName: z
            .string()
            .min(2, "Place name is required")
            .max(100, "Place name must be less than 100 characters"),

        placeDescription: z
            .string()
            .max(1000, "Description must be less than 1000 characters")
            .optional()
            .or(z.literal("")),

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
    })
    .refine((data) => data.endDate >= data.startDate, {
        message: "End date must be after or equal to start date",
        path: ["endDate"],
    });