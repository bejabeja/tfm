import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItinerariesSection from "../../components/itineraries/ItinerariesSection";
import Spinner from "../../components/spinner/Spinner";
import "./MyItineraries.scss";

const MyItineraries = () => {
  const { userInfo, loading, error } = useSelector((state) => state.myInfo);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="my-itineraries section__container">
      <div className="my-itineraries__section-ctas">
        <Link to="/create-itinerary" className="btn btn__secondary">
          Plan a trip
        </Link>
      </div>
      {userInfo && userInfo.itineraries ? (
        <ItinerariesSection
          user={userInfo}
          itineraries={userInfo.itineraries}
          // title="Shared Itineraries"
        />
      ) : (
        <div>No itineraries found</div>
      )}
    </section>
  );
};

export default MyItineraries;
