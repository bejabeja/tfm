import { Router } from "express";
import { ItinerariesController } from "../controllers/itinerariesController.js";
import { PlacesRepository } from "../repositories/PlacesRepository.js";
import { ItineraryRepository } from "../repositories/itinerariesRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { ItinerariesService } from "../services/itinerariesService.js";

export const createItineraryRouter = () => {
    const itinerariesRouter = Router();

    const itinerariesRepository = new ItineraryRepository();
    const placesRepository = new PlacesRepository();
    const userRepository = new UserRepository()
    const itinerariesService = new ItinerariesService(itinerariesRepository, placesRepository, userRepository);
    const itinerariesController = new ItinerariesController(itinerariesService)

    itinerariesRouter.get("/featured", itinerariesController.featuredItineraries.bind(itinerariesController));
    itinerariesRouter.patch("/edit/:id", itinerariesController.updateItinerary.bind(itinerariesController));
    itinerariesRouter.delete("/:id", itinerariesController.deleteItinerary.bind(itinerariesController));
    itinerariesRouter.get("/:id", itinerariesController.getItineraryById.bind(itinerariesController));
    itinerariesRouter.post("/", itinerariesController.createItinerary.bind(itinerariesController));

    return itinerariesRouter;
}