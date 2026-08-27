import { Router } from "express";
import { VanLogController } from "../controllers/vanLogController.js";
import { VanLogRepository } from "../repositories/vanLogRepository.js";
import { VanLogService } from "../services/vanLogService.js";

export const createVanLogsRouter = () => {
    const router = Router();

    const vanLogRepository = new VanLogRepository();
    const vanLogService = new VanLogService(vanLogRepository);
    const vanLogController = new VanLogController(vanLogService);

    router.get('/stats', vanLogController.getStats.bind(vanLogController));
    router.get('/', vanLogController.getMyEntries.bind(vanLogController));
    router.post('/', vanLogController.createEntry.bind(vanLogController));
    router.patch('/:id', vanLogController.updateEntry.bind(vanLogController));
    router.delete('/:id', vanLogController.deleteEntry.bind(vanLogController));

    return router;
};
