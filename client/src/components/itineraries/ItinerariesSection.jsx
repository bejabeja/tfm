import React from "react";
import "./ItinerariesSection.scss";
import ItineraryCard from "./card/ItineraryCard.jsx";

const ItinerariesSection = ({ itineraries, user, isMyProfile = false }) => {
  const skeletonCount = 3;
  console.log("uuuuuusser", user);
  return (
    <div className="itineraries-section">
      {!isMyProfile && (
        <h2 className="itineraries-section__title">Shared Itineraries</h2>
      )}

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
