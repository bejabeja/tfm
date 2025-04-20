import client from '../db/clientPostgres.js';
import { Itinerary } from '../models/itinerary.js';
import { Place } from '../models/place.js';

export class ItineraryRepository {
    async getItinerariesByUserId(userId) {
        const query = `
        SELECT
          i.id AS itinerary_id,
          i.user_id,
          i.title AS itinerary_title,
          i.description AS itinerary_description,
          i.location,
          i.start_date,
          i.end_date,
          i.created_at AS itinerary_created_at,
          i.updated_at AS itinerary_updated_at,
          p.id AS place_id,
          p.title AS place_title,
          p.description AS place_description,
          p.address,
          p.latitude,
          p.longitude,
          p.category,
          p.created_at AS place_created_at,
          p.updated_at AS place_updated_at,
          ip.order_index
        FROM itineraries i
        LEFT JOIN itinerary_places ip ON ip.itinerary_id = i.id
        LEFT JOIN places p ON p.id = ip.place_id
        WHERE i.user_id = $1
        ORDER BY i.start_date, ip.order_index;
      `;

        const result = await client.query(query, [userId]);
        const rows = result.rows;

        const itinerariesMap = new Map();

        for (const row of rows) {
            const itineraryId = row.itinerary_id;

            if (!itinerariesMap.has(itineraryId)) {
                itinerariesMap.set(itineraryId, Itinerary.fromDb(row));
            }

            if (row.place_id) {
                const place = Place.fromDb(row);
                itinerariesMap.get(itineraryId).addPlace(place);
            }
        }

        return Array.from(itinerariesMap.values());
    }
}
