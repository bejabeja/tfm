
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
}