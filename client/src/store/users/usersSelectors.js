export const selectAllUsers = (state) => state.users.all.data;
export const selectAllUsersLoading = (state) => state.users.all.loading;
export const selectAllUsersError = (state) => state.users.all.error;

export const selectFeaturedUsers = (state) => state.users.featured.data;
export const selectFeaturedUsersLoading = (state) =>
    state.users.featured.loading;
export const selectFeaturedUsersError = (state) => state.users.featured.error;
