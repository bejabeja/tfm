import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ItinerariesSection from "../../components/itineraries/ItinerariesSection";
import { getUserFavorites } from "../../services/favorites";
import { selectMe } from "../../store/user/userInfoSelectors";

const Favorites = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [favoritesItineraries, setFavoritesItineraries] = useState([]);

  const userMe = useSelector(selectMe);
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await getUserFavorites();
        setFavoritesItineraries(response);
      } catch (error) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <section className="section__container">
      <ItinerariesSection
        user={userMe}
        itineraries={favoritesItineraries}
        title="Saved trips"
        isLoading={loading}
      />
    </section>
  );
};

export default Favorites;
