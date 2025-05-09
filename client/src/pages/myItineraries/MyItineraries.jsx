import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItinerariesSection from "../../components/itineraries/ItinerariesSection";
import {
  selectMe,
  selectMeError,
  selectMyItineraries,
} from "../../store/user/userInfoSelectors";
import "./MyItineraries.scss";

const MyItineraries = () => {
  const userMe = useSelector(selectMe);
  const myItineraries = useSelector(selectMyItineraries);
  const userMeError = useSelector(selectMeError);

  if (userMeError) {
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
        user={userMe}
        itineraries={myItineraries}
        // title="Shared Itineraries"
        isLoading={myItineraries.loading}
      />
    </section>
  );
};

export default MyItineraries;
