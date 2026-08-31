import { Router } from "express";
import { AuditLogController } from "../controllers/auditLogController.js";
import { AuditLogRepository } from "../repositories/auditLogRepository.js";
import { AuditLogService } from "../services/auditLogService.js";

export const createAuditLogRouter = () => {
    const router = Router();

    const auditLogRepository = new AuditLogRepository();
    const auditLogService = new AuditLogService(auditLogRepository);
    const auditLogController = new AuditLogController(auditLogService);

    router.get("/", auditLogController.getRecent.bind(auditLogController));

    return router;
};
