import { getUserById } from "../services/user";

const initialState = {
    user: null,
    myItineraries: [],
    loading: true,
};

export const userLoggedReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@user/init":
            return {
                ...state,
                user: action.payload,
                myItineraries: action.payload?.itineraries || [],
                loading: false,
            };


        case "@user/loading":
            return {
                ...state,
                loading: true,
            };

        default:
            return state;
    }
};

export const initUserLoggedInfo = (userId) => {
    return async (dispatch) => {
        dispatch({ type: "@user/loading" });

        try {
            const user = await getUserById(userId);
            dispatch({
                type: "@user/init",
                payload: user,
            });
        } catch (error) {
            dispatch({
                type: "@user/init",
                payload: null,
                error: error.message || "Failed to load user data",
            });
        }
    };
};


export default userLoggedReducer;
