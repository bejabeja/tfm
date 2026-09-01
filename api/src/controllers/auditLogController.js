import { ValidationError } from "../errors/ValidationError.js";
import { getRequestContext } from "../utils/requestContext.js";

const DEFAULT_RETENTION_MONTHS = 12;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export class AuditLogController {
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }

    async getFiltered(req, res, next) {
        const { actorId, action, targetUserId, dateFrom, dateTo, page } = req.query;
        if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            return next(new ValidationError("page must be a positive integer"));
        }
        try {
            const requestedLimit = parseInt(req.query.limit) || DEFAULT_LIMIT;
            const limit = Math.min(requestedLimit, MAX_LIMIT);
            const offset = page ? (Number(page) - 1) * limit : 0;

            const { entries, total } = await this.auditLogService.getFiltered({
                actorId, action, targetUserId, dateFrom, dateTo, limit, offset,
            });
            res.status(200).json({ entries, total, limit, offset });
        } catch (error) {
            next(error);
        }
    }

    // Superadmin-only, manually triggered ad hoc purge (see requireRole in
    // auditLogRouter.js). Distinct from purgeScheduled below, which enforces
    // the retention window automatically.
    async purge(req, res, next) {
        const months = req.query.months !== undefined ? parseInt(req.query.months) : DEFAULT_RETENTION_MONTHS;
        if (!Number.isInteger(months) || months < 1) {
            return next(new ValidationError("months must be a positive integer"));
        }
        try {
            const { ip, userAgent } = getRequestContext(req);
            const deletedCount = await this.auditLogService.purgeOlderThan(months, {
                actorId: req.user.id, actorUsername: req.user.username, ip, userAgent, trigger: 'manual',
            });
            res.status(200).json({ deletedCount });
        } catch (error) {
            next(error);
        }
    }

    // Hit by Vercel Cron (see vercel.json), authenticated via requireCronSecret
    // instead of a user session, so the retention window enforces itself.
    async purgeScheduled(req, res, next) {
        try {
            const deletedCount = await this.auditLogService.purgeOlderThan(DEFAULT_RETENTION_MONTHS, {
                actorUsername: 'system-cron', trigger: 'scheduled',
            });
            res.status(200).json({ deletedCount });
        } catch (error) {
            next(error);
        }
    }
}
