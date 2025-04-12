import jwt from 'jsonwebtoken';
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

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async create(req, res) {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json(result.error.format());
        }

        try {
            await this.userService.create(result.data);
            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async login(req, res) {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json(result.error.format());
        }

        try {
            const { username, password } = result.data;
            const user = await this.userService.login({ username, password });
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000,
            }).status(200).json(user);
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(401).json({ error: "Invalid credentials" });
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

    async logout(req, res) {
        try {
            res.clearCookie('access_token').status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            console.error("Error logging out:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getUser(req, res) {
        try {
            const user = await this.userService.getUserById(req.user.id);
            res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}