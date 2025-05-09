export const selectAuth = (state) => state.auth;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.authLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthUser = (state) => state.auth.user;
export const selectimageHeroLoaded = (state) => state.auth.imageHeroLoaded;
export const selectimageAuthLoaded = (state) => state.auth.imageAuthLoaded;

