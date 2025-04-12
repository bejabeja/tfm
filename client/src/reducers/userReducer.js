import { createNewUser, login, logout } from "../services/user";

const initialState = {
    currentUser: null,
    isAuthenticated: false
}

export const userReducer = (state = initialState, action) => {
    if (action.type === "@user/login") {
        return {
            ...state,
            currentUser: action.payload,
            isAuthenticated: true
        };
    }
    if (action.type === "@user/logout") {
        return {
            ...state,
            currentUser: null,
            isAuthenticated: false
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