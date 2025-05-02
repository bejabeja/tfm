import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ItinerariesSection from "../../components/itineraries/ItinerariesSection.jsx";
import {
  setCategory,
  setDestination,
} from "../../store/filters/filterActions.js";
import { initExploreItineraries } from "../../store/itineraries/itinerariesActions.js";
import "./Explore.scss";

const Explore = () => {
  const dispatch = useDispatch();
  const { category, destination } = useSelector((state) => state.filters);
  const { itineraries } = useSelector((state) => state);
  useEffect(() => {
    dispatch(initExploreItineraries({ category, destination }));
  }, [category, destination, dispatch]);

  const exploreItineraries = itineraries?.exploreItineraries?.data || [];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "category":
        dispatch(setCategory(value));
        break;
      case "date":
        dispatch(setDate(value));
        break;
      case "destination":
        dispatch(setDestination(value));
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <section className="explore section__container">
      <div className="explore__filters">
        <label>
          Category:
          <select
            name="category"
            value={category}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="adventure">Adventure</option>
            <option value="culture">Culture</option>
            <option value="relax">Relax</option>
          </select>
        </label>

        <label>
          Destination:
          <input
            type="text"
            name="destination"
            value={destination}
            placeholder="Search destination..."
            onChange={handleFilterChange}
          />
        </label>

        <button onClick={handleReset} className="explore__reset">
          Reset Filters
        </button>
      </div>

      <div className="explore__results">
        <p>
          Showing itineraries for <strong>{category}</strong> in{" "}
          <strong>{destination || "anywhere"}</strong>{" "}
        </p>

        <ItinerariesSection
          user={exploreItineraries?.user}
          itineraries={exploreItineraries}
        />
      </div>
    </section>
  );
};

export default Explore;
