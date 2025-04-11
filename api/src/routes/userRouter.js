import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { UserService } from "../services/userService.js";

export const createUserRouter = (userRepository) => {
    const router = Router();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    router.post("/create", userController.create.bind(userController));
    router.post("/login", userController.login.bind(userController));
    router.get("/", authenticate, userController.getAllUsers.bind(userController));
    router.post("/logout", userController.logout.bind(userController));

    return router;
};
