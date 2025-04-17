import React from "react";

const UserCard = ({ username, location, tripsShared, avatarUrl }) => {
  return (
    <div className="user-card">
      <div className="user-card__header">
        <img src={avatarUrl} alt={username} className="user-card__image" />
        <div className="user-card__header--info">
          <h3 className="user-card__name">@{username}</h3>
          <p className="user-card__location">{location}</p>
        </div>
      </div>

      <p className="user-card__trips">{tripsShared} trips shared</p>
      <div className="user-card__buttons">
        <button className="btn btn-primary">Follow</button>
        <button className="btn btn--tertiary">Profile</button>
      </div>
    </div>
  );
};

export default UserCard;
