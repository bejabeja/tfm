import { Router } from "express";
import { ItineraryController } from "../controllers/itineraryController.js";
import { PlacesRepository } from "../repositories/PlacesRepository.js";
import { ItineraryRepository } from "../repositories/itineraryRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { ItineraryService } from "../services/itineraryService.js";

export const createItineraryRouter = () => {
    const itinerariesRouter = Router();

    const itinerariesRepository = new ItineraryRepository();
    const placesRepository = new PlacesRepository();
    const userRepository = new UserRepository()
    const itinerariesService = new ItineraryService(itinerariesRepository, placesRepository, userRepository);
    const itinerariesController = new ItineraryController(itinerariesService)

    itinerariesRouter.get("/featured", itinerariesController.featuredItineraries.bind(itinerariesController));
    itinerariesRouter.post("/", itinerariesController.createItinerary.bind(itinerariesController));

    itinerariesRouter.patch("/edit/:id", itinerariesController.updateItinerary.bind(itinerariesController));
    itinerariesRouter.delete("/:id", itinerariesController.deleteItinerary.bind(itinerariesController));
    itinerariesRouter.get("/:id", itinerariesController.getItineraryById.bind(itinerariesController));

    return itinerariesRouter;
}