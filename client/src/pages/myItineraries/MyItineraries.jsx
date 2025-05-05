import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItinerariesSection from "../../components/itineraries/ItinerariesSection";
import "./MyItineraries.scss";

const MyItineraries = () => {
  const { me, myItineraries } = useSelector((state) => state.myInfo);
  const userInfo = me.data;
  // if (me.loading) {
  //   return <Spinner />;
  // }

  if (me.error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="my-itineraries section__container">
      <div className="my-itineraries__section-ctas">
        <Link to="/create-itinerary" className="btn btn__secondary">
          Plan a trip
        </Link>
      </div>
      <ItinerariesSection
        user={userInfo}
        itineraries={myItineraries.data}
        // title="Shared Itineraries"
        isLoading={myItineraries.loading}
      />
    </section>
  );
};

export default MyItineraries;
