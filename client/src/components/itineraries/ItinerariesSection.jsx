import React from "react";
import "./ItinerariesSection.css";
import ItineraryCard from "./card/ItineraryCard.jsx";

const ItinerariesSection = ({ itineraries, isLoading, user }) => {
  const skeletonCount = 3;
  console.log(itineraries[0]);
  console.log(user);
  return (
    <div className="itineraries-section">
      <h2 className="itineraries-section__title">Shared Itineraries</h2>
      <div className="itineraries-section__grid">
        {itineraries.map((itinerary, key) => (
          <ItineraryCard
            itinerary={itinerary}
            key={key}
            user={user}
          ></ItineraryCard>
        ))}
      </div>
    </div>
  );
};

export default ItinerariesSection;
