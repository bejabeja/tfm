import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ItinerariesSection from "../../components/itineraries/ItinerariesSection.jsx";
import {
  resetFilters,
  setCategory,
  setDestination,
} from "../../store/filters/filterActions.js";
import {
  initExploreItineraries,
  setExplorePagination,
} from "../../store/itineraries/itinerariesActions.js";
import { itineraryCategories } from "../../utils/constants/constants.js";
import "./Explore.scss";

const Explore = () => {
  const dispatch = useDispatch();
  const { category, destination } = useSelector((state) => state.filters);
  const {
    exploreItineraries: { data, loading, page, totalPages, error },
  } = useSelector((state) => state.itineraries);

  useEffect(() => {
    dispatch(setExplorePagination(1));
    dispatch(initExploreItineraries({ category, destination, page: 1 }));
  }, [category, destination, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "category":
        dispatch(setCategory(value));
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

  const loadMore = () => {
    const nextPage = page + 1;
    dispatch(setExplorePagination(nextPage));
    dispatch(initExploreItineraries({ category, destination, page: nextPage }));
  };

  const handleRetry = () => {
    dispatch(resetFilters());
  };

  const hasMore = page < totalPages;

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
            {itineraryCategories.map((cat, key) => (
              <option key={key} value={cat.value}>
                {cat.label}
              </option>
            ))}
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

        <button onClick={handleReset} className="btn btn__primary">
          Reset Filters
        </button>
      </div>

      <div className="explore__results">
        <p>
          Showing itineraries for <strong>{category}</strong> in{" "}
          <strong>{destination || "anywhere"}</strong>
        </p>

        {error ? (
          <div className="explore__error">
            <p className="error-message">
              Oops! Something went wrong while loading itineraries.
            </p>
            <button className="btn btn__danger-outline" onClick={handleRetry}>
              Try again
            </button>
          </div>
        ) : data.length === 0 && !loading ? (
          <div className="explore__no-results">
            <p>No itineraries found for these filters.</p>
            <p>Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <ItinerariesSection user={data?.user} itineraries={data} />
            <div className="explore__results-ctas">
              {hasMore && (
                <button
                  onClick={loadMore}
                  className="btn btn__secondary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Show more"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Explore;
