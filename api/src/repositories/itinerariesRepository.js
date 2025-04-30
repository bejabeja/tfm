import { v4 as uuidv4 } from 'uuid';
import client from '../db/clientPostgres.js';
import { Itinerary } from '../models/itinerary.js';

export class ItineraryRepository {
    async getItinerariesByUserId(userId) {
        const query = `SELECT * FROM itineraries WHERE user_id = $1`
        const result = await client.query(query, [userId]);

        return result.rows.map(row => Itinerary.fromDb(row));
    }

    async getItineraryById(id) {
        const query = `SELECT * FROM itineraries WHERE id = $1`;
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }

        return Itinerary.fromDb(result.rows[0]);
    }

    async createItinerary(itineraryData) {
        const {
            userId,
            title,
            description,
            location,
            startDate,
            endDate,
            numberOfPeople,
            category,
            budget,
            currency,
        } = itineraryData;

        const itineraryId = uuidv4();
        const itineraryQuery = `
                INSERT INTO itineraries (id, user_id, title, description, location, start_date, end_date, number_of_people, category, budget, currency)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *;
            `;

        const result = await client.query(itineraryQuery, [
            itineraryId,
            userId,
            title,
            description,
            location,
            startDate,
            endDate,
            numberOfPeople,
            category,
            budget,
            currency,
        ]);

        return Itinerary.fromDb(result.rows[0]);
    }

    async deleteItinerary(itineraryId) {
        const deleteItineraryQuery = `DELETE FROM itineraries WHERE id = $1;`;
        await client.query(deleteItineraryQuery, [itineraryId]);
    }

    async updateItinerary(id, itineraryData) {
        const {
            title,
            description,
            location,
            startDate,
            endDate,
            numberOfPeople,
            budget,
            currency,
            category,
        } = itineraryData;

        const updateItineraryQuery = `
                UPDATE itineraries
                SET title = $2, description = $3, location = $4, start_date = $5, end_date = $6, number_of_people = $7, budget = $8, currency = $9, category = $10
                WHERE id = $1
                RETURNING *;
            `;

        const result = await client.query(updateItineraryQuery, [
            id,
            title,
            description,
            location,
            startDate,
            endDate,
            numberOfPeople,
            budget,
            currency,
            category,
        ]);
        return Itinerary.fromDb(result.rows[0]);
    }

    async linkPlaceToItinerary(itineraryId, placeId, orderIndex) {
        const itineraryPlaceId = uuidv4();
        const itineraryPlaceQuery = `
            INSERT INTO itinerary_places (id, itinerary_id, place_id, order_index)
            VALUES ($1, $2, $3, $4);
        `;

        await client.query(itineraryPlaceQuery, [
            itineraryPlaceId,
            itineraryId,
            placeId,
            orderIndex,
        ]);
    }
    
    async updatePlaceInItinerary(itineraryId, placeData) {
        const itineraryPlaceQuery = `
            UPDATE itinerary_places
            SET order_index = $2
            WHERE itinerary_id = $1 AND place_id = $3
            RETURNING *;
        `;

        const result = await client.query(itineraryPlaceQuery, [
            itineraryId,
            placeData.orderIndex,
            placeData.id
        ]);

        return result.rows[0];
    }
}
