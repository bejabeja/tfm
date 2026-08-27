import { AuthError } from '../errors/AuthError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export class VanLogService {
    constructor(vanLogRepository) {
        this.vanLogRepository = vanLogRepository;
    }

    async createEntry(data, userId) {
        const entry = await this.vanLogRepository.create({ ...data, userId });
        return entry.toDTO();
    }

    async getEntriesByUser(userId) {
        const entries = await this.vanLogRepository.findByUserId(userId);
        return entries.map(entry => entry.toDTO());
    }

    async updateEntry(id, data, userId) {
        const entry = await this._getOwnedEntry(id, userId);
        const updated = await this.vanLogRepository.update(entry.id, data);
        return updated.toDTO();
    }

    async deleteEntry(id, userId) {
        await this._getOwnedEntry(id, userId);
        await this.vanLogRepository.delete(id);
    }

    async getStats(userId) {
        const totals = await this.vanLogRepository.getTotalsByCategory(userId);
        const totalAmount = totals.reduce((sum, entry) => sum + entry.total, 0);
        return { totalAmount, byCategory: totals };
    }

    async _getOwnedEntry(id, userId) {
        const entry = await this.vanLogRepository.findById(id);
        if (!entry) {
            throw new NotFoundError("Van log entry not found");
        }
        if (entry.userId !== userId) {
            throw new AuthError();
        }
        return entry;
    }
}
