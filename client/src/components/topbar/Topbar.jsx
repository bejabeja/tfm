import React, { useState } from "react";
import { GoPerson, GoSignOut } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../reducers/authReducer.js";
import "./Topbar.css";

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const avatarRandom = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.username || "User Name"
  )}&background=random&size=128`;
  
  return (
    <section className="topbar">
      <div className="dropdown">
        <button className="dropbtn" onClick={toggleDropdown}>
          <img
            src={user?.photoURL || avatarRandom}
            alt="user photo avatar"
            className="avatar"
          />
          <span>{user?.username}</span>
        </button>
        {dropdownOpen && (
          <div className="dropdown-content">
            <Link to="/profile" className="nav-item">
              <GoPerson className="nav-icon" />
              <span>Profile</span>
            </Link>
            <Link to="/logout" onClick={handleLogout} className="nav-item">
              <GoSignOut className="nav-icon" />
              <span>Logout</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Topbar;
