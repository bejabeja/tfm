import { v4 as uuidv4 } from 'uuid';
import client from '../db/clientPostgres.js';
import { Itinerary } from '../models/itinerary.js';

export class ItineraryRepository {
    async findByUserId(userId) {
        const query = `SELECT * FROM itineraries WHERE user_id = $1`;
        const result = await client.query(query, [userId]);

        return result.rows.map(row => Itinerary.fromDb(row));
    }

    async getItineraryById(itineraryId) {
        const query = `SELECT * FROM itineraries WHERE id = $1`;
        const result = await client.query(query, [itineraryId]);
        if (result.rows.length === 0) return null;

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
            photoUrl,
            photoPublicId
        } = itineraryData;
        const itineraryId = uuidv4();
        const itineraryQuery = `
            INSERT INTO itineraries (
                id, user_id, title, description,
                location_name, location_label, latitude, longitude,
                start_date, end_date, number_of_people,
                category, budget, currency, photo_url, photo_public_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *;
        `;

        const result = await client.query(itineraryQuery, [
            itineraryId,
            userId,
            title,
            description,
            location.name,
            location.label,
            location.lat,
            location.lon,
            startDate,
            endDate,
            numberOfPeople,
            category,
            budget,
            currency,
            photoUrl,
            photoPublicId
        ]);

        return Itinerary.fromDb(result.rows[0]);
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
            photoUrl,
            photoPublicId
        } = itineraryData;

        const updateItineraryQuery = `
            UPDATE itineraries
            SET 
                title = $2, 
                description = $3, 
                location_name = $4, 
                location_label = $5,
                latitude = $6,
                longitude = $7,
                start_date = $8, 
                end_date = $9, 
                number_of_people = $10, 
                budget = $11, 
                currency = $12, 
                category = $13,
                photo_url = $14,
                photo_public_id = $15,
                updated_at = NOW()
            WHERE id = $1
            RETURNING *;
        `;

        const result = await client.query(updateItineraryQuery, [
            itineraryId,
            title,
            description,
            location.name,
            location.label,
            location.lat,
            location.lon,
            startDate,
            endDate,
            numberOfPeople,
            budget,
            currency,
            category,
            photoUrl,
            photoPublicId
        ]);

        return Itinerary.fromDb(result.rows[0]);
    }

    async deleteItinerary(itineraryId) {
        const deleteItineraryQuery = `DELETE FROM itineraries WHERE id = $1;`;
        await client.query(deleteItineraryQuery, [itineraryId]);
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

        await client.query(itineraryPlaceQuery, [itineraryId, placeId]);
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

    async findByFilters({ category, destination, budgetMin, budgetMax, durationMin, durationMax, startDateMin, startDateMax, page = 1, limit = 10 }) {
        const offset = (page - 1) * limit;
        const filters = [];
        const values = [];
        let index = 1;

        if (category && category !== "all") {
            filters.push(`category = $${index++}`);
            values.push(category);
        }

        if (destination) {
            filters.push(`LOWER(location_name) LIKE LOWER($${index++})`);
            values.push(`%${destination}%`);
        }

        if (budgetMin !== undefined) {
            filters.push(`budget >= $${index++}`);
            values.push(budgetMin);
        }

        if (budgetMax !== undefined) {
            filters.push(`budget <= $${index++}`);
            values.push(budgetMax);
        }

        if (durationMin !== undefined) {
            filters.push(`(FLOOR(EXTRACT(EPOCH FROM (end_date - start_date)) / 86400) + 1) >= $${index++}`);
            values.push(durationMin);
        }

        if (durationMax !== undefined) {
            filters.push(`(FLOOR(EXTRACT(EPOCH FROM (end_date - start_date)) / 86400) + 1) <= $${index++}`);
            values.push(durationMax);
        }

        if (startDateMin !== undefined) {
            filters.push(`start_date::date >= $${index++}::date`);
            values.push(startDateMin);
        }

        if (startDateMax !== undefined) {
            filters.push(`start_date::date <= $${index++}::date`);
            values.push(startDateMax);
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const query = `
        SELECT *
        FROM itineraries
        ${whereClause}
        ORDER BY start_date DESC
        LIMIT $${index++} OFFSET $${index++}
    `;

        values.push(limit, offset);

        const result = await client.query(query, values);
        return result.rows.map(row => Itinerary.fromDb(row));
    }

    async countByFilters({ category, destination, budgetMin, budgetMax, durationMin, durationMax, startDateMin, startDateMax }) {
        const filters = [];
        const values = [];
        let index = 1;

        if (category && category !== "all") {
            filters.push(`category = $${index++}`);
            values.push(category);
        }

        if (destination) {
            filters.push(`LOWER(location_name) LIKE LOWER($${index++})`);
            values.push(`%${destination}%`);
        }

        if (budgetMin !== undefined) {
            filters.push(`budget >= $${index++}`);
            values.push(budgetMin);
        }

        if (budgetMax !== undefined) {
            filters.push(`budget <= $${index++}`);
            values.push(budgetMax);
        }

        //TODO: think about add totaldays in ddbb itineraries
        if (durationMin !== undefined) {
            filters.push(`(FLOOR(EXTRACT(EPOCH FROM (end_date - start_date)) / 86400) + 1) >= $${index++}`);
            values.push(durationMin);
        }

        if (durationMax !== undefined) {
            filters.push(`(FLOOR(EXTRACT(EPOCH FROM (end_date - start_date)) / 86400) + 1) <= $${index++}`);
            values.push(durationMax);
        }

        if (startDateMin !== undefined) {
            filters.push(`start_date::date >= $${index++}::date`);
            values.push(startDateMin);
        }

        if (startDateMax !== undefined) {
            filters.push(`start_date::date <= $${index++}::date`);
            values.push(startDateMax);
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
