import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { UserRepository } from "../repositories/userRepository.js";
import { UserService } from "../services/userService.js";

export const createUsersRouter = () => {
    const router = Router();
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    router.get("/", authenticate, userController.getAllUsers.bind(userController));
    router.get("/me", authenticate, userController.getUser.bind(userController));
    router.get("/featured", userController.getFeaturedUsers.bind(userController));

    return router;
};
