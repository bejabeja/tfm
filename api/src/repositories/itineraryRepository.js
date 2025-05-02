import { v4 as uuidv4 } from 'uuid';
import client from '../db/clientPostgres.js';
import { Itinerary } from '../models/itinerary.js';

export class ItineraryRepository {
    async getItinerariesByUserId(userId) {
        const query = `SELECT * FROM itineraries WHERE user_id = $1`
        const result = await client.query(query, [userId]);

        return result.rows.map(row => Itinerary.fromDb(row));
    }

    async getItineraryById(itineraryId) {
        const query = `SELECT * FROM itineraries WHERE id = $1`;
        const result = await client.query(query, [itineraryId]);
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

    async updateItinerary(itineraryId, itineraryData) {
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
                SET 
                    title = $2, 
                    description = $3, 
                    location = $4, 
                    start_date = $5, 
                    end_date = $6, 
                    number_of_people = $7, 
                    budget = $8, 
                    currency = $9, 
                    category = $10,
                    updated_at = NOW()
                WHERE id = $1
                RETURNING *;
            `;

        const result = await client.query(updateItineraryQuery, [
            itineraryId,
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

    async unlinkPlaceFromItinerary(itineraryId, placeId) {
        const itineraryPlaceQuery = `
            DELETE FROM itinerary_places
            WHERE itinerary_id = $1 AND place_id = $2;
        `;

        await client.query(itineraryPlaceQuery, [
            itineraryId,
            placeId
        ]);
    }

    async getTotalItinerariesByUserId(userId) {
        const query = `
            SELECT COUNT(*) as total
            FROM itineraries
            WHERE user_id = $1
        `;
        const result = await client.query(query, [userId]);
        return parseInt(result.rows[0].total, 10);
    }

    async findByFilters({ category, destination, page = 1, limit = 10 }) {
        const offset = (page - 1) * limit;
        const filters = [];
        const values = [];
        let index = 1;

        if (category && category !== "all") {
            filters.push(`category = $${index++}`);
            values.push(category);
        }

        if (destination) {
            filters.push(`LOWER(location) LIKE LOWER($${index++})`);
            values.push(`%${destination}%`);
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const query = `
            SELECT *
            FROM itineraries
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${index++} OFFSET $${index}
        `;

        values.push(limit);
        values.push(offset);

        const result = await client.query(query, values);
        return result.rows.map(row => Itinerary.fromDb(row));
    }
    
    async countByFilters({ category, destination }) {
        const filters = [];
        const values = [];
        let index = 1;

        if (category && category !== "all") {
            filters.push(`category = $${index++}`);
            values.push(category);
        }

        if (destination) {
            filters.push(`LOWER(location) LIKE LOWER($${index++})`);
            values.push(`%${destination}%`);
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const query = `
            SELECT COUNT(*) AS total
            FROM itineraries
            ${whereClause}
        `;

        const result = await client.query(query, values);
        return parseInt(result.rows[0].total, 10);
    }


}
