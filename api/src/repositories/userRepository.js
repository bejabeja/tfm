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
        return result.rows[0];
    }

    async getAllUsers() {
        const result = await db.query("SELECT * FROM users");
        return result.rows;
    }


}
