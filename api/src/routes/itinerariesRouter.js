import { Router } from "express";
import { ItinerariesController } from "../controllers/itinerariesController.js";
import { ItineraryRepository } from "../repositories/itineraryRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { ItinerariesService } from "../services/itinerariesService.js";

export const createItinerariesRouter = () => {
    const itinerariesRouter = Router();

    const itinerariesRepository = new ItineraryRepository();
    const userRepository = new UserRepository();
    const itinerariesService = new ItinerariesService(itinerariesRepository, userRepository);
    const itinerariesController = new ItinerariesController(itinerariesService)

    itinerariesRouter.get("/", itinerariesController.filterItinerariesBy.bind(itinerariesController));
    itinerariesRouter.get("/featured", itinerariesController.featuredItineraries.bind(itinerariesController));

    return itinerariesRouter;
}