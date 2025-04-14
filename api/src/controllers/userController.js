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

    async getUser(req, res, next) {
        try {
            const user = await this.userService.getUserById(req.user.id);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
}