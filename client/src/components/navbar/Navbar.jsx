import { useEffect, useState } from "react";
import { GoHome, GoPerson, GoSignIn, GoSignOut } from "react-icons/go";
import {
  IoAddOutline,
  IoCardOutline,
  IoChevronBack,
  IoChevronForward,
  IoChevronForward as IoChevronForwardOutline,
  IoFlashOutline,
  IoListOutline,
  IoNotificationsOutline,
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
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    setMeOpen(false);
    setCreateOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Home's hero photo runs full-bleed behind the marketing nav (see
  // .marketing-navbar--overlay); the nav starts transparent over it and
  // becomes a solid bar once the hero is scrolled past.
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => setIsScrolledPastHero(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);
  const isTransparentNav = isHomePage && !isScrolledPastHero;

  // Anonymous visitors get the horizontal marketing nav (see the ternary
  // below), never the collapsible sidebar, so this class must not linger on
  // <html> from a previous logged-in session, or the marketing nav's
  // ".side-content" would inherit the collapsed sidebar's 64px width rule.
  useEffect(() => {
    if (!isAuthenticated) {
      document.documentElement.classList.remove("sidebar-collapsed");
      return;
    }
    document.documentElement.classList.toggle("sidebar-collapsed", isCollapsed);
    localStorage.setItem("sidebar-collapsed", isCollapsed);
  }, [isCollapsed, isAuthenticated]);

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

      {/* Desktop: fixed left sidebar for the logged-in app experience */}
      {isAuthenticated ? (
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
          <button className="nav-create" onClick={openCreate} title={t("nav.createTrip")}>
            <IoAddOutline className="nav-icon" />
            <span>{t("nav.createTrip")}</span>
          </button>

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
            <NavLink to="/subscription" className="nav-item" title={t("nav.subscription")}>
              <IoCardOutline className="nav-icon" />
              <span>{t("nav.subscription")}</span>
            </NavLink>
            <NavLink to="/account" className="nav-item" title={t("nav.myAccount")}>
              <GoPerson className="nav-icon" />
              <span>{t("nav.myAccount")}</span>
            </NavLink>
          </div>

          <div className="navbar__bottom">
            <button
              className="navbar__toggle"
              onClick={() => setIsCollapsed((v) => !v)}
              title={isCollapsed ? t("nav.expandSidebar") : t("nav.collapseSidebar")}
            >
              {isCollapsed ? <IoChevronForward className="nav-icon" /> : <IoChevronBack className="nav-icon" />}
              <span>{t("nav.collapse")}</span>
            </button>

            {userMe && (
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
      ) : (
        /* Desktop: horizontal top nav for anonymous, marketing-facing pages.
           On Home it overlays the hero photo (transparent, white logo) and
           becomes a solid bar once scrolled past the hero. */
        <nav
          className={`marketing-navbar${isHomePage ? " marketing-navbar--overlay" : ""}${isTransparentNav ? " marketing-navbar--transparent" : ""}`}
        >
          <div className="marketing-navbar__inner">
            <Link to="/" className="logo marketing-navbar__logo">
              <img
                src={isTransparentNav ? "/logo-white.svg" : "/logo.svg"}
                alt="ToBeATraveller"
                className="logo__full"
                height="34"
              />
            </Link>

            <div className="marketing-navbar__links">
              <NavLink to="/explore" className="marketing-navbar__link">{t("nav.explore")}</NavLink>
              <NavLink to="/community" className="marketing-navbar__link">{t("community.title")}</NavLink>
              <NavLink to="/subscription" className="marketing-navbar__link">{t("nav.subscription")}</NavLink>
            </div>

            <div className="marketing-navbar__auth">
              <Link to="/login" className="marketing-navbar__login">{t("nav.login")}</Link>
              <Link to="/register" className="btn btn--primary marketing-navbar__register">{t("nav.createAccountBtn")}</Link>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile: Me panel */}
      {meOpen && isAuthenticated && (
        <>
          <div className="me-panel__backdrop" onClick={() => setMeOpen(false)} />
          <nav className="me-panel">
            <NavLink to="/account" className="me-panel__item">
              <GoPerson className="me-panel__icon" />
              <span>{t("nav.myAccount")}</span>
            </NavLink>
            <NavLink to="/subscription" className="me-panel__item">
              <IoCardOutline className="me-panel__icon" />
              <span>{t("nav.subscription")}</span>
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
