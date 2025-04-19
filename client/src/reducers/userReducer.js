import { getUserForAuth } from "../services/user";

export const userReducer = (state = [], action) => {
    if (action.type === "@user/init") {
        return {
            ...state,
            user: action.payload,
            isAuthenticated: !!action.payload,
            loading: false,
            error: action.error || null
        };
    }

    return state;
};


export const initUser = () => {
    return async (dispatch) => {
        try {
            const user = await getUserForAuth();
            dispatch({
                type: "@user/init",
                payload: user,
            });
        } catch (error) {
            dispatch({
                type: "@user/init",
                payload: null,
                error: null,
            });
        }
    }
}

export const clearError = () => {
    return async (dispatch) => {
        dispatch({
            type: "@user/clearError",
        });
    }
}