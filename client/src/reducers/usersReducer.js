import { getfeaturedUsers } from "../services/users.js";
export const usersReducer = (state = [], action) => {
    if (action.type === "@users/init") {
        return {
            ...state,
            featured: action.payload,
        };
    }

    return state;
};


export const initUsers = () => {
    return async (dispatch) => {
        try {
            const featuredUsers = await getfeaturedUsers();
            dispatch({
                type: "@users/init",
                payload: featuredUsers,
            });
        } catch (error) {
            dispatch({
                type: "@users/init",
                payload: null,
            });
        }
    }
}

