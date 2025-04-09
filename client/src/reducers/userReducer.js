import { createNewUser } from "../services/user";

export const userReducer = (state = [], action) => {
    if (action.type === "@user/created") {
        console.log('STATE', state)
        return [...state, action.payload];
    }

    return state;
};

export const createUser = (user) => {
    return async (dispatch) => {
        const newUser = await createNewUser(user);
        dispatch({
            type: "@notes/created",
            payload: newUser
        });
    }
};