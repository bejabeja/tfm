import { v4 as uuidv4 } from 'uuid';
import client from '../db/clientPostgres.js';
import { Itinerary } from '../models/itinerary.js';
import { Place } from '../models/place.js';

export class ItineraryRepository {
    #buildItineraryQuery(whereClause = '') {
        return `
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
          i.budget,
          i.number_of_people,
          i.likes_count,
          i.comments_count,
          i.category,
          i.currency,
          p.id AS place_id,
          p.title AS place_title,
          p.description AS place_description,
          p.address,
          p.latitude,
          p.longitude,
          p.category AS place_category,
          p.created_at AS place_created_at,
          p.updated_at AS place_updated_at,
          ip.order_index
        FROM itineraries i
        LEFT JOIN itinerary_places ip ON ip.itinerary_id = i.id
        LEFT JOIN places p ON p.id = ip.place_id
        ${whereClause}
        ORDER BY i.start_date, ip.order_index;
      `;
    }

    #mapItineraryRows(rows) {
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

    async #insertPlace(placeData) {
        const placeId = uuidv4();
        const placeQuery = `
            INSERT INTO places (id, title, description, address, latitude, longitude, category)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const result = await client.query(placeQuery, [
            placeId,
            placeData.title,
            placeData.description,
            placeData.address,
            placeData.latitude,
            placeData.longitude,
            placeData.category,
        ]);

        return { place: Place.fromDb(result.rows[0]), placeId };
    }

    async #insertItineraryPlace(itineraryId, placeId, orderIndex) {
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

    async getItinerariesByUserId(userId) {
        const query = this.#buildItineraryQuery('WHERE i.user_id = $1');
        const result = await client.query(query, [userId]);
        return this.#mapItineraryRows(result.rows);
    }

    async getItineraryById(id) {
        const query = this.#buildItineraryQuery('WHERE i.id = $1');
        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        return this.#mapItineraryRows(result.rows)[0];
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
            places = [],
            category,
            budget,
            currency,
        } = itineraryData;

        const itineraryId = uuidv4();

        try {
            await client.query('BEGIN');

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

            const itinerary = Itinerary.fromDb(result.rows[0]);

            for (const placeData of places) {
                const { place, placeId } = await this.#insertPlace(placeData);

                await this.#insertItineraryPlace(itineraryId, placeId, placeData.orderIndex);

                itinerary.addPlace(place);
            }

            await client.query('COMMIT');
            return itinerary;

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error creating itinerary:', error);
            throw error;
        }
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
            places,
        } = itineraryData;

        try {
            await client.query('BEGIN');

            const updateItineraryQuery = `
                UPDATE itineraries
                SET title = $2, description = $3, location = $4, start_date = $5, end_date = $6, number_of_people = $7, budget = $8, currency = $9, category = $10
                WHERE id = $1;
            `;

            await client.query(updateItineraryQuery, [
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

            for (const placeData of places) {
                if (placeData.id) {
                    const updatePlaceQuery = `
                        UPDATE places
                        SET title = $2, description = $3, address = $4, latitude = $5, longitude = $6, category = $7
                        WHERE id = $1;
                    `;

                    await client.query(updatePlaceQuery, [
                        placeData.id,
                        placeData.title,
                        placeData.description,
                        placeData.address,
                        placeData.latitude,
                        placeData.longitude,
                        placeData.category,
                    ]);

                    const updateOrderQuery = `
                        UPDATE itinerary_places
                        SET order_index = $2
                        WHERE itinerary_id = $1 AND place_id = $3;
                    `;

                    await client.query(updateOrderQuery, [
                        itineraryId,
                        placeData.orderIndex,
                        placeData.id
                    ]);
                } else {
                    const { placeId } = await this.#insertPlace(placeData);

                    await this.#insertItineraryPlace(itineraryId, placeId, placeData.orderIndex);
                }
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error updating itinerary:', error);
            throw error;
        }
    }
}
