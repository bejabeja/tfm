import { Router } from "express";
import { ItinerariesController } from "../controllers/itinerariesController.js";
import { PlacesRepository } from "../repositories/PlacesRepository.js";
import { ItineraryRepository } from "../repositories/itineraryRepository.js";
import { ItinerariesService } from "../services/itinerariesService.js";

export const createItinerariesRouter = () => {
    const itinerariesRouter = Router();

    const itinerariesRepository = new ItineraryRepository();
    const placesRepository = new PlacesRepository();
    const itinerariesService = new ItinerariesService(itinerariesRepository, placesRepository);
    const itinerariesController = new ItinerariesController(itinerariesService)

    itinerariesRouter.get("/", itinerariesController.filterItinerariesBy.bind(itinerariesController));

    return itinerariesRouter;
}