import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { AuthError } from "../errors/AuthError.js";
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }


    async create(userData) {
        const { password, username, email, location } = userData;
        const existingUser = await this.userRepository.findByName(username);
        if (existingUser) {
            throw new ConflictError("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userToSave = {
            uuid: uuidv4(),
            username,
            email,
            password: hashedPassword,
            location
        };

        return await this.userRepository.save(userToSave);
    }

    async login({ username, password }) {
        const user = await this.userRepository.findByName(username);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AuthError("Invalid password");
        }

        return {
            id: user.id,
            username: user.username,
        };
    }

    async getAllUsers() {
        const users = await this.userRepository.getAllUsers();
        if (!users) {
            throw new NotFoundError("No users found");
        }

        return users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            location: user.location
        }));
    }

    async getUserById(id) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            location: user.location,
            avatarUrl: user.avatar_url || this.generateAvatar(user.username),
        };
    }

    async getFeaturedUsers() {
        const users = await this.userRepository.getFeaturedUsers();
        if (!users) {
            throw new NotFoundError("No featured users found");
        }

        return users.map(user => ({
            id: user.id,
            username: user.username,
            location: user.location,
            tripsShared: user.trips_shared || 10000,
            avatarUrl: user.avatar_url || this.generateAvatar(user.username),
        }));
    }

    generateAvatar(username) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            username || "User Name"
        )}&background=random&size=128`;
    }
}
