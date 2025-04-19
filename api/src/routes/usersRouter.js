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
    router.get("/me", authenticate, userController.getUserMe.bind(userController));
    router.put("/me", authenticate, userController.updateUserMe.bind(userController));
    router.get("/featured", userController.getFeaturedUsers.bind(userController));
    router.get("/:id", userController.getUserById.bind(userController));

    return router;
};
