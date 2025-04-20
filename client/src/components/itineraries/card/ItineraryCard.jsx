import React, { useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

const ItineraryCard = ({ itinerary, user }) => {
  const { id, title, photoUrl, location, tripTotalDays } = itinerary;
  const { username } = user;

  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="itinerary-card">
      <div className="itinerary-card__header">
        <div className="itinerary-card__image-wrapper">
          <img
            src={photoUrl}
            alt={username}
            className="itinerary-card__image"
          />
          <button
            className={`itinerary-card__favorite-btn ${
              isFavorited ? "favorited" : ""
            }`}
            onClick={toggleFavorite}
          >
            {isFavorited ? <IoIosHeart /> : <IoIosHeartEmpty />}
          </button>
        </div>
        <div className="itinerary-card__header--info">
          {/* <h3 className="itinerary-card__name">@{username}</h3> */}
          <p className="itinerary-card__location">{location}</p>
        </div>
      </div>

      <p className="itinerary-card__trips">{tripTotalDays} trip days</p>
      {/* <div className="itinerary-card__buttons">
        <button className="btn btn-primary">Follow</button>
        <Link to={`/friend-profile/${id}`} className="btn btn--tertiary">
          Profile
        </Link>
      </div> */}
    </div>
  );
};

export default ItineraryCard;
