import db from '../db/clientPostgres.js';

export class UserRepository {
    async save(user) {
        const { uuid, username, email, password, location } = user;
        const result = await db.query(
            "INSERT INTO users (id, username, email, password, location) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [uuid, username, email, password, location]
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
}
