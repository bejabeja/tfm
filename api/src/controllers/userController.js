import { updateUserSchema } from "../utils/schemasValidation.js";

export class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error)
        }
    }

    async getUserMe(req, res, next) {
        const { id } = req.user;
        try {
            const user = await this.userService.getUserForAuth(id);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateUserMe(req, res, next) {
        const { id } = req.user;

        try {
            const validatedData = updateUserSchema.parse(req.body);
            const updatedUser = await this.userService.updateUser(id, validatedData);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async getFeaturedUsers(req, res, next) {
        try {
            const users = await this.userService.getFeaturedUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        const { id } = req.params;
        try {
            const user = await this.userService.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
}