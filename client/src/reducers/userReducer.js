import { createNewUser, login } from "../services/user";

export const userReducer = (state = [], action) => {
     if (action.type === "@user/login") {
        return [...state, action.payload];
    }

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