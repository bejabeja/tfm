import { createNewUser, login, logout } from "../services/auth";
import { getUser } from "../services/user";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
};

export const authReducer = (state = initialState, action) => {
    if (action.type === "@auth/init") {
        return {
            ...state,
            user: action.payload,
            isAuthenticated: !!action.payload,
            loading: false,
            error: action.error || null
        };
    }
    if (action.type === "@auth/login") {
        return {
            ...state,
            user: action.payload,
            isAuthenticated: !!action.payload,
            loading: false,
            error: action.error || null
        };
    }
    if (action.type === "@auth/create-user") {
        return {
            ...state,
            error: action.error || null,
        };
    }
    if (action.type === "@auth/logout") {
        return {
            ...state,
            user: null,
            isAuthenticated: false,
            loading: false
        }
    };

    if (action.type === "@auth/clearError") {
        return {
            ...state,
            error: null,
        }
    }

    return state;
};

export const createUser = (user, onSuccess) => {
    return async (dispatch) => {
        try {
            await createNewUser(user);
            dispatch({
                type: "@auth/create-user",
                success: true
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            dispatch({
                type: "@auth/create-user",
                error: error.message,
            });
        }
    }
};

export const loginUser = (user, onSuccess) => {
    return async (dispatch) => {
        try {
            const newUser = await login(user);
            dispatch({
                type: "@auth/login",
                payload: newUser,
            });
            if (onSuccess) onSuccess();

        } catch (error) {
            dispatch({
                type: "@auth/login",
                payload: null,
                error: error.message,
            });
        }
    }
};

export const logoutUser = () => {
    return async (dispatch) => {
        await logout();
        dispatch({
            type: "@auth/logout",
        });
    }
}

export const initUser = () => {
    return async (dispatch) => {
        try {
            const user = await getUser();
            dispatch({
                type: "@auth/init",
                payload: user,
            });
        } catch (error) {
            dispatch({
                type: "@auth/init",
                payload: null,
                error: null,
            });
        }
    }
}

export const clearError = () => {
    return async (dispatch) => {
        dispatch({
            type: "@auth/clearError",
        });
    }
}