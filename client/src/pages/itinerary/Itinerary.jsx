import React, { useEffect, useState } from "react";
import { MdOutlineAttachMoney, MdOutlineCalendarMonth } from "react-icons/md";
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
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  console.log(itinerary);
  return (
    <section className="itinerary">
      <div className="itinerary__hero">
        <div className="itinerary__hero-overlay" />
        <div className="itinerary__hero-content">
          <h1 className="itinerary__title">{itinerary.title}</h1>
          <div className="itinerary__hero-content-stats">
            <p className="itinerary__hero-content-stats-days">
              <MdOutlineCalendarMonth className="nav-icon" />
              <span>{itinerary.tripTotalDays} days</span>
            </p>
          </div>
        </div>
      </div>

      <div className="itinerary__container section__container">
        <div className="itinerary__container-primary">
          <h1 className="itinerary__title">Trip Overview</h1>
          <p className="itinerary__description">{itinerary.description}</p>
          <div className="itinerary__container-primary-stats">
            <div className="itinerary__container-stats-budget">
              <MdOutlineAttachMoney className="icon" />
              <strong className="itinerary__title">Budget</strong>
              <p className="itinerary__description">{itinerary.budget} USD</p>
            </div>
            <div className="itinerary__container-stats-days">
              <MdOutlineAttachMoney className="icon" />
              <strong className="itinerary__title">Travel days</strong>
              <p className="itinerary__description">{itinerary.tripTotalDays}</p>
            </div>
            <div className="itinerary__container-stats-people">
              <MdOutlineAttachMoney className="icon" />
              <strong className="itinerary__title">People</strong>
              <p className="itinerary__description">
                {itinerary.numberOfPeople}
              </p>
            </div>
          </div>
        </div>
        <div className="itinerary__container-secondary">
          <h1 className="itinerary__title">Trip Area</h1>
        </div>
      </div>
    </section>
  );
};

export default Itinerary;
