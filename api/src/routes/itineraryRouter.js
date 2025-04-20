import { Router } from "express";
import { ItinerariesController } from "../controllers/itinerariesController.js";
import { ItineraryRepository } from "../repositories/itinerariesRepository.js";
import { ItinerariesService } from "../services/itinerariesService.js";

export const createItineraryRouter = () => {
    const itinerariesRouter = Router();

    const itinerariesRepository = new ItineraryRepository();
    const itinerariesService = new ItinerariesService(itinerariesRepository);
    const itinerariesController = new ItinerariesController(itinerariesService)

    itinerariesRouter.get("/:userId", itinerariesController.getItinerariesByUserId.bind(itinerariesController));

    return itinerariesRouter;
}