import { v4 as uuidv4 } from 'uuid';
import client from '../db/clientPostgres.js';
import { Place } from "../models/place.js";

export class PlacesRepository {

    async insertPlace(placeData) {
        const placeId = uuidv4();
        const placeQuery = `
            INSERT INTO places (id, title, description, label, address, latitude, longitude, category)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const result = await client.query(placeQuery, [
            placeId,
            placeData.infoPlace.name,
            placeData.description,
            placeData.infoPlace.label,
            placeData.infoPlace.label,
            placeData.infoPlace.lat,
            placeData.infoPlace.lon,
            placeData.category,
        ]);

        return Place.fromDb(result.rows[0], placeData.orderIndex);
    }

    async getPlacesByItineraryId(itineraryId) {
        const placesQuery = `
            SELECT p.*, ip.order_index
            FROM places p
            JOIN itinerary_places ip ON p.id = ip.place_id
            WHERE ip.itinerary_id = $1
            ORDER BY ip.order_index;
        `;

        const result = await client.query(placesQuery, [itineraryId]);
        return result.rows.map(row => Place.fromDb(row, row.order_index));

    }

    async updatePlace(placeData) {
        const { id } = placeData;
        const placeQuery = `
            UPDATE places
            SET 
                title = $2, 
                description = $3, 
                address = $4, 
                label = $5, 
                latitude = $6, 
                longitude = $7, 
                category = $8
            WHERE id = $1
            RETURNING *;
        `;

        const result = await client.query(placeQuery, [
            id,
            placeData.infoPlace.name,
            placeData.description,
            placeData.infoPlace.label,
            placeData.infoPlace.label,
            placeData.infoPlace.lat,
            placeData.infoPlace.lon,
            placeData.infoPlace.category,
        ]);

        return Place.fromDb(result.rows[0], placeData.orderIndex);
    }


}