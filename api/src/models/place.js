export class Place {
    constructor({ id, title, description, address, latitude, longitude, category, createdAt, updatedAt, orderIndex }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.category = category?.toLowerCase() || "other";
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.orderIndex = orderIndex;
    }

    static fromDb(row, orderIndex) {
        return new Place({
            id: row.id,
            title: row.title,
            description: row.description,
            address: row.address,
            latitude: row.latitude,
            longitude: row.longitude,
            category: row.category,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            orderIndex,
        });
    }

    toDTO() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            address: this.address,
            latitude: this.latitude,
            longitude: this.longitude,
            category: this.category,
            orderIndex: this.orderIndex
        };
    }
}
