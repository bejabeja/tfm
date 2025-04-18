import { z } from 'zod';
import { AuthError } from '../errors/AuthError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { ValidationError } from '../errors/ValidationError.js';

const signupSchema = z.object({
    username: z.string().min(1, "Name is required").regex(/^\S+$/, "Username cannot contain spaces"),
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
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }

    async create(req, res, next) {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) {
            return next(new ValidationError("Signup validation failed"));
        }
        try {
            await this.userService.create(result.data);
            return res.status(201).json({ message: "User created successfully" });
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
            const user = await this.authService.login({ username, password });
            const accessToken = this.authService.generateAccessToken(user);
            const refreshToken = this.authService.generateRefreshToken(user);
            this.authService.setAuthCookies(res, accessToken, refreshToken)

            return res.status(200).json(user);

        } catch (error) {
            console.error("Login error:", error);
            next(new AuthError("Invalid credentials"));
        }
    }

    async logout(req, res, next) {
        try {
            this.authService.clearAuthCookies(res)
            return res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            next(error);
        }
    }
}
