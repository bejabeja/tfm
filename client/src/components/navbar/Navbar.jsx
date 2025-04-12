import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logout from "../../pages/Logout";

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <nav className="navbar">
      <div className="nav-section">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/community">Community</Link>
      </div>
      <div className="nav-section">
        {isAuthenticated ? (
          <>
            <Link to="/my-itineraries">Itineraries</Link>
            <Link to="/friends">Friends</Link>
            <Link to="/profile">Profile</Link>
            <Logout />
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
