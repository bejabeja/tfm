import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { generateAvatar } from "../utils/avatar.js";

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async create(userData) {
        const { password, username, email, location } = userData;
        const existingUser = await this.userRepository.findByName(username);
        if (existingUser) {
            throw new ConflictError("Username is not available. Please choose another one.");
        }

        const existingByEmail = await this.userRepository.findByEmail(email);
        if (existingByEmail) {
            throw new ConflictError("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userToSave = {
            uuid: uuidv4(),
            username,
            email,
            password: hashedPassword,
            location,
            avatarUrl: generateAvatar(username),
        };

        return await this.userRepository.save(userToSave);
    }

    async getAllUsers() {
        const users = await this.userRepository.getAllUsers();
        if (!users) {
            throw new NotFoundError("No users found");
        }

        return users.map(user => (user.toSimpleDTO()));
    }

    async getUserForAuth(id) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user.toSimpleDTO();
    }

    async getUserById(id) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return user.toDTO();
    }

    async updateUser(id, userData) {
        const usernameExist = await this.userRepository.findByName(userData.username);
        if (usernameExist && usernameExist.id !== id) {
            throw new ConflictError("Username is not available. Please choose another one.");
        }

        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        user.updateProfile(
            userData.name,
            userData.location,
            userData.avatarUrl || user.avatarUrl,
            userData.bio,
            userData.about,
            userData.username
        );

        return await this.userRepository.updateUser(id, user);
    }

    async getFeaturedUsers() {
        const users = await this.userRepository.getFeaturedUsers();
        if (!users) {
            throw new NotFoundError("No featured users found");
        }

        return users.map(user => user.toFeaturedDTO());
    }
}
