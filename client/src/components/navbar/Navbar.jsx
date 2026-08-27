import { useEffect, useState } from "react";
import { GoHome, GoPerson, GoSignIn, GoSignOut } from "react-icons/go";
import {
  IoAddOutline,
  IoBookOutline,
  IoBriefcaseOutline,
  IoCartOutline,
  IoChevronBack,
  IoChevronForward,
  IoChevronForward as IoChevronForwardOutline,
  IoFlashOutline,
  IoJournalOutline,
  IoListOutline,
  IoNotificationsOutline,
  IoSaveOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectUnreadCount } from "@tobeatraveller/shared";
import { selectIsAuthenticated } from "../../store/auth/authSelectors";
import { selectMe } from "../../store/user/userInfoSelectors";
import { generateAvatar } from "../../utils/constants/constants";
import { optimizedCloudinaryUrl } from "../../utils/cloudinaryUrl";
import GlobalSearch from "./GlobalSearch";
import "./Navbar.scss";

const Navbar = () => {
  const { t } = useTranslation();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userMe     = useSelector(selectMe);
  const unreadCount = useSelector(selectUnreadCount);
  const location   = useLocation();

  const [meOpen, setMeOpen]             = useState(false);
  const [createOpen, setCreateOpen]     = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [isCollapsed, setIsCollapsed]   = useState(
    () => localStorage.getItem("sidebar-collapsed") === "true"
  );

  const isAuthRoute = ["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    setMeOpen(false);
    setCreateOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    document.documentElement.classList.toggle("sidebar-collapsed", isCollapsed);
    localStorage.setItem("sidebar-collapsed", isCollapsed);
  }, [isCollapsed]);

  const openCreate = () => setCreateOpen(true);
  const handleCreate = (path) => { setCreateOpen(false); navigate(path); };

  return (
    <>
      {/* Mobile: fixed top header */}
      {!isAuthRoute && (
        <div className="mobile-header">
          <Link to="/" className="logo">
            <img src="/logo.svg" alt="ToBeATraveller" className="logo__full" height="28" />
          </Link>
        </div>
      )}

      {/* Desktop: fixed left sidebar */}
      <nav className="navbar">
        <Link to="/" className="logo navbar__logo">
          <img src="/logo-mark.svg" alt="ToBeATraveller" className="logo__mark" width="26" height="26" />
          <img src="/logo.svg" alt="ToBeATraveller" className="logo__full" height="28" />
        </Link>

        <button type="button" className="nav-search-trigger" title={t("globalSearch.trigger")} onClick={() => setSearchOpen(true)}>
          <IoSearchOutline className="nav-search-trigger__icon" />
          <span>{t("globalSearch.placeholder")}</span>
        </button>

        <div className="nav-section">
          <h3>{t("nav.discover")}</h3>
          <NavLink to="/" className="nav-item" end title={t("nav.home")}>
            <GoHome className="nav-icon" />
            <span>{t("nav.home")}</span>
          </NavLink>
          <NavLink to="/explore" className="nav-item" title={t("nav.explore")}>
            <IoSearch className="nav-icon" />
            <span>{t("nav.explore")}</span>
          </NavLink>
        </div>

        {/* Single create button: opens sheet */}
        {isAuthenticated && (
          <button className="nav-create" onClick={openCreate} title={t("nav.createTrip")}>
            <IoAddOutline className="nav-icon" />
            <span>{t("nav.createTrip")}</span>
          </button>
        )}

        {isAuthenticated && (
          <div className="nav-section">
            <h3>{t("nav.yourSpace")}</h3>
            <NavLink to="/notifications" className="nav-item nav-item--notif" title={t("nav.notifications")}>
              <span className="nav-item__icon-wrap">
                <IoNotificationsOutline className="nav-icon" />
                {unreadCount > 0 && (
                  <span className="nav-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
                )}
              </span>
              <span>{t("nav.notifications")}</span>
            </NavLink>
            <NavLink to="/itineraries/saved" className="nav-item" title={t("nav.savedTrips")}>
              <IoSaveOutline className="nav-icon" />
              <span>{t("nav.savedTrips")}</span>
            </NavLink>
            <NavLink to="/van-log" className="nav-item" title={t("nav.vanLog")}>
              <IoBookOutline className="nav-icon" />
              <span>{t("nav.vanLog")}</span>
            </NavLink>
            <NavLink to="/supplies" className="nav-item" title={t("nav.supplies")}>
              <IoCartOutline className="nav-icon" />
              <span>{t("nav.supplies")}</span>
            </NavLink>
            <NavLink to="/packing-checklist" className="nav-item" title={t("nav.packingChecklist")}>
              <IoBriefcaseOutline className="nav-icon nav-icon--briefcase" />
              <span>{t("nav.packingChecklist")}</span>
            </NavLink>
            <NavLink to="/life-diary" className="nav-item" title={t("nav.lifeDiary")}>
              <IoJournalOutline className="nav-icon" />
              <span>{t("nav.lifeDiary")}</span>
            </NavLink>
          </div>
        )}

        <div className="navbar__bottom">
          <button
            className="navbar__toggle"
            onClick={() => setIsCollapsed((v) => !v)}
            title={isCollapsed ? t("nav.expandSidebar") : t("nav.collapseSidebar")}
          >
            {isCollapsed ? <IoChevronForward className="nav-icon" /> : <IoChevronBack className="nav-icon" />}
            <span>{t("nav.collapse")}</span>
          </button>

          {!isAuthenticated && (
            <div className="nav-auth">
              <Link to="/register" className="btn btn--primary nav-auth__register">{t("nav.createAccountBtn")}</Link>
              <Link to="/login" className="nav-auth__login">{t("auth.alreadyMember")} <span>{t("auth.signInLink")}</span></Link>
            </div>
          )}

          {isAuthenticated && userMe && (
            <div className="nav-footer">
              <Link to={`/profile/${userMe.id}`} className="nav-footer__user" title={`@${userMe.username}`}>
                <img
                  src={optimizedCloudinaryUrl(userMe.avatarUrl, { width: 48 }) || generateAvatar(userMe.username)}
                  alt={userMe.username}
                  className="nav-footer__avatar"
                />
                <span className="nav-footer__username">@{userMe.username}</span>
              </Link>
              <NavLink to="/logout" className="nav-footer__logout" title={t("auth.logout")}>
                <GoSignOut />
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile: Me panel */}
      {meOpen && isAuthenticated && (
        <>
          <div className="me-panel__backdrop" onClick={() => setMeOpen(false)} />
          <nav className="me-panel">
            <NavLink to={`/profile/${userMe?.id}`} className="me-panel__item">
              <GoPerson className="me-panel__icon" />
              <span>{t("nav.profile")}</span>
            </NavLink>
            <NavLink to="/itineraries/saved" className="me-panel__item">
              <IoSaveOutline className="me-panel__icon" />
              <span>{t("nav.savedTrips")}</span>
            </NavLink>
            <NavLink to="/van-log" className="me-panel__item">
              <IoBookOutline className="me-panel__icon" />
              <span>{t("nav.vanLog")}</span>
            </NavLink>
            <NavLink to="/supplies" className="me-panel__item">
              <IoCartOutline className="me-panel__icon" />
              <span>{t("nav.supplies")}</span>
            </NavLink>
            <NavLink to="/packing-checklist" className="me-panel__item">
              <IoBriefcaseOutline className="me-panel__icon nav-icon--briefcase" />
              <span>{t("nav.packingChecklist")}</span>
            </NavLink>
            <NavLink to="/life-diary" className="me-panel__item">
              <IoJournalOutline className="me-panel__icon" />
              <span>{t("nav.lifeDiary")}</span>
            </NavLink>
            <div className="me-panel__divider" />
            <NavLink to="/logout" className="me-panel__item me-panel__item--danger">
              <GoSignOut className="me-panel__icon" />
              <span>{t("auth.logout")}</span>
            </NavLink>
          </nav>
        </>
      )}

      {/* Mobile: bottom tab bar */}
      <nav className="bottom-nav">
        <NavLink to="/" className="bottom-nav__item" end>
          <GoHome className="bottom-nav__icon" />
          <span>{t("nav.home")}</span>
        </NavLink>
        <NavLink to="/explore" className="bottom-nav__item">
          <IoSearch className="bottom-nav__icon" />
          <span>{t("nav.explore")}</span>
        </NavLink>
        {isAuthenticated && (
          <button className="bottom-nav__item bottom-nav__item--create" onClick={openCreate}>
            <div className="bottom-nav__create-btn">
              <IoAddOutline className="bottom-nav__icon" />
            </div>
          </button>
        )}
        <button type="button" className="bottom-nav__item" onClick={() => setSearchOpen(true)}>
          <IoSearchOutline className="bottom-nav__icon" />
          <span>{t("globalSearch.trigger")}</span>
        </button>
        {isAuthenticated ? (
          <button className={`bottom-nav__item ${meOpen ? "active" : ""}`} onClick={() => setMeOpen(!meOpen)}>
            <GoPerson className="bottom-nav__icon" />
            <span>{t("nav.me")}</span>
          </button>
        ) : (
          <NavLink to="/login" className="bottom-nav__item">
            <GoSignIn className="bottom-nav__icon" />
            <span>{t("nav.login")}</span>
          </NavLink>
        )}
      </nav>

      {/* Create sheet */}
      {createOpen && (
        <div className="create-sheet__backdrop" onClick={() => setCreateOpen(false)}>
          <div className="create-sheet" onClick={e => e.stopPropagation()}>
            <div className="create-sheet__handle" />
            <p className="create-sheet__title">{t("nav.createSheetTitle")}</p>

            <button className="create-sheet__option create-sheet__option--itinerary" onClick={() => handleCreate("/create-itinerary")}>
              <div className="create-sheet__option-icon">
                <IoListOutline size={24} />
              </div>
              <div className="create-sheet__option-text">
                <strong>{t("nav.createSheetItinerary")}</strong>
                <span>{t("nav.createSheetItineraryDesc")}</span>
              </div>
              <IoChevronForwardOutline size={16} className="create-sheet__option-arrow" />
            </button>

            <button className="create-sheet__option create-sheet__option--experience" onClick={() => handleCreate("/create-experience")}>
              <div className="create-sheet__option-icon">
                <IoFlashOutline size={24} />
              </div>
              <div className="create-sheet__option-text">
                <strong>{t("nav.createSheetExperience")}</strong>
                <span>{t("nav.createSheetExperienceDesc")}</span>
              </div>
              <IoChevronForwardOutline size={16} className="create-sheet__option-arrow" />
            </button>

            <button className="create-sheet__cancel" onClick={() => setCreateOpen(false)}>
              {t("nav.createSheetCancel")}
            </button>
          </div>
        </div>
      )}

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
