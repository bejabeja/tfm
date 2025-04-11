import { createNewUser, login } from "../services/user";

export const userReducer = (state = [], action) => {
    if (action.type === "@user/created") {
        console.log('STATE', state)
        console.log('ACTION', action)
        return [...state, action.payload];
    }

    if (action.type === "@user/login") {
        console.log('STATE', state)
        console.log('ACTION', action)
        return [...state, action.payload];
    }

    return state;
};

export const createUser = (user) => {
    return async (dispatch) => {
        const newUser = await createNewUser(user);
        dispatch({
            type: "@user/created",
            payload: newUser
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