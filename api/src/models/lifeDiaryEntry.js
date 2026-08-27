import { toDateOnlyString } from './vanLogEntry.js';

export class LifeDiaryEntry {
    constructor({
        id, userId, location, entryDate, bestMoment, lessonLearned,
        memories, peopleMet, wouldReturn, images = [], createdAt, updatedAt,
    }) {
        this.id = id;
        this.userId = userId;
        this.location = location || null;
        this.entryDate = entryDate;
        this.bestMoment = bestMoment;
        this.lessonLearned = lessonLearned;
        this.memories = memories;
        this.peopleMet = peopleMet;
        this.wouldReturn = wouldReturn;
        this.images = images;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    addImage(image) {
        this.images.push(image);
    }

    static fromDb(row) {
        const hasLocation = row.location_name || row.location_label;
        return new LifeDiaryEntry({
            id: row.id,
            userId: row.user_id,
            location: hasLocation ? {
                name: row.location_name,
                country: row.location_country,
                label: row.location_label,
                lat: row.latitude,
                lon: row.longitude,
            } : null,
            entryDate: toDateOnlyString(row.entry_date),
            bestMoment: row.best_moment,
            lessonLearned: row.lesson_learned,
            memories: row.memories,
            peopleMet: row.people_met,
            wouldReturn: row.would_return,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    toDTO() {
        return {
            id: this.id,
            userId: this.userId,
            location: this.location,
            entryDate: this.entryDate,
            bestMoment: this.bestMoment,
            lessonLearned: this.lessonLearned,
            memories: this.memories,
            peopleMet: this.peopleMet,
            wouldReturn: this.wouldReturn,
            images: this.images,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
