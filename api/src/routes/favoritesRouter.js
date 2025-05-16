import { Router } from "express";
import { FavoritesController } from "../controllers/favoritesController.js";
import { FavoritesRepository } from "../repositories/favoritesRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { FavoritesService } from "../services/favoritesService.js";

export const createFavoritesRouter = () => {
    const router = Router()

    const favoritesRepository = new FavoritesRepository()
    const userRepository = new UserRepository()
    const favoritesService = new FavoritesService(favoritesRepository, userRepository)
    const favoritesController = new FavoritesController(favoritesService)

    router.get('/user', favoritesController.getUserFavorites.bind(favoritesController));

    router.post('/:itineraryId', favoritesController.addFavorite.bind(favoritesController));
    router.delete('/:itineraryId', favoritesController.removeFavorite.bind(favoritesController));
    router.get('/:itineraryId', favoritesController.isFavorite.bind(favoritesController));


    return router;
}