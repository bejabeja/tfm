export const selectNotifications = (state) => state.notifications.data;
export const selectNotificationsLoading = (state) => state.notifications.loading;
export const selectNotificationsLoadingMore = (state) => state.notifications.loadingMore;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsPage = (state) => state.notifications.page;
export const selectNotificationsTotalPages = (state) => state.notifications.totalPages;
