import React, { useState } from "react";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const ItineraryCard = ({ itinerary, user: userProp }) => {
  const {
    id,
    photoUrl,
    location,
    tripTotalDays,
    commentsCount,
    likesCount,
    user: userFromItinerary,
  } = itinerary;

  const user = userFromItinerary || userProp || {};
  const { username = "Anonymous", avatarUrl = "" } = user;

  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="itinerary-card-section break-text">
      <Link className="itinerary-card" to={`/itinerary/${id}`}>
        <div className="itinerary-card__header">
          <img
            className="itinerary-card__header-avatar"
            src={avatarUrl}
            alt={username}
          />
          <h3 className="itinerary-card__header-name">@{username}</h3>
        </div>
        <div className="itinerary-card__image-wrapper">
          <img
            src={photoUrl}
            alt={location}
            className="itinerary-card__image"
          />
        </div>

        <div className="itinerary-card__info">
          <p className="itinerary-card__location">{location}</p>
          <p className="itinerary-card__trips">{tripTotalDays} trip days</p>
        </div>
      </Link>
      <div className="itinerary-card__buttons">
        <button className="btn__itinerary-card" onClick={toggleFavorite}>
          {isFavorited ? (
            <FaHeart className="icon" />
          ) : (
            <FaRegHeart className="icon" />
          )}
          <span>{likesCount}</span>
        </button>
        <Link to={`/friend-profile/${id}`} className="btn__itinerary-card">
          <FaRegComment className="icon" />
          <span>{commentsCount}</span>
        </Link>
      </div>
    </div>
  );
};

export default ItineraryCard;
