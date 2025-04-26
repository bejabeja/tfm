import React, { useEffect, useState } from "react";
import { GoPerson, GoSignOut } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { initUser, logoutUser } from "../../reducers/authReducer.js";
import "./Topbar.scss";

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(initUser());
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <section className="topbar">
      <div className="dropdown">
        <button className="dropbtn" onClick={toggleDropdown}>
          <img
            src={user?.avatarUrl}
            alt="user photo avatar"
            className="avatar"
          />
          <span>{user?.username}</span>
        </button>
        {dropdownOpen && (
          <div className="dropdown-content">
            <Link
              to={`/profile/${user.id}`}
              className="nav-item"
              onClick={toggleDropdown}
            >
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
