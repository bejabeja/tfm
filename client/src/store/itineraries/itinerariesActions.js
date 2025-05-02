import { getfeaturedItineraries } from "../../services/itinerary";

export const initItineraries = () => {
    return async (dispatch) => {
        dispatch({ type: "@itineraries/init/start" });

        try {
            const featuredItineraries = await getfeaturedItineraries();
            dispatch({
                type: "@itineraries/init/success",
                payload: featuredItineraries,
            });
        } catch (error) {
            dispatch({ type: "@itineraries/init/fail" });
        }
    };
};
