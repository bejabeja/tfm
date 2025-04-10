import { z } from 'zod';


const signupSchema = z.object({
    username: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
    location: z.string().min(1, "Location is required"),
}).refine((data) => {
    return data.password === data.confirmPassword;
}, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async create(req, res) {
        const result = signupSchema.safeParse(req.body);
        console.log("Parsed data:", result);
        if (!result.success) {
            return res.status(400).json(result.error.format());
        }

        try {
            const user = await this.userService.create(result.data);
            res.status(201).json(user);
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}