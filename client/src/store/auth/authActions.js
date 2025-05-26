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
            const newUser = await toast.promise(
                login(user),
                {
                    loading: "Logging in...",
                    success: "Welcome back!",
                    error: (err) => err.message || "Login failed",
                }
            );
            dispatch({ type: "@auth/login", payload: newUser });
            if (onSuccess) onSuccess();
        } catch (error) {
            dispatch({ type: "@auth/login", payload: null, error: error.message });
        }
    };
};

export const logoutUser = () => {
    return async (dispatch) => {
        try {
            await logout();
            dispatch({ type: "@auth/logout" });
            dispatch(resetUserInfo());

            toast.success("Session closed successfully");
        } catch (error) {
            toast.error("Failed to log out");
        }
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
