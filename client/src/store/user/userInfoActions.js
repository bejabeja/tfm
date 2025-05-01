import { getUserById } from "../../services/user";

export const initUserInfo = (userId) => {
    return async (dispatch) => {
        dispatch({ type: "@user/loading" });

        try {
            const userInfo = await getUserById(userId);
            dispatch({ type: "@user/init", payload: userInfo });
        } catch (error) {
            dispatch({
                type: "@user/error",
                payload: error.message || "Failed to load user data",
            });
        }
    };
};

export const resetUserInfo = () => {
    return { type: "@user/reset" };
};
