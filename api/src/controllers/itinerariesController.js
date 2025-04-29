
export class ItinerariesController {
    constructor(itinerariesService) {
        this.itinerariesService = itinerariesService;
    }
    async getItineraryById(req, res, next) {
        try {
            const { id } = req.params;
            const itinerary = await this.itinerariesService.getItineraryById(id);
            res.status(200).json(itinerary);
        } catch (error) {
            next(error);
        }
    }

    async createItinerary(req, res, next) {
        try {
            const itineraryData = req.body;
            const newItinerary = await this.itinerariesService.createItinerary(itineraryData);
            res.status(201).json(newItinerary);
        } catch (error) {
            next(error);
        }
    }

    async deleteItinerary(req, res, next) {
        try {
            const { id } = req.params;
            await this.itinerariesService.deleteItinerary(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async updateItinerary(req, res, next) {
        try {
            const { id } = req.params;
            await this.itinerariesService.updateItinerary(id, req.body);
            res.status(200).json({ message: "Itinerary updated successfully" });

        } catch (error) {
            next(error);
        }
    }
}