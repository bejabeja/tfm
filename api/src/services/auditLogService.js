import * as Sentry from "@sentry/node";
import { logger } from "../utils/logger.js";
import { AUDIT_EVENTS } from "../utils/auditEvents.js";
import { ROLES } from "../utils/roles.js";

// A failed write must not spam every superadmin's inbox once per event during
// a sustained outage, so alerts are throttled to roughly one per cooldown
// window. Module-level (not per-instance) so it's shared by every caller
// within one Node process, via sharedAuditLogService.js. Best-effort only:
// on Vercel this API can run as several concurrent/cold-started serverless
// instances, each with its own copy of this state, so the true cross-instance
// rate during a sustained outage can be a small multiple of one per window,
// not a hard guarantee. Sentry.captureException above is what actually never
// gets throttled or lost.
const ALERT_COOLDOWN_MS = 15 * 60 * 1000;
let lastAlertedAt = 0;

export class AuditLogService {
    constructor(auditLogRepository, userRepository = null, emailService = null) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    async getFiltered(filters) {
        return this.auditLogRepository.findByFilters(filters);
    }

    // Fire-and-forget, like NotificationsService's use elsewhere: a write to
    // the audit trail must never fail the request that triggered it. Any
    // service can call this directly instead of rolling its own try/catch.
    log({ actorId = null, actorUsername = null, action, targetUserId = null, targetUsername = null, metadata = {}, ipAddress = null, userAgent = null }) {
        this.auditLogRepository.log({ actorId, actorUsername, action, targetUserId, targetUsername, metadata, ipAddress, userAgent })
            .catch(err => this._handleWriteFailure(action, err));
    }

    // Self-audits: purging the trail is itself an accountability-relevant
    // action (who shortened the retention window, and how many rows it hit),
    // so it must leave a record too instead of disappearing silently.
    async purgeOlderThan(months, { actorId = null, actorUsername = null, ip = null, userAgent = null, trigger = 'manual' } = {}) {
        const deletedCount = await this.auditLogRepository.deleteOlderThan(months);
        this.log({
            actorId, actorUsername,
            action: AUDIT_EVENTS.AUDIT_LOG_PURGED,
            metadata: { months, deletedCount, trigger },
            ipAddress: ip, userAgent,
        });
        return deletedCount;
    }

    // The audit trail is a GDPR accountability requirement (see CLAUDE.md), so
    // a broken write can't just sit in application logs: it's reported to
    // Sentry and, best-effort, emailed to every superadmin.
    async _handleWriteFailure(action, err) {
        logger.error(`[audit] failed to log ${action}:`, err);
        Sentry.captureException(err);
        await this._alertSuperadmins(action, err).catch(alertErr => {
            logger.error('[audit] failed to alert superadmins of a write failure:', alertErr);
        });
    }

    async _alertSuperadmins(action, err) {
        if (!this.userRepository || !this.emailService) return;

        const now = Date.now();
        if (now - lastAlertedAt < ALERT_COOLDOWN_MS) return;
        lastAlertedAt = now;

        const superadmins = await this.userRepository.findByRole(ROLES.SUPERADMIN);
        await Promise.all(superadmins.map(admin => this.emailService.sendAuditLogFailureAlert({
            to: admin.email, action, errorMessage: err.message, occurredAt: new Date().toISOString(),
        })));
    }
}
