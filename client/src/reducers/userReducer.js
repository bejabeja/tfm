import { createNewUser, getUser, login, logout } from "../services/user";

export const userReducer = (state = [], action) => {
    if (action.type === "@user/init") {
        return {
            ...state,
            user: action.payload,
            isAuthenticated: !!action.payload,
            loading: false
        };
    }
    if (action.type === "@user/login") {
        return {
            ...state,
            user: action.payload,
            isAuthenticated: true,
            loading: false
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

export const createUser = (user) => {
    return async (dispatch) => {
        await createNewUser(user);
        dispatch({
            type: "@user/created",
        });
    }
};

export const loginUser = (user) => {
    return async (dispatch) => {
        const newUser = await login(user);
        dispatch({
            type: "@user/login",
            payload: newUser
        });
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