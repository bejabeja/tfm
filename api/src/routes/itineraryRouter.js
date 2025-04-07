import { Router } from "express";
import { ItineraryController } from "../controllers/itineraryController.js";

export const createItineraryRouter = (itineraryModel) => {
    const itinerariesRouter = Router();
    const itineraryController = new ItineraryController(itineraryModel)

    itinerariesRouter.get("/", itineraryController.getAll.bind(itineraryController));

    return itinerariesRouter;
}