import { v4 as uuidv4 } from 'uuid';
import db from '../db/clientPostgres.js';

export class AuditLogRepository {
    async log({ actorId, actorUsername, action, targetUserId, targetUsername, metadata = {} }) {
        const id = uuidv4();
        await db.query(
            `INSERT INTO audit_log (id, actor_id, actor_username, action, target_user_id, target_username, metadata)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id, actorId, actorUsername, action, targetUserId, targetUsername, metadata]
        );
    }

    async findRecent(limit = 50) {
        const result = await db.query(
            `SELECT * FROM audit_log ORDER BY created_at DESC LIMIT $1`,
            [limit]
        );
        return result.rows.map(row => ({
            id: row.id,
            actorId: row.actor_id,
            actorUsername: row.actor_username,
            action: row.action,
            targetUserId: row.target_user_id,
            targetUsername: row.target_username,
            metadata: row.metadata,
            createdAt: row.created_at,
        }));
    }
}
