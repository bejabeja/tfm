import React from "react";
import { Link, useNavigate } from "react-router-dom";

const UserCard = ({
  id,
  username,
  location,
  totalItineraries,
  avatarUrl,
  isAuthenticated,
  isFollowing,
  onFollowToggle,
}) => {
  const navigate = useNavigate();
  const handleFollow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    onFollowToggle(id, isFollowing);
  };

  return (
    <div className="user-card">
      <div className="user-card__header">
        <img src={avatarUrl} alt={username} className="user-card__image" />
        <div className="user-card__header--info">
          <h3 className="user-card__name">@{username}</h3>
          <p className="user-card__location">{location?.name}</p>
        </div>
      </div>

      <p className="user-card__trips">{totalItineraries} itineraries shared</p>
      <div className="user-card__buttons">
        {isFollowing ? (
          <button className="btn btn__danger-outline" onClick={handleFollow}>
            Unfollow
          </button>
        ) : (
          <button className="btn btn__primary" onClick={handleFollow}>
            Follow
          </button>
        )}

        <Link to={`/friend-profile/${id}`} className="btn btn__primary">
          Profile
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
