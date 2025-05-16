import { v4 as uuidv4 } from 'uuid';
import client from '../db/clientPostgres.js';

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

}