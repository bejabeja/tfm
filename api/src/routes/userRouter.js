import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { UserService } from "../services/userService.js";

export const createUserRouter = (userRepository) => {
    const router = Router();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    router.post("/create", userController.create.bind(userController));
    router.post("/login", userController.login.bind(userController));
    router.get("/", userController.getAllUsers.bind(userController));
    
    return router;
};
