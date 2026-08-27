export const VAN_LOG_CATEGORIES = [
    'gas_bottle', 'water_fresh', 'water_grey', 'water_black', 'trash',
    'fuel', 'groceries', 'laundry', 'parking', 'overnight_stay', 'maintenance', 'other',
];

// pg parses a DATE column into a Date at local midnight; JSON.stringify then calls
// toISOString() (always UTC), which shifts the date back a day in any positive UTC
// offset (e.g. midnight CEST -> 22:00 UTC the previous day). Formatting with local
// getters instead of toISOString keeps the calendar date the caller actually stored.
export const toDateOnlyString = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export class VanLogEntry {
    constructor({ id, userId, category, title, amount, currency, location, notes, entryDate, createdAt, updatedAt }) {
        this.id = id;
        this.userId = userId;
        this.category = category;
        this.title = title;
        this.amount = amount;
        this.currency = currency;
        this.location = location || null;
        this.notes = notes;
        this.entryDate = entryDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromDb(row) {
        const hasLocation = row.location_name || row.location_label;
        return new VanLogEntry({
            id: row.id,
            userId: row.user_id,
            category: row.category,
            title: row.title,
            amount: row.amount !== null ? Number(row.amount) : null,
            currency: row.currency,
            location: hasLocation ? {
                name: row.location_name,
                country: row.location_country,
                label: row.location_label,
                lat: row.latitude,
                lon: row.longitude,
            } : null,
            notes: row.notes,
            entryDate: toDateOnlyString(row.entry_date),
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    toDTO() {
        return {
            id: this.id,
            userId: this.userId,
            category: this.category,
            title: this.title,
            amount: this.amount,
            currency: this.currency,
            location: this.location,
            notes: this.notes,
            entryDate: this.entryDate,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
