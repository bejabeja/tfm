
export class ItinerariesController {
    constructor(itinerariesService) {
        this.itinerariesService = itinerariesService;
    }
    async getItinerariesByUserId(req, res, next) {
        try {
            const userId = req.params.userId;
            const itineraries = await this.itinerariesService.getItinerariesByUserId(userId);
            res.status(200).json(itineraries);
        } catch (error) {
            next(error);
        }
    }
}