import db from '../db/clientPostgres.js';

export class UserRepository {
    async save(user) {
        const { uuid, username, email, password, location, avatarUrl } = user;
        const result = await db.query(
            "INSERT INTO users (id, username, email, password, location, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [uuid, username, email, password, location, avatarUrl]
        );
        return result.rows[0];
    }

    async findByName(username) {
        const result = await db.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        const user = result.rows[0]

        return user;
    }

    async getAllUsers() {
        const result = await db.query("SELECT * FROM users");
        return result.rows;
    }

    async getUserById(id) {
        const result = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );

        return result.rows[0];
    }

    async getFeaturedUsers() {
        const result = await db.query(
            "SELECT * FROM users WHERE role = 'featured' ORDER BY RANDOM() LIMIT 3"
        );

        return result.rows;
    }

    async updateUser(id, userData) {
        const { username, name, avatarUrl, location, bio, about, updatedAt } = userData;

        const result = await db.query(
            "UPDATE users SET username = $1, name = $2, avatar_url = $3, location = $4, bio = $5, about = $6, updated_at =$7 WHERE id = $8 RETURNING *",
            [username, name, avatarUrl, location, bio, about, updatedAt, id]
        );
        return result.rows[0];
    }
}
