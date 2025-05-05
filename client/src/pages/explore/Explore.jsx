import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoadingButton from "../../components/LoadingButton.jsx";
import ItinerariesSection from "../../components/itineraries/ItinerariesSection.jsx";
import useDebouncedEffect from "../../hooks/useDebounced.js";
import {
  resetFilters,
  setCategory,
  setDestination,
} from "../../store/filters/filterActions.js";
import {
  initExploreItineraries,
  loadMoreExploreItineraries,
  setExplorePagination,
} from "../../store/itineraries/itinerariesActions.js";
import { itineraryCategories } from "../../utils/constants/constants.js";
import "./Explore.scss";

const Explore = () => {
  const dispatch = useDispatch();
  const { category, destination } = useSelector((state) => state.filters);
  const {
    exploreItineraries: { data, loading, loadingMore, page, totalPages, error },
  } = useSelector((state) => state.itineraries);
  const [localDestination, setLocalDestination] = useState(destination);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    dispatch(setExplorePagination(1));
    dispatch(initExploreItineraries({ category, destination, page: 1 }));
  }, [category, destination, dispatch]);

  useDebouncedEffect(
    () => {
      dispatch(setDestination(localDestination));
    },
    [localDestination],
    600
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      dispatch(setCategory(value));
      return;
    }

    if (name === "destination") {
      setLocalDestination(value);
    }
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setLocalDestination("");
  };

  const loadMore = () => {
    const nextPage = page + 1;
    dispatch(setExplorePagination(nextPage));
    dispatch(
      loadMoreExploreItineraries({ category, destination, page: nextPage })
    ).then(() => {
      if (loadMoreRef.current) {
        loadMoreRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  };

  const handleRetry = () => {
    dispatch(resetFilters());
  };

  const hasMore = page < totalPages;

  return (
    <section className="explore section__container">
      <Filters
        category={category}
        handleFilterChange={handleFilterChange}
        localDestination={localDestination}
        handleReset={handleReset}
      />

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
            <ItinerariesSection
              user={data?.user}
              itineraries={data}
              isLoading={loading}
            />
            <div className="explore__results-ctas" ref={loadMoreRef}>
              {hasMore && (
                <LoadingButton onClick={loadMore} isLoading={loadingMore}>
                  Show more
                </LoadingButton>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Explore;
const Filters = ({
  category,
  handleFilterChange,
  localDestination,
  handleReset,
}) => {
  return (
    <div className="explore__filters">
      <label>
        Category:
        <select name="category" value={category} onChange={handleFilterChange}>
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
          value={localDestination}
          placeholder="Search destination..."
          onChange={handleFilterChange}
        />
      </label>

      <button onClick={handleReset} className="btn btn__primary">
        Reset Filters
      </button>
    </div>
  );
};
