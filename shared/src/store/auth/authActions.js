import { createNewUser, login, logout } from "../../services/auth";
import { getUserForAuth } from "../../services/users";
import { resetUserInfo } from "../user/userInfoActions";

export const registerUser = (user, onSuccess) => {
    return async (dispatch) => {
        try {
            await createNewUser(user);
            const newUser = await login(user);
            dispatch({ type: "@auth/login", payload: newUser });
            if (onSuccess) onSuccess();
        } catch (error) {
            dispatch({ type: "@auth/create-user", error: error.message });
            throw error;
        }
    };
};

export const loginUser = (user, onSuccess) => {
    return async (dispatch) => {
        try {
            const newUser = await login(user);
            dispatch({ type: "@auth/login", payload: newUser });
            if (onSuccess) onSuccess();
        } catch (error) {
            dispatch({ type: "@auth/login", payload: null, error: error.message });
            throw error;
        }
    };
};

export const logoutUser = () => {
    return async (dispatch) => {
        try {
            await logout();
            dispatch({ type: "@auth/logout" });
            dispatch(resetUserInfo());
        } catch {
            // best-effort: nothing else to do if the server-side logout call fails.
        }
    };
};

export const initAuthUser = () => {
    return async (dispatch) => {
        try {
            const user = await getUserForAuth();
            dispatch({ type: "@auth/init", payload: user });
        } catch {
            dispatch({ type: "@auth/init", payload: null });
            dispatch(resetUserInfo());
        }
    };
};

export const clearError = () => {
    return { type: "@auth/clearError" };
};

export const setImageHeroLoaded = () => {
    return { type: "@auth/setImageHeroLoaded" };
};

export const setImageAuthLoaded = () => {
    return { type: "@auth/setImageAuthLoaded" };
};
