import { getfeaturedUsers } from "../../services/users";

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
            dispatch({ type: "@users/init/fail" });
        }
    };
};
