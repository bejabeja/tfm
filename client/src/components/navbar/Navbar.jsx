import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import {
  GoBook,
  GoHome,
  GoPeople,
  GoPerson,
  GoSignIn,
  GoSignOut,
} from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { RiUserCommunityLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../store/auth/authActions";
import "./Navbar.scss";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
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
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsOpen(false);
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
          <Link to="/" className="logo desktop-only">
            Trobeatraveller
          </Link>

          <h3>Discover</h3>
          <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
            <GoHome className="nav-icon" />
            <span>Home</span>
          </Link>
          <Link
            to="/explore"
            className={`nav-item ${isActive("/explore") ? "active" : ""}`}
          >
            <IoSearch className="nav-icon" />
            <span>Explore</span>
          </Link>
          <Link
            to="/community"
            className={`nav-item ${isActive("/community") ? "active" : ""}`}
          >
            <RiUserCommunityLine className="nav-icon" />
            <span>Community</span>
          </Link>
        </div>

        {loading ? (
          <div className="loading-placeholder nav-section">
            <h3>Private</h3>
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
              <h3>Private</h3>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-itineraries"
                    className={`nav-item ${
                      isActive("/my-itineraries") ? "active" : ""
                    }`}
                  >
                    <GoBook className="nav-icon" />
                    <span>My Itineraries</span>
                  </Link>
                  <Link
                    to="/friends"
                    className={`nav-item ${
                      isActive("/friends") ? "active" : ""
                    }`}
                  >
                    <GoPeople className="nav-icon" />
                    <span>Friends</span>
                  </Link>
                  {isOpen && (
                    <>
                      <Link
                        to={`/profile/${userInfo.id}`}
                        className={`nav-item ${
                          isActive("/profile") ? "active" : ""
                        }`}
                      >
                        <GoPerson className="nav-icon" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/logout"
                        onClick={handleLogout}
                        className="nav-item"
                      >
                        <GoSignOut className="nav-icon" />
                        <span>Logout</span>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`nav-item ${isActive("/login") ? "active" : ""}`}
                  >
                    <GoSignIn className="nav-icon" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className={`nav-item ${
                      isActive("/register") ? "active" : ""
                    }`}
                  >
                    <GoSignOut className="nav-icon" />
                    <span>Register</span>
                  </Link>
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
