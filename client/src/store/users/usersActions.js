import { getAllUsers, getfeaturedUsers } from "../../services/users";

export const initAllUsers = () => async (dispatch) => {
    dispatch({ type: "@users/all/start" });
    try {
        const users = await getAllUsers();
        dispatch({ type: "@users/all/success", payload: users });
    } catch (err) {
        dispatch({ type: "@users/all/fail", payload: err.message });
    }
};

export const initFeaturedUsers = () => async (dispatch) => {
    dispatch({ type: "@users/featured/start" });
    try {
        const users = await getfeaturedUsers();
        dispatch({ type: "@users/featured/success", payload: users });
    } catch (err) {
        dispatch({ type: "@users/featured/fail", payload: err.message });
    }
};
