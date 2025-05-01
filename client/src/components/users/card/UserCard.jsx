import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ id, username, location, totalItineraries, avatarUrl }) => {
  return (
    <div className="user-card">
      <div className="user-card__header">
        <img src={avatarUrl} alt={username} className="user-card__image" />
        <div className="user-card__header--info">
          <h3 className="user-card__name">@{username}</h3>
          <p className="user-card__location">{location}</p>
        </div>
      </div>

      <p className="user-card__trips">{totalItineraries} itineraries shared</p>
      <div className="user-card__buttons">
        <button className="btn btn-primary">Follow</button>
        <Link to={`/friend-profile/${id}`} className="btn btn--tertiary">
          Profile
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
