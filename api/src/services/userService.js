import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';


export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async create(userData) {
        const { password, username, email, location } = userData;
        const existingUser = await this.userRepository.findByName(username);
        if (existingUser) {
            throw new Error("User already exists");
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
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            location: user.location
        };
    }

    async getAllUsers() {
        const users = await this.userRepository.getAllUsers();
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
            throw new Error("User not found");
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            location: user.location
        };
    }
}
