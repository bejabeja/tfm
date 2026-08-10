export class NotificationsService {
    constructor(notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }

    async createNotification({ userId, actorId, type, itineraryId, commentId }) {
        if (userId === actorId) return;
        await this.notificationsRepository.create({ userId, actorId, type, itineraryId, commentId });
    }

    async getNotifications(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const [notifications, totalCount] = await Promise.all([
            this.notificationsRepository.getByUserId(userId, limit, offset),
            this.notificationsRepository.getTotalCount(userId),
        ]);
        return {
            notifications,
            currentPage: page,
            totalCount,
            totalPages: Math.max(1, Math.ceil(totalCount / limit)),
        };
    }

    async markAllAsRead(userId) {
        await this.notificationsRepository.markAllAsRead(userId);
    }

    async getUnreadCount(userId) {
        return this.notificationsRepository.getUnreadCount(userId);
    }
}
