export class Itinerary {
    constructor({ id, userId, title, description, location, startDate, endDate, createdAt, updatedAt }) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.places = [];
    }

    static fromDb(row) {
        return new Itinerary({
            id: row.itinerary_id,
            userId: row.user_id,
            title: row.itinerary_title,
            description: row.itinerary_description,
            location: row.location,
            startDate: row.start_date,
            endDate: row.end_date,
            createdAt: row.itinerary_created_at,
            updatedAt: row.itinerary_updated_at,
        });
    }

    addPlace(place) {
        this.places.push(place);
    }

    toDTO() {
        return {
            id: this.id,
            userId: this.userId,
            title: this.title,
            description: this.description,
            location: this.location,
            startDate: this.startDate,
            endDate: this.endDate,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            places: this.places.map(place => place.toDTO()),
        };
    }

    toSimpleDTO() {
        return {
            id: this.id,
            userId: this.userId,
            title: this.title,
            description: this.description,
            location: this.location,
            startDate: this.startDate,
            endDate: this.endDate,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
