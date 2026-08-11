import { v4 as uuidv4 } from 'uuid';
import client from '../db/clientPostgres.js';
import { logger } from '../utils/logger.js';

const GROUPING_WINDOW_HOURS = 24;

export class NotificationsRepository {
    async create({ id, userId, actorId, type, itineraryId, commentId }) {
        try {
            const grouped = await client.query(
                `UPDATE notifications
                 SET count = count + CASE WHEN actor_id = $1 THEN 0 ELSE 1 END,
                     actor_id = $1, comment_id = $2, is_read = false, created_at = NOW()
                 WHERE user_id = $3 AND type = $4
                   AND itinerary_id IS NOT DISTINCT FROM $5
                   AND created_at > NOW() - INTERVAL '${GROUPING_WINDOW_HOURS} hours'
                 RETURNING id`,
                [actorId, commentId ?? null, userId, type, itineraryId ?? null]
            );
            if (grouped.rowCount > 0) return;

            const notificationId = id || uuidv4();
            const query = `
                INSERT INTO notifications (id, user_id, actor_id, type, itinerary_id, comment_id)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await client.query(query, [notificationId, userId, actorId, type, itineraryId ?? null, commentId ?? null]);
        } catch (err) {
            // fire-and-forget: don't let a notification failure break the caller's main flow
            logger.error('[notifications] failed to create notification:', err);
        }
    }

    async getByUserId(userId, limit = 20, offset = 0) {
        const query = `
            SELECT
                n.id,
                n.type,
                n.is_read,
                n.created_at,
                n.count,
                a.id         AS actor_id,
                a.username   AS actor_username,
                a.avatar_url AS actor_avatar_url,
                i.id         AS itinerary_id,
                i.title      AS itinerary_title
            FROM notifications n
            JOIN users a ON n.actor_id = a.id
            LEFT JOIN itineraries i ON n.itinerary_id = i.id
            WHERE n.user_id = $1
            ORDER BY n.created_at DESC
            LIMIT $2 OFFSET $3
        `;
        const result = await client.query(query, [userId, limit, offset]);
        return result.rows.map(row => ({
            id: row.id,
            type: row.type,
            isRead: row.is_read,
            createdAt: row.created_at,
            count: row.count,
            actor: {
                id: row.actor_id,
                username: row.actor_username,
                avatarUrl: row.actor_avatar_url,
            },
            itinerary: row.itinerary_id
                ? { id: row.itinerary_id, title: row.itinerary_title }
                : null,
        }));
    }

    async markAllAsRead(userId) {
        const query = `
            UPDATE notifications
            SET is_read = true
            WHERE user_id = $1 AND is_read = false
        `;
        await client.query(query, [userId]);
    }

    async getUnreadCount(userId) {
        const result = await client.query(
            `SELECT COUNT(*) AS count FROM notifications WHERE user_id = $1 AND is_read = false`,
            [userId]
        );
        return parseInt(result.rows[0].count, 10);
    }

    async getTotalCount(userId) {
        const result = await client.query(
            `SELECT COUNT(*) AS count FROM notifications WHERE user_id = $1`,
            [userId]
        );
        return parseInt(result.rows[0].count, 10);
    }
}
