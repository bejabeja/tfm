import React, { useEffect, useState } from "react";
import { FaCity } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { MdOutlineAttachMoney, MdOutlineCalendarMonth } from "react-icons/md";
import { useParams } from "react-router-dom";
import { categoryIcons } from "../../assets/icons.js";
import Loading from "../../components/Loading.jsx";
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
    return <Loading />;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  console.log(itinerary.places[0]);
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
              <MdOutlineCalendarMonth className="icon" />
              <strong className="itinerary__title">Travel days</strong>
              <p className="itinerary__description">
                {itinerary.tripTotalDays}
              </p>
            </div>
            <div className="itinerary__container-stats-people">
              <GoPeople className="icon" />
              <strong className="itinerary__title">People</strong>
              <p className="itinerary__description">
                {itinerary.numberOfPeople}
              </p>
            </div>
          </div>
          <div className="itinerary__container-primary-places">
            <h1 className="itinerary__title">Places</h1>
            {itinerary.places.map((place, index) => (
              <Place key={place.id} place={place} index={index} />
            ))}
          </div>
        </div>
        <div className="itinerary__container-secondary">
          <h1 className="itinerary__title">Trip Area</h1>
        </div>
      </div>
    </section>
  );
};

const Place = ({ place, index }) => {
  const Icon = categoryIcons[place.category] || FaCity;
  return (
    <div className="place">
      <h3 className="place__title">
        Place {index + 1} : {place.title}
      </h3>
      <div className="place__info">
        <div className="place__info-left">
          <Icon className="icon" />
        </div>
        <div className="place__info-right">
          <p className="place__description">{place.description}</p>
        </div>
      </div>
      {place.address && (
        <p className="place__address">
          <span className="place__address-title">
            <strong>Address: </strong>
          </span>
          {place.address}
        </p>
      )}
    </div>
  );
};

export default Itinerary;
