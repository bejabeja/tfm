export class ShoppingListItem {
    constructor({ id, userId, name, category, amount, unit, notes, createdAt, updatedAt }) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.unit = unit;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromDb(row) {
        return new ShoppingListItem({
            id: row.id,
            userId: row.user_id,
            name: row.name,
            category: row.category,
            amount: Number(row.amount),
            unit: row.unit,
            notes: row.notes,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    toDTO() {
        return {
            id: this.id,
            userId: this.userId,
            name: this.name,
            category: this.category,
            amount: this.amount,
            unit: this.unit,
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
