import { getItinerariesByUserId } from "../../services/itineraries";
import { getUserById } from "../../services/user";

export const START_LOADING_MY_INFO_ME = "@myInfo/me/loading";
export const SET_MY_INFO_ME = "@myInfo/me/init";
export const SET_ERROR_MY_INFO_ME = "@myInfo/me/error";
export const RESET_MY_INFO_ME = "@myInfo/me/reset";

export const START_LOADING_MY_INFO_ITINERARIES = "@myInfo/itineraries/loading";
export const SET_MY_INFO_ITINERARIES = "@myInfo/itineraries/init";
export const SET_ERROR_MY_INFO_ITINERARIES = "@myInfo/itineraries/error";
export const RESET_MY_INFO_ITINERARIES = "@myInfo/itineraries/reset";

export const setUserInfo = (userId) => {
    return async (dispatch) => {
        dispatch({ type: START_LOADING_MY_INFO_ME });

        try {
            const userInfo = await getUserById(userId);
            dispatch({ type: SET_MY_INFO_ME, payload: userInfo });
        } catch (error) {
            dispatch({
                type: SET_ERROR_MY_INFO_ME,
                payload: error.message || "Failed to load user data",
            });
        }
    };
};

export const setUserInfoItineraries = (userId) => {
    return async (dispatch) => {
        dispatch({ type: START_LOADING_MY_INFO_ITINERARIES });

        try {
            const myItineraries = await getItinerariesByUserId(userId);
            dispatch({ type: SET_MY_INFO_ITINERARIES, payload: myItineraries });
        } catch (error) {
            dispatch({
                type: SET_ERROR_MY_INFO_ITINERARIES,
                payload: error.message || "Failed to load user data",
            });
        }
    };
};


export const loadUserDataAndItineraries = (userId) => {
    return (dispatch) => {
        dispatch(resetUserInfo());

        dispatch(setUserInfo(userId));
        dispatch(setUserInfoItineraries(userId));
    };
};

export const resetUserInfo = () => {
    return (dispatch) => {
        dispatch({ type: RESET_MY_INFO_ME });
        dispatch({ type: RESET_MY_INFO_ITINERARIES });
    };
};

