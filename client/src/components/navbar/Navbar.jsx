import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { GoBook, GoHome, GoPerson, GoSignIn, GoSignOut } from "react-icons/go";
import { IoSaveOutline, IoSearch } from "react-icons/io5";
import { RiUserCommunityLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/auth/authActions";
import {
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../store/auth/authSelectors";
import "./Navbar.scss";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  const { me } = useSelector((state) => state.myInfo);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const userInfo = me.data;

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsOpen(false);
    navigate("/");
  };

  return (
    <section>
      <div className="navbar-section">
        <Link to="/" className="logo">
          Trobeatraveller
        </Link>
        <div className="hamburger-menu" onClick={toggleNavbar}>
          <FaBars className="nav-icon" />
        </div>
      </div>

      <nav className={`navbar ${isOpen ? "open" : ""}`}>
        <div className="nav-section">
          <NavLink to="/" className="logo desktop-only">
            Trobeatraveller
          </NavLink>

          <h3>Discover</h3>
          <NavLink to="/" className="nav-item">
            <GoHome className="nav-icon" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/explore" className="nav-item">
            <IoSearch className="nav-icon" />
            <span>Explore</span>
          </NavLink>
          <NavLink to="/community" className="nav-item">
            <RiUserCommunityLine className="nav-icon" />
            <span>Community</span>
          </NavLink>
        </div>

        {authLoading ? (
          <div className="loading-placeholder nav-section">
            <h3>Your space</h3>
            <p>
              <GoBook className="nav-icon" />
              <span>Loading...</span>
            </p>
            <p>
              <GoBook className="nav-icon" />
              <span>Loading...</span>
            </p>
          </div>
        ) : (
          <>
            <div className="nav-section">
              <h3>Your Space</h3>
              {isAuthenticated ? (
                <>
                  <NavLink to="/my-itineraries" className="nav-item">
                    <GoBook className="nav-icon" />
                    <span>My trips</span>
                  </NavLink>
                  <NavLink to="/itineraries/saved" className="nav-item">
                    <IoSaveOutline className="nav-icon" />
                    <span>Saved trips</span>
                  </NavLink>
                  {isOpen && (
                    <>
                      <NavLink
                        to={`/profile/${userInfo.id}`}
                        className="nav-item"
                      >
                        <GoPerson className="nav-icon" />
                        <span>Profile</span>
                      </NavLink>
                      <NavLink
                        to="/logout"
                        onClick={handleLogout}
                        className="nav-item"
                      >
                        <GoSignOut className="nav-icon" />
                        <span>Logout</span>
                      </NavLink>
                    </>
                  )}
                </>
              ) : (
                <>
                  <NavLink to="/login" className="nav-item">
                    <GoSignIn className="nav-icon" />
                    <span>Login</span>
                  </NavLink>
                  <NavLink to="/register" className="nav-item">
                    <GoSignIn className="nav-icon" />
                    <span>Register</span>
                  </NavLink>
                </>
              )}
            </div>
          </>
        )}
      </nav>
    </section>
  );
};

export default Navbar;
