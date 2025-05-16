import React, { useEffect, useState } from "react";
import ItinerariesSection from "../../components/itineraries/ItinerariesSection";
import { getUserFavorites } from "../../services/favorites";

const Favorites = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [favoritesItineraries, setFavoritesItineraries] = useState([]);

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
        user={favoritesItineraries?.user}
        itineraries={favoritesItineraries}
        title="Saved trips"
        isLoading={loading}
      />
    </section>
  );
};

export default Favorites;
