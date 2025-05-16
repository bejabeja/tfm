import { v4 as uuidv4 } from 'uuid';
import client from '../db/clientPostgres.js';
import { Itinerary } from '../models/itinerary.js';

export class FavoritesRepository {
    async addFavorite(itineraryId, userId) {
        const favId = uuidv4();
        const query = `
            INSERT INTO favorites (id, user_id, itinerary_id) 
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, itinerary_id) DO NOTHING
        `;

        await client.query(query, [favId, userId, itineraryId]);
    }

    async removeFavorite(itineraryId, userId) {
        const query = `
            DELETE FROM favorites 
            WHERE itinerary_id = $1 AND user_id = $2
        `;
        await client.query(query, [itineraryId, userId]);
    }

    async isFavorite(itineraryId, userId) {
        const result = await client.query(
            'SELECT 1 FROM favorites WHERE user_id = $1 AND itinerary_id = $2',
            [userId, itineraryId]
        );
        return result.rowCount > 0;
    }

    async getUserFavorites(userId) {
        const query = `
          SELECT i.*
          FROM favorites f
          JOIN itineraries i ON i.id = f.itinerary_id
          WHERE f.user_id = $1
          ORDER BY f.created_at DESC
        `;
        const result = await client.query(query, [userId]);
        return result.rows.map(row => Itinerary.fromDb(row));
    }
}