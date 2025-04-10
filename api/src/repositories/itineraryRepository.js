import client from '../db/clientPostgres.js';

export class ItineraryRepository {
    async getAll() {
        const { rows } = await client.query('SELECT * FROM itinerary');
        return rows;
    }
}
