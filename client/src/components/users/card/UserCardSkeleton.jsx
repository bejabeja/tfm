import React from "react";
import "./UserCardSkeleton.css"; 

const UserCardSkeleton = () => {
  return (
    <div className="user-card user-card--skeleton">
      <div className="user-card__header skeleton-header">
        <div className="user-card__image skeleton skeleton--avatar" />
        <div className="user-card__header--info skeleton-info">
          <div className="skeleton skeleton--text skeleton--username" />
          <div className="skeleton skeleton--text skeleton--location" />
        </div>
      </div>
      <div className="skeleton skeleton--text skeleton--trips" />
      <div className="user-card__buttons">
        <div className="skeleton skeleton--button" />
        <div className="skeleton skeleton--button" />
      </div>
    </div>
  );
};

export default UserCardSkeleton;
