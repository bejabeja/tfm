import { createNewUser, getUser, login, logout } from "../services/user";

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
    if (action.type === "@user/login") {
        return {
            ...state,
            user: action.payload,
            isAuthenticated: !!action.payload,
            loading: false,
            error: action.error || null
        };
    }
    if (action.type === "@user/created") {
        return {
            ...state,
            error: action.error || null,
        };
    }
    if (action.type === "@user/logout") {
        return {
            ...state,
            user: null,
            isAuthenticated: false,
            loading: false
        }
    };

    return state;
};

export const createUser = (user, onSuccess) => {
    return async (dispatch) => {
        try {
            await createNewUser(user);
            dispatch({
                type: "@user/created",
                success: true
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            dispatch({
                type: "@user/created",
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
                type: "@user/login",
                payload: newUser,
            });
            if (onSuccess) onSuccess();

        } catch (error) {
            dispatch({
                type: "@user/login",
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
            type: "@user/logout",
        });
    }
}

export const initUser = () => {
    return async (dispatch) => {
        const user = await getUser()
        dispatch({
            type: "@user/init",
            payload: user
        })
    }
}