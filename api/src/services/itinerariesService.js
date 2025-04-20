export class ItinerariesService {
    constructor(itinerariesRepository) {
        this.itinerariesRepository = itinerariesRepository;
    }

    async getItinerariesByUserId(userId) {
        try {
            const itineraries = await this.itinerariesRepository.getItinerariesByUserId(userId);
            console.log(itineraries);
            return itineraries;
        } catch (error) {
            throw new Error('Error fetching itineraries: ' + error.message);
        }
    }
}