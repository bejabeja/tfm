import { Router } from "express";
import { PackingChecklistController } from "../controllers/packingChecklistController.js";
import { PackingChecklistRepository } from "../repositories/packingChecklistRepository.js";
import { PackingChecklistService } from "../services/packingChecklistService.js";

export const createPackingChecklistRouter = () => {
    const router = Router();

    const packingChecklistRepository = new PackingChecklistRepository();
    const packingChecklistService = new PackingChecklistService(packingChecklistRepository);
    const packingChecklistController = new PackingChecklistController(packingChecklistService);

    router.get('/', packingChecklistController.getChecklist.bind(packingChecklistController));
    router.post('/', packingChecklistController.addItem.bind(packingChecklistController));
    router.post('/seed', packingChecklistController.seedDefaults.bind(packingChecklistController));
    router.post('/reset', packingChecklistController.resetTrip.bind(packingChecklistController));
    router.patch('/:id', packingChecklistController.updateItem.bind(packingChecklistController));
    router.delete('/:id', packingChecklistController.deleteItem.bind(packingChecklistController));

    return router;
};
