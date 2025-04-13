import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <section>
      <div className="navbar-section">
        <Link to="/" className="logo">
          Trobeatraveller
        </Link>
        <div className="hamburger-menu" onClick={toggleNavbar}>
          ☰
        </div>
      </div>

      <nav className={`navbar ${isOpen ? "open" : ""}`}>
        <div className="nav-section">
          <Link to="/" className="logo desktop-only">
            Trobeatraveller
          </Link>

          <h3>Discover</h3>
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/community">Community</Link>
        </div>
        <div className="nav-section">
          <h3>Private</h3>
          {isAuthenticated ? (
            <>
              <Link to="/my-itineraries">Itineraries</Link>
              <Link to="/friends">Friends</Link>
              <Link to="/profile">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </section>
  );
};

export default Navbar;
