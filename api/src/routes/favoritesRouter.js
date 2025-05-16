import { Router } from "express";
import { FavoritesController } from "../controllers/favoritesController.js";
import { FavoritesRepository } from "../repositories/favoritesRepository.js";
import { FavoritesService } from "../services/favoritesService.js";

export const createFavoritesRouter = () => {
    const router = Router()

    const favoritesRepository = new FavoritesRepository()
    const favoritesService = new FavoritesService(favoritesRepository)
    const favoritesController = new FavoritesController(favoritesService)

    router.post('/:itineraryId', favoritesController.addFavorite.bind(favoritesController));
    router.delete('/:itineraryId', favoritesController.removeFavorite.bind(favoritesController));
    // router.get('/user/:userId', getUserFavorites);

    return router;
}