import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItineraryById } from "../../services/itineraries";
import "./Itinerary.scss";

const Itinerary = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await getItineraryById(id);
        setItinerary(response);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  console.log(itinerary);
  return (
    <section className="itinerary">
      <div className="itinerary-container">
        {itinerary ? (
          <div className="itinerary-details">
            <h2>{itinerary.title}</h2>
            <p>{itinerary.description}</p>
          </div>
        ) : (
          <p>Loading itinerary...</p>
        )}
      </div>
    </section>
  );
};

export default Itinerary;
