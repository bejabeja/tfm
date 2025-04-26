import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItinerariesSection from "../../components/itineraries/ItinerariesSection";
import Loading from "../../components/loading/Loading";
import { getUserById } from "../../services/user";
import "./MyItineraries.scss";

const MyItineraries = () => {
  const { id } = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(id);
        setUserData(response);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="my-itineraries section__container">
      <div className="my-itineraries__section-ctas">
        <Link to="/create-itinerary" className="btn btn-secondary">
          Create new trip
        </Link>
      </div>
      {userData && userData.itineraries ? (
        <ItinerariesSection user={userData} isMyProfile={true} />
      ) : (
        <div>No itineraries found</div>
      )}
    </section>
  );
};

export default MyItineraries;
