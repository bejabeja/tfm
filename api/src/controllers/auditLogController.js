export class AuditLogController {
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }

    async getRecent(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const entries = await this.auditLogService.getRecent(limit);
            res.status(200).json(entries);
        } catch (error) {
            next(error);
        }
    }
}
