import { Router } from "express";
import { AuditLogController } from "../controllers/auditLogController.js";
import { auditLogService } from "../services/sharedAuditLogService.js";
import { authenticate } from "../middlewares/authenticate.js";
import { requireCronSecret } from "../middlewares/requireCronSecret.js";
import { requireRole } from "../middlewares/requireRole.js";
import { ROLES, STAFF_ROLES } from "../utils/roles.js";

export const createAuditLogRouter = () => {
    const router = Router();

    const auditLogController = new AuditLogController(auditLogService);

    const staffOnly = requireRole(...STAFF_ROLES);
    // Purging is more destructive than reading, so it requires the stronger
    // role: any admin can look at the trail, only a superadmin can shorten it.
    const superadminOnly = requireRole(ROLES.SUPERADMIN);

    router.get("/", authenticate, staffOnly, auditLogController.getFiltered.bind(auditLogController));
    router.delete("/", authenticate, superadminOnly, auditLogController.purge.bind(auditLogController));
    // Vercel Cron calls this on the schedule defined in vercel.json with
    // `Authorization: Bearer $CRON_SECRET`, not a user session.
    router.get("/scheduled-purge", requireCronSecret, auditLogController.purgeScheduled.bind(auditLogController));

    return router;
};
