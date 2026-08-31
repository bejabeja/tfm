export class AuditLogService {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    async getRecent(limit) {
        return this.auditLogRepository.findRecent(limit);
    }
}
