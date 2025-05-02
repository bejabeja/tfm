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

  return (
    <div className="itinerary-card break-text">
      <Link to={`/itinerary/${id}`} className="itinerary-card__link">
        <div className="itinerary-card__header">
          <img
            src={avatarUrl}
            alt={username}
            className="itinerary-card__avatar"
          />
          <span className="itinerary-card__username">@{username}</span>
        </div>
        <div className="itinerary-card__image-wrapper">
          <img
            src={photoUrl}
            alt={location}
            className="itinerary-card__image"
          />
        </div>
        <div className="itinerary-card__info">
          <h3 className="itinerary-card__location">{location}</h3>
          <p className="itinerary-card__days">{tripTotalDays} trip days</p>
        </div>
      </Link>
      <div className="itinerary-card__actions">
        <button
          className={`btn__itinerary-card ${isFavorited ? "active" : ""}`}
          onClick={() => setIsFavorited(!isFavorited)}
        >
          {isFavorited ? (
            <FaHeart className="icon" />
          ) : (
            <FaRegHeart className="icon" />
          )}
          <span>{likesCount}</span>
        </button>
        <Link to={`/friend-profile/${user.id}`} className="btn__itinerary-card">
          <FaRegComment className="icon" />
          <span>{commentsCount}</span>
        </Link>
      </div>
    </div>
  );
};

export default ItineraryCard;
