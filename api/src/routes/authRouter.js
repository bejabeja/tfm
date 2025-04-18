import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { UserRepository } from "../repositories/userRepository.js";
import { AuthService } from "../services/authService.js";
import { UserService } from "../services/userService.js";

export const createAuthRouter = () => {
    const router = Router();
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const authService = new AuthService(userRepository);
    const authController = new AuthController(userService, authService);

    router.post("/create", authController.create.bind(authController));
    router.post("/login", authController.login.bind(authController));
    router.post("/logout", authController.logout.bind(authController));

    return router;
};
