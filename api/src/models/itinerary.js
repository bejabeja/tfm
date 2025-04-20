export class Itinerary {
    constructor({ id, userId, title, description, location, startDate, endDate, createdAt, updatedAt, photoUrl }) {
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
        this.photoUrl = photoUrl;
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
            photoUrl: row.photo_url,
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
            title: this.title,
            description: this.description,
            location: this.location,
            tripTotalDays: this.getTotalDays(),
            photoUrl: this.photoUrl || this.getPlaceholderImage(),
        };
    }

    getTotalDays() {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getPlaceholderImage() {
        return "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHRyaXAlMjBpdGluZXJhcnl8ZW58MHx8fHwxNjg5NTY1NzA3&ixlib=rb-4.0.3&q=80&w=400";
    }
}
