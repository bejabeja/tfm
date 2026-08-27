export class PackingChecklistItem {
    constructor({ id, userId, category, name, checked, createdAt, updatedAt }) {
        this.id = id;
        this.userId = userId;
        this.category = category;
        this.name = name;
        this.checked = checked;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromDb(row) {
        return new PackingChecklistItem({
            id: row.id,
            userId: row.user_id,
            category: row.category,
            name: row.name,
            checked: row.checked,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    toDTO() {
        return {
            id: this.id,
            userId: this.userId,
            category: this.category,
            name: this.name,
            checked: this.checked,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
