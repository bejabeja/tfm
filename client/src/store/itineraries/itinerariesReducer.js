
const initialState = {
    featuredItineraries: [],
    loading: false,
};

export const itinerariesReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@itineraries/init/start":
            return { ...state, loading: true };
        case "@itineraries/init/success":
            return { ...state, featuredItineraries: action.payload, loading: false };
        case "@itineraries/init/fail":
            return { ...state, featuredItineraries: [], loading: false };
        default:
            return state;
    }
};
