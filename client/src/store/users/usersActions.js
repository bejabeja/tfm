import { getAllUsers, getfeaturedUsers } from "../../services/users";

export const initAllUsers = (filters) => async (dispatch) => {
    dispatch({ type: "@users/all/start" });
    try {
        const response = await getAllUsers(filters);
        const { users, totalPages, currentPage } = response;
        dispatch({
            type: "@users/all/success", payload: { users, totalPages, currentPage }
        });
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

export const loadMoreUsers = (page, searchName = '') => async (dispatch) => {
    dispatch({ type: "@users/all/loadMoreStart" });
    try {
        const result = await getAllUsers({ page, searchName });
        dispatch({
            type: "@users/all/loadMoreSuccess",
            payload: {
                users: result.users,
                totalPages: result.totalPages,
                currentPage: result.currentPage,
            },
        });
    } catch (error) {
        dispatch({ type: "@users/all/loadMoreFail" });
    }
};
