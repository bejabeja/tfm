
export class ItineraryController {
    constructor(itineraryService) {
        this.itineraryService = itineraryService;
    }
    async getItineraryById(req, res, next) {
        try {
            const { id } = req.params;
            const itinerary = await this.itineraryService.getItineraryById(id, req.user?.id);
            res.status(200).json(itinerary);
        } catch (error) {
            next(error);
        }
    }

    async createItinerary(req, res, next) {
        try {
            const file = req.files?.file?.[0];
            const images = req.files?.images || [];
            const itineraryData = JSON.parse(req.body.itinerary);
            const newItinerary = await this.itineraryService.createItinerary(itineraryData, file, images, req.user.id);
            res.status(201).json(newItinerary);
        } catch (error) {
            next(error);
        }
    }

    async cloneItinerary(req, res, next) {
        try {
            const { id } = req.params;
            const cloned = await this.itineraryService.cloneItinerary(id, req.user.id);
            res.status(201).json(cloned);
        } catch (error) {
            next(error);
        }
    }

    async deleteItinerary(req, res, next) {
        try {
            const { id } = req.params;
            await this.itineraryService.deleteItinerary(id, req.user.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async updateItinerary(req, res, next) {
        try {
            const { id } = req.params;
            const file = req.files?.file?.[0];
            const images = req.files?.images || [];
            const itineraryData = JSON.parse(req.body.itinerary);
            await this.itineraryService.updateItinerary(id, itineraryData, file, images, req.user.id);
            res.status(200).json({ message: "Itinerary updated successfully" });

        } catch (error) {
            next(error);
        }
    }

    async generateSmartItinerary(req, res, next) {
        try {
            const { destination, days, category, numberOfTravellers, budget, currency, intention, language, pace } = req.body;
            const itinerary = await this.itineraryService.generateSmartItinerary(destination, days, {
                category, numberOfTravellers, budget, currency, intention, language, pace,
            });
            res.status(200).json(itinerary)
        } catch (error) {
            next(error)
        }
    }
}