
export class ItinerariesController {
    constructor(itinerariesService) {
        this.itinerariesService = itinerariesService;
    }
    async getItinerariesByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const itineraries = await this.itinerariesService.getItinerariesByUserId(userId);
            res.status(200).json(itineraries);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching itineraries.' });
        }
    }
}