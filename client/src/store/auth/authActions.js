import { toast } from "react-hot-toast";
import { translateAuthError } from "@tobeatraveller/shared";
import i18n from "../../i18n";
import { createNewUser, login, logout } from "../../services/auth";
import { getUserForAuth } from "../../services/users";
import { resetAnalytics } from "../../utils/analytics";
import { resetUserInfo } from "../user/userInfoActions";

const saveHint = (user) => {
    if (user) {
        localStorage.setItem('user_hint', JSON.stringify({ id: user.id, username: user.username, avatarUrl: user.avatarUrl }));
    } else {
        localStorage.removeItem('user_hint');
    }
};

export const createUser = (user, onSuccess) => {
    return async (dispatch) => {
        try {
            await toast.promise(
                createNewUser(user),
                {
                    loading: i18n.t("auth.creatingAccount"),
                    success: i18n.t("auth.accountCreated"),
                    error: (err) => translateAuthError(i18n.t.bind(i18n), err.message) || i18n.t("auth.registrationFailed"),
                }
            );
            const newUser = await login(user);
            saveHint(newUser);
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
                    loading: i18n.t("auth.loggingIn"),
                    success: i18n.t("auth.welcomeBack"),
                    error: (err) => translateAuthError(i18n.t.bind(i18n), err.message) || i18n.t("auth.loginFailed"),
                }
            );
            saveHint(newUser);
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
            saveHint(null);
            resetAnalytics();
            dispatch({ type: "@auth/logout" });
            dispatch(resetUserInfo());
            toast.success(i18n.t("auth.sessionClosed"));
        } catch (error) {
            toast.error(i18n.t("auth.logoutFailed"));
        }
    };
};

export const initAuthUser = () => {
    return async (dispatch) => {
        try {
            const user = await getUserForAuth();
            saveHint(user);
            dispatch({ type: "@auth/init", payload: user });
        } catch {
            saveHint(null);
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
