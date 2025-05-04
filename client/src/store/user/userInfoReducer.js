import { RESET_MY_INFO_ITINERARIES, RESET_MY_INFO_ME, SET_ERROR_MY_INFO_ITINERARIES, SET_ERROR_MY_INFO_ME, SET_MY_INFO_ITINERARIES, SET_MY_INFO_ME, START_LOADING_MY_INFO_ITINERARIES, START_LOADING_MY_INFO_ME } from "./userInfoActions";

const initialState = {
    me: {
        data: null,
        loading: false,
        error: null,
    },
    myItineraries: {
        data: [],
        loading: false,
        error: null,
    },
};

export const userInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_LOADING_MY_INFO_ME:
            return {
                ...state,
                me: {
                    ...state.me,
                    loading: true,
                    error: null,
                },
            };

        case SET_MY_INFO_ME:
            return {
                ...state,
                me: {
                    data: action.payload,
                    loading: false,
                    error: null,
                },
            };

        case SET_ERROR_MY_INFO_ME:
            return {
                ...state,
                me: {
                    data: null,
                    loading: false,
                    error: action.payload,
                },
            };

        case START_LOADING_MY_INFO_ITINERARIES:
            return {
                ...state,
                myItineraries: {
                    ...state.myItineraries,
                    loading: true,
                    error: null,
                },
            };

        case SET_MY_INFO_ITINERARIES:
            return {
                ...state,
                myItineraries: {
                    data: action.payload,
                    loading: false,
                    error: null,
                },
            };

        case SET_ERROR_MY_INFO_ITINERARIES:
            return {
                ...state,
                myItineraries: {
                    data: [],
                    loading: false,
                    error: action.payload,
                },
            };

        case RESET_MY_INFO_ME:
        case RESET_MY_INFO_ITINERARIES:
            return initialState;

        default:
            return state;
    }
};
