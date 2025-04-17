import { getfeaturedUsers } from "../services/users.js";

const initialState = {
    featured: [],
    loading: false,
};

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@users/init/start":
            return { ...state, loading: true };
        case "@users/init/success":
            return { ...state, featured: action.payload, loading: false };
        case "@users/init/fail":
            return { ...state, featured: [], loading: false };
        default:
            return state;
    }
};


export const initUsers = () => {
    return async (dispatch) => {
        dispatch({ type: "@users/init/start" });
        try {
            const featuredUsers = await getfeaturedUsers();
            dispatch({
                type: "@users/init/success",
                payload: featuredUsers,

            });
        } catch (error) {
            dispatch({
                type: "@users/init/fail",
            });
        }
    }
}

