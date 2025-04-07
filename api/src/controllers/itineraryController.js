
export class ItineraryController {
    constructor(itineraryModel) {
        this.itineraryModel = itineraryModel;
    }
    async getAll(req, res) {
        try {
            const itineraries = await this.itineraryModel.getAll();
            res.json(itineraries);
        } catch (error) {
            console.error("Error fetching itineraries:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}