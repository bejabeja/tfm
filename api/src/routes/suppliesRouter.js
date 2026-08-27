import { Router } from "express";
import { SuppliesController } from "../controllers/suppliesController.js";
import { InventoryRepository } from "../repositories/inventoryRepository.js";
import { ShoppingListRepository } from "../repositories/shoppingListRepository.js";
import { SuppliesService } from "../services/suppliesService.js";

export const createSuppliesRouter = () => {
    const router = Router();

    const inventoryRepository = new InventoryRepository();
    const shoppingListRepository = new ShoppingListRepository();
    const suppliesService = new SuppliesService(inventoryRepository, shoppingListRepository);
    const suppliesController = new SuppliesController(suppliesService);

    router.get('/shopping-list', suppliesController.getShoppingList.bind(suppliesController));
    router.post('/shopping-list', suppliesController.addShoppingListItem.bind(suppliesController));
    router.patch('/shopping-list/:id', suppliesController.updateShoppingListItem.bind(suppliesController));
    router.delete('/shopping-list/:id', suppliesController.deleteShoppingListItem.bind(suppliesController));
    router.post('/shopping-list/:id/purchase', suppliesController.markPurchased.bind(suppliesController));

    router.get('/inventory', suppliesController.getInventory.bind(suppliesController));
    router.patch('/inventory/:id', suppliesController.updateInventoryItem.bind(suppliesController));
    router.delete('/inventory/:id', suppliesController.deleteInventoryItem.bind(suppliesController));
    router.post('/inventory/:id/use-up', suppliesController.markUsedUp.bind(suppliesController));

    return router;
};
