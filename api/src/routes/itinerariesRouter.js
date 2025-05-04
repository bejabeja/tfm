import { Router } from "express";
import { ItinerariesController } from "../controllers/itinerariesController.js";
import { ItineraryRepository } from "../repositories/itineraryRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { ItinerariesService } from "../services/itinerariesService.js";

export const createItinerariesRouter = () => {
    const router = Router();

    const itinerariesRepository = new ItineraryRepository();
    const userRepository = new UserRepository();
    const itinerariesService = new ItinerariesService(itinerariesRepository, userRepository);
    const itinerariesController = new ItinerariesController(itinerariesService)

    router.get("/", itinerariesController.filterItinerariesBy.bind(itinerariesController));
    router.get("/featured", itinerariesController.featuredItineraries.bind(itinerariesController));

    // router.get("/:id/comments", commentsController.list);
    // router.post("/:id/comments", authenticate, commentsController.create);
    // router.post("/:id/like", authenticate, itinerariesController.likeItinerary);
    // router.delete("/:id/like", authenticate, itinerariesController.unlikeItinerary);


    return router;
}