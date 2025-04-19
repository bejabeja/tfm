import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { generateAvatar } from "../utils/avatar.js";
import { formatDate } from "../utils/date.js";

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

        return users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            location: user.location
        }));
    }

    async getUserForAuth(id) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        return {
            id: user.id,
            username: user.username,
            avatarUrl: user.avatar_url,
        };
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
            name: user.name || "User Name",
            location: user.location,
            tripsShared: user.trips_shared || 10000,
            followers: user.followers || 1000,
            following: user.following || 770,
            avatarUrl: user.avatar_url,
            itineraries: user.itineraries || [],
            createdAt: formatDate(user.created_at),
            bio: user.bio || "No bio available",
            about: user.about || "No about information available No about information available No about information available No about information available No about information available No about information available No about information available No about information available No about information available No about information available",
        };
    }

    async updateUser(id, userData) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const updatedUser = {
            username: userData.username,
            name: userData.name,
            avatarUrl: userData.avatar_url || user.avatar_url,
            location: userData.location,
            bio: userData.bio,
            about: userData.about,
            updatedAt: new Date(),
        };

        return await this.userRepository.updateUser(id, updatedUser);
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
            avatarUrl: user.avatar_url,
        }));
    }
}
