import { useMemo, useState } from "react";
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

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    budgetMin: "",
    budgetMax: "",
    locationName: "",
    durationMin: "",
    durationMax: "",
    startDateMin: "",
    startDateMax: "",
  });

  if (userMeError) {
    return <div>Error: {userMeError}</div>;
  }

  const filteredItineraries = useMemo(() => {
    if (!myItineraries || !Array.isArray(myItineraries)) return [];

    return myItineraries.filter((itinerary) => {
      if (
        filters.category &&
        itinerary.category.toLowerCase() !== filters.category.toLowerCase()
      ) {
        return false;
      }

      if (
        filters.budgetMin &&
        parseFloat(itinerary.budget) < parseFloat(filters.budgetMin)
      ) {
        return false;
      }

      if (
        filters.budgetMax &&
        parseFloat(itinerary.budget) > parseFloat(filters.budgetMax)
      ) {
        return false;
      }

      if (
        filters.locationName &&
        !itinerary.location.name
          .toLowerCase()
          .includes(filters.locationName.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.durationMin &&
        itinerary.duration < parseInt(filters.durationMin, 10)
      ) {
        return false;
      }

      if (
        filters.durationMax &&
        itinerary.duration > parseInt(filters.durationMax, 10)
      ) {
        return false;
      }

      if (
        filters.startDateMin &&
        new Date(itinerary.startDate) < new Date(filters.startDateMin)
      ) {
        return false;
      }

      if (
        filters.startDateMax &&
        new Date(itinerary.startDate) > new Date(filters.startDateMax)
      ) {
        return false;
      }

      if (
        filters.transportType &&
        itinerary.transportType.toLowerCase() !==
          filters.transportType.toLowerCase()
      ) {
        return false;
      }

      if (
        filters.difficulty &&
        itinerary.difficulty.toLowerCase() !== filters.difficulty.toLowerCase()
      ) {
        return false;
      }

      if (
        filters.tags &&
        !itinerary.tags.some((tag) =>
          tag.toLowerCase().includes(filters.tags.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    });
  }, [myItineraries, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="my-itineraries section__container">
      <div className="my-itineraries__section-ctas">
        <Link to="/create-itinerary" className="btn btn__secondary">
          Plan a trip
        </Link>
      </div>

      <div className="filters">
        <div className="filters__main">
          <input
            type="text"
            name="locationName"
            placeholder="Filter by location"
            value={filters.locationName}
            onChange={handleFilterChange}
            className="filter-location"
          />

          <button
            className="btn-toggle-filters"
            onClick={() => setShowFilters((prev) => !prev)}
            aria-expanded={showFilters}
          >
            {showFilters ? "Less filters ▲" : "More filters ▼"}
          </button>
        </div>

        {showFilters && (
          <>
            <div className="filters__more">
              <div className="filter-group">
                <label>Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All categories</option>
                  <option value="city">City</option>
                  <option value="romantic">Romantic</option>
                  <option value="culture">Culture</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Budget</label>
                <div className="filter-pair">
                  <input
                    type="number"
                    name="budgetMin"
                    placeholder="Min"
                    value={filters.budgetMin}
                    onChange={handleFilterChange}
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="budgetMax"
                    placeholder="Max"
                    value={filters.budgetMax}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Duration (days)</label>
                <div className="filter-pair">
                  <input
                    type="number"
                    name="durationMin"
                    placeholder="Min"
                    value={filters.durationMin}
                    onChange={handleFilterChange}
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="durationMax"
                    placeholder="Max"
                    value={filters.durationMax}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="filter-group dates">
                <label>Start date</label>
                <div className="filter-pair">
                  <input
                    type="date"
                    name="startDateMin"
                    value={filters.startDateMin}
                    onChange={handleFilterChange}
                  />
                  <span>-</span>
                  <input
                    type="date"
                    name="startDateMax"
                    value={filters.startDateMax}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
            <button
              className="btn btn__reset"
              onClick={() =>
                setFilters({
                  category: "",
                  budgetMin: "",
                  budgetMax: "",
                  locationName: "",
                  durationMin: "",
                  durationMax: "",
                  startDateMin: "",
                  startDateMax: "",
                  transportType: "",
                  difficulty: "",
                  tags: "",
                })
              }
            >
              Reset filters
            </button>
          </>
        )}
      </div>

      <ItinerariesSection
        user={userMe}
        itineraries={filteredItineraries}
        isLoading={myItineraries.loading}
      />
    </section>
  );
};

export default MyItineraries;
