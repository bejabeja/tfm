import { toast } from "react-hot-toast";
import { createNewUser, login, logout } from "../../services/auth";
import { getUserForAuth } from "../../services/users";
import { resetUserInfo } from "../user/userInfoActions";

export const createUser = (user, onSuccess) => {
    return async (dispatch) => {
        try {
            await toast.promise(
                createNewUser(user),
                {
                    loading: "Creating account...",
                    success: "Account created successfully!",
                    error: (err) => err.message || "Registration failed",
                }
            );
            const newUser = await login(user);
            dispatch({ type: "@auth/login", payload: newUser });
            if (onSuccess) onSuccess();
        } catch (error) {
            dispatch({ type: "@auth/create-user", error: error.message });
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
        }
    };
};

export const logoutUser = () => {
    return async (dispatch) => {
        await logout();
        dispatch({ type: "@auth/logout" });
        dispatch(resetUserInfo());
    };
};

export const initAuthUser = () => {
    return async (dispatch) => {
        try {
            const user = await getUserForAuth();
            dispatch({ type: "@auth/init", payload: user });
        } catch (error) {
            dispatch({ type: "@auth/init", payload: null, error: null });
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
