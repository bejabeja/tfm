import React from "react";
import "./ItineraryCardSkeleton.scss";

const ItineraryCardSkeleton = () => {
  return (
    <div className="itinerary-card skeleton-card">
      <div className="skeleton-card__header">
        <div className="skeleton skeleton--avatar" />
        <div className="skeleton skeleton--text short" />
      </div>
      <div className="skeleton skeleton--image" />
      <div className="skeleton-card__info">
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text shorter" />
      </div>
    </div>
  );
};

export default ItineraryCardSkeleton;
