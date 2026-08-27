import { v4 as uuidv4 } from 'uuid';
import client from '../db/clientPostgres.js';
import { VanLogEntry } from '../models/vanLogEntry.js';

export class VanLogRepository {
    async create(data) {
        const {
            userId, category, title, amount, currency,
            location, notes, entryDate,
        } = data;
        const id = uuidv4();

        const query = `
            INSERT INTO van_log_entries (
                id, user_id, category, title, amount, currency,
                location_name, location_country, location_label, latitude, longitude,
                notes, entry_date
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
            RETURNING *;
        `;

        const result = await client.query(query, [
            id, userId, category, title ?? null, amount ?? null, currency ?? null,
            location?.name ?? null, location?.country ?? null, location?.label ?? null,
            location?.lat ?? null, location?.lon ?? null,
            notes ?? null, entryDate,
        ]);

        return VanLogEntry.fromDb(result.rows[0]);
    }

    async findByUserId(userId) {
        const result = await client.query(
            `SELECT * FROM van_log_entries WHERE user_id = $1 ORDER BY entry_date DESC, created_at DESC`,
            [userId]
        );
        return result.rows.map(VanLogEntry.fromDb);
    }

    async findById(id) {
        const result = await client.query(
            `SELECT * FROM van_log_entries WHERE id = $1`,
            [id]
        );
        return result.rows.length ? VanLogEntry.fromDb(result.rows[0]) : null;
    }

    async update(id, data) {
        const {
            category, title, amount, currency,
            location, notes, entryDate,
        } = data;

        const query = `
            UPDATE van_log_entries SET
                category = $1, title = $2, amount = $3, currency = $4,
                location_name = $5, location_country = $6, location_label = $7,
                latitude = $8, longitude = $9, notes = $10, entry_date = $11,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $12
            RETURNING *;
        `;

        const result = await client.query(query, [
            category, title ?? null, amount ?? null, currency ?? null,
            location?.name ?? null, location?.country ?? null, location?.label ?? null,
            location?.lat ?? null, location?.lon ?? null,
            notes ?? null, entryDate, id,
        ]);

        return result.rows.length ? VanLogEntry.fromDb(result.rows[0]) : null;
    }

    async delete(id) {
        await client.query(`DELETE FROM van_log_entries WHERE id = $1`, [id]);
    }

    async getTotalsByCategory(userId) {
        const result = await client.query(
            `SELECT category, COALESCE(SUM(amount), 0) AS total, COUNT(*)::int AS count
             FROM van_log_entries
             WHERE user_id = $1
             GROUP BY category`,
            [userId]
        );
        return result.rows.map(row => ({
            category: row.category,
            total: Number(row.total),
            count: row.count,
        }));
    }
}
