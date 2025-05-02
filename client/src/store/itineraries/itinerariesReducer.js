import {
    SET_EXPLORE_ITINERARIES,
    SET_EXPLORE_ITINERARIES_ERROR,
    SET_EXPLORE_PAGINATION,
    SET_FEATURED_ITINERARIES,
    SET_FEATURED_ITINERARIES_ERROR,
    START_LOADING_EXPLORE_ITINERARIES,
    START_LOADING_FEATURED_ITINERARIES
} from './itinerariesActions';

const initialState = {
    featuredItineraries: {
        data: [],
        loading: false,
        error: null,
    },
    exploreItineraries: {
        data: [],
        loading: false,
        error: null,
        page: 1,
        totalPages: 1,
        totalItems: 0,
    },
};

export const itinerariesReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_LOADING_FEATURED_ITINERARIES:
            return { ...state, featuredItineraries: { ...state.featuredItineraries, loading: true } };

        case SET_FEATURED_ITINERARIES:
            return {
                ...state,
                featuredItineraries: {
                    data: action.payload,
                    loading: false,
                    error: null,
                }
            };

        case SET_FEATURED_ITINERARIES_ERROR:
            return {
                ...state,
                featuredItineraries: {
                    ...state.featuredItineraries,
                    error: action.payload,
                    loading: false
                }
            };

        case START_LOADING_EXPLORE_ITINERARIES:
            return { ...state, exploreItineraries: { ...state.exploreItineraries, loading: true } };

        case SET_EXPLORE_ITINERARIES:
            return {
                ...state,
                exploreItineraries: {
                    data: action.payload.itineraries,
                    loading: false,
                    error: null,
                    page: action.payload.page,
                    totalPages: action.payload.totalPages,
                    totalItems: action.payload.totalItems,
                }
            };

        case SET_EXPLORE_ITINERARIES_ERROR:
            return {
                ...state,
                exploreItineraries: {
                    ...state.exploreItineraries,
                    error: action.payload,
                    loading: false,
                }
            };

        case SET_EXPLORE_PAGINATION:
            return {
                ...state,
                exploreItineraries: {
                    ...state.exploreItineraries,
                    page: action.payload.page,
                }
            };

        default:
            return state;
    }
};
