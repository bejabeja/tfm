import React, { useEffect, useState } from "react";
import { GoPerson, GoSignOut } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../store/auth/authActions.js";
import {
  selectMe,
  selectMeLoading,
} from "../../store/user/userInfoSelectors.js";
import "./Topbar.scss";

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const userMe = useSelector(selectMe);
  const userMeLoading = useSelector(selectMeLoading);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <section className="topbar">
      <div className="dropdown">
        {userMeLoading ? (
          <div className="topbar-skeleton">
            <div className="skeleton topbar-skeleton-avatar" />
            <div className="skeleton skeleton--text short" />
          </div>
        ) : (
          <button className="dropbtn" onClick={toggleDropdown}>
            <img
              src={userMe?.avatarUrl}
              alt="user photo avatar"
              className="avatar"
            />
            <span>{userMe?.username}</span>
          </button>
        )}
        <div
          className={`dropdown-content ${dropdownOpen ? "open-animation" : ""}`}
        >
          {" "}
          <Link
            to={`/profile/${userMe?.id}`}
            className="nav-item"
            onClick={toggleDropdown}
          >
            <GoPerson className="nav-icon" />
            <span>Profile</span>
          </Link>
          <Link to="/logout" className="nav-item">
            <GoSignOut className="nav-icon" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
