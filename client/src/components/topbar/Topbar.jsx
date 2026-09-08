import { useEffect, useState } from "react";
import { GoPerson, GoSignOut } from "react-icons/go";
import { IoCardOutline, IoNotificationsOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectUnreadCount } from "@tobeatraveller/shared";
import { selectMe, selectMeLoading } from "../../store/user/userInfoSelectors.js";
import { generateAvatar } from "../../utils/constants/constants";
import { optimizedCloudinaryUrl } from "../../utils/cloudinaryUrl.js";
import "./Topbar.scss";

// Desktop-only (>=480px, see Topbar.scss) counterpart to the mobile "Yo"
// panel: Notifications, Mi cuenta and Suscripcion used to be their own rows
// in the sidebar (Navbar.jsx), permanently on screen no matter the page,
// which duplicated whatever a routed page (e.g. Account.jsx) showed for the
// same links. Folding them here mirrors the sidebar's "Tus herramientas"
// section staying put (that's product nav, not account chrome).
const Topbar = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const userMe = useSelector(selectMe);
  const userMeLoading = useSelector(selectMeLoading);
  const unreadCount = useSelector(selectUnreadCount);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!event.target.closest(".topbar__account")) setMenuOpen(false);
    };
    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, []);

  return (
    <section className="topbar">
      <Link to="/notifications" className="topbar__notif" aria-label={t("nav.notifications")}>
        <IoNotificationsOutline className="topbar__notif-icon" />
        {unreadCount > 0 && (
          <span className="nav-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </Link>

      <div className="topbar__account">
        {userMeLoading ? (
          <div className="topbar-skeleton">
            <div className="skeleton topbar-skeleton-avatar" />
            <div className="skeleton skeleton--text short" />
          </div>
        ) : (
          <button type="button" className="topbar__trigger" onClick={() => setMenuOpen((open) => !open)}>
            <img
              src={optimizedCloudinaryUrl(userMe?.avatarUrl, { width: 48 }) || generateAvatar(userMe?.username)}
              alt={userMe?.username ? `@${userMe.username}` : ""}
              className="topbar__avatar"
            />
            <span>{userMe?.username}</span>
          </button>
        )}

        <div className={`topbar__menu${menuOpen ? " topbar__menu--open" : ""}`}>
          <Link to="/account" className="topbar__menu-item" onClick={() => setMenuOpen(false)}>
            <GoPerson className="topbar__menu-icon" />
            <span>{t("nav.myAccount")}</span>
          </Link>
          <div className="topbar__menu-divider" />
          <Link to="/subscription" className="topbar__menu-item" onClick={() => setMenuOpen(false)}>
            <IoCardOutline className="topbar__menu-icon" />
            <span>{t("nav.subscription")}</span>
          </Link>
          <div className="topbar__menu-divider" />
          <Link to="/logout" className="topbar__menu-item topbar__menu-item--danger">
            <GoSignOut className="topbar__menu-icon" />
            <span>{t("auth.logout")}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
