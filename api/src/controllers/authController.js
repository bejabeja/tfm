import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AuthError } from '../errors/AuthError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { ValidationError } from '../errors/ValidationError.js';

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

export class AuthController {
    constructor(userService) {
        this.userService = userService;
    }

    async create(req, res, next) {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) {
            return next(new ValidationError("Signup validation failed"));
        }
        try {f
            await this.userService.create(result.data);
            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            if (error.code === '23505') { // unique violation error code for PostgreSQL
                return next(new ConflictError("User already exists"));
            }
            next(error);
        }
    }

    async login(req, res, next) {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return next(new ValidationError("Login validation failed"));
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
            next(new AuthError("Invalid credentials"));
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie('access_token').status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            next(error);
        }
    }
}