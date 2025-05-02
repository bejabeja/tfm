export class ItinerariesController {
    constructor(itinerariesService) {
        this.itinerariesService = itinerariesService;
    }

    async filterItinerariesBy(req, res, next) {
        try {
            const { category, destination, page = 1, limit = 10 } = req.query;
            const filters = {
                category,
                destination,
                page: parseInt(page),
                limit: parseInt(limit),
            };

            const {
                itineraries,
                totalPages,
                totalItems
            } = await this.itinerariesService.getFilteredItineraries(filters);

            res.status(200).json({
                itineraries,
                totalPages,
                totalItems,
                page: filters.page
            });
        } catch (error) {
            next(error);
        }
    }
}