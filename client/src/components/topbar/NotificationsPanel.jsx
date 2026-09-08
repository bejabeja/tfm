import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  initNotifications,
  markAllNotificationsRead,
  selectNotifications,
  selectNotificationsError,
  selectNotificationsLoading,
  selectUnreadCount,
} from "@tobeatraveller/shared";
import NotificationItem from "../notifications/NotificationItem";
import "./NotificationsPanel.scss";

const PREVIEW_COUNT = 5;

// Desktop-only preview (GitHub/LinkedIn/X pattern): the bell opens a short
// list inline instead of always jumping to the full /notifications page,
// which stays reachable via "See all" at the bottom.
const NotificationsPanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);
  const unreadCount = useSelector(selectUnreadCount);

  useEffect(() => {
    if (isOpen) dispatch(initNotifications());
  }, [isOpen, dispatch]);

  // There's no per-notification "mark as read" endpoint, only mark-all
  // (same constraint the full page works under), so viewing the preview
  // clears the badge exactly like viewing the full page already does.
  useEffect(() => {
    if (isOpen && unreadCount > 0) dispatch(markAllNotificationsRead());
  }, [isOpen, unreadCount, dispatch]);

  const preview = notifications.slice(0, PREVIEW_COUNT);

  return (
    <div className={`notif-panel${isOpen ? " notif-panel--open" : ""}`}>
      <h3 className="notif-panel__title">{t("notifications.title")}</h3>

      {loading ? (
        <div className="notif-panel__list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="notif-skeleton" />
          ))}
        </div>
      ) : error ? (
        <p className="notif-panel__message">{t("notifications.errorMsg")}</p>
      ) : preview.length === 0 ? (
        <p className="notif-panel__message">{t("notifications.noNotifications")}</p>
      ) : (
        <div className="notif-panel__list">
          {preview.map((n) => (
            <NotificationItem key={n.id} notification={n} onClick={onClose} />
          ))}
        </div>
      )}

      <Link to="/notifications" className="notif-panel__see-all" onClick={onClose}>
        {t("notifications.seeAll")}
      </Link>
    </div>
  );
};

export default NotificationsPanel;
