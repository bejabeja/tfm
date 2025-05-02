import React from "react";
import "./ItinerariesSection.scss";
import ItineraryCard from "./card/ItineraryCard.jsx";

const ItinerariesSection = ({ user, itineraries, title = "" }) => {
  const skeletonCount = 3;

  return (
    <div className="itineraries-section">
      <h2 className="itineraries-section__title">{title}</h2>

      <div className="itineraries-section__grid">
        {itineraries.length === 0 ? (
          <p className="itineraries-section__empty">
            No itineraries shared yet.
          </p>
        ) : (
          itineraries.map((itinerary, key) => (
            <ItineraryCard
              itinerary={itinerary}
              key={key}
              user={user}
            ></ItineraryCard>
          ))
        )}
      </div>
    </div>
  );
};

export default ItinerariesSection;
