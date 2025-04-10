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

    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }
}
