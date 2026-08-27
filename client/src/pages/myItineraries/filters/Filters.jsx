import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { itineraryCategories } from "../../../utils/constants/constants";
import "./Filters.scss";

const categoryEmojis = {
  adventure: "⛰️", relax: "🏖️", culture: "🏛️", romantic: "❤️",
  roadtrip: "🚗", family: "👨‍👩‍👧", backpacking: "🎒", wellness: "🧘",
  gastronomic: "🍽️", party: "🎉", sport: "⚽", other: "🗺️",
};

const TRAVELERS_OPTIONS = ["solo", "couple", "group", "large"];

const initialState = {
  destination: "", category: "", search: "",
  budgetMin: "", budgetMax: "", durationMin: "", durationMax: "", travelersCount: "",
};

const Filters = ({ onChange, defaultValues = {}, showSearch = false }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ ...initialState, ...defaultValues });
  const [debounced, setDebounced] = useState(filters);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(filters), 300);
    return () => clearTimeout(id);
  }, [filters]);

  useEffect(() => { onChange(debounced); }, [debounced, onChange]);

  const setField = (key) => (v) => setFilters((p) => ({ ...p, [key]: v }));
  const setDestination = setField("destination");
  const setSearch = setField("search");
  const toggleCategory = (v) =>
    setFilters((p) => ({ ...p, category: p.category === v ? "" : v }));
  const toggleTravelers = (v) =>
    setFilters((p) => ({ ...p, travelersCount: p.travelersCount === v ? "" : v }));

  const advancedCount = ["budgetMin", "budgetMax", "durationMin", "durationMax", "travelersCount"]
    .filter((key) => filters[key]).length;

  const clearAdvanced = () => setFilters((p) => ({
    ...p, budgetMin: "", budgetMax: "", durationMin: "", durationMax: "", travelersCount: "",
  }));

  return (
    <div className="filters">
      <div className="filters__main">
        <div className="filters__search">
          <IoSearchOutline className="filters__search-icon" />
          <input
            type="text"
            name="destination"
            placeholder={t("explore.searchByDestination")}
            value={filters.destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          {filters.destination && (
            <button
              type="button"
              className="filters__search-clear"
              onClick={() => setDestination("")}
              aria-label="Clear"
            >✕</button>
          )}
        </div>

        {showSearch && (
          <div className="filters__search">
            <IoSearchOutline className="filters__search-icon" />
            <input
              type="text"
              name="search"
              placeholder={t("explore.searchByKeyword")}
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {filters.search && (
              <button
                type="button"
                className="filters__search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear"
              >✕</button>
            )}
          </div>
        )}

        <button
          type="button"
          className="btn-toggle-filters"
          onClick={() => setShowMore((s) => !s)}
        >
          {t("explore.filters")}
          {advancedCount > 0 && <span className="filters__badge">{advancedCount}</span>}
        </button>
      </div>

      <div className="filters__categories">
        <button
          type="button"
          className={`filter-chip${filters.category === "" ? " filter-chip--active" : ""}`}
          onClick={() => toggleCategory("")}
        >
          {t("explore.all") || "All"}
        </button>
        {itineraryCategories.map((cat) => (
          <button
            type="button"
            key={cat.value}
            className={`filter-chip${filters.category === cat.value ? " filter-chip--active" : ""}`}
            onClick={() => toggleCategory(cat.value)}
            title={t(`createExperience.catDetails.${cat.value}`)}
          >
            {categoryEmojis[cat.value]} {cat.label}
          </button>
        ))}
      </div>

      {showMore && (
        <div className="filters__more">
          <div className="filter-group">
            <label>{t("explore.budget")}</label>
            <div className="filter-pair">
              <input
                type="number"
                min="0"
                placeholder={t("common.min")}
                value={filters.budgetMin}
                onChange={(e) => setField("budgetMin")(e.target.value)}
              />
              <span className="filter-pair__sep">–</span>
              <input
                type="number"
                min="0"
                placeholder={t("common.max")}
                value={filters.budgetMax}
                onChange={(e) => setField("budgetMax")(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>{t("explore.duration")}</label>
            <div className="filter-pair">
              <input
                type="number"
                min="1"
                placeholder={t("common.min")}
                value={filters.durationMin}
                onChange={(e) => setField("durationMin")(e.target.value)}
              />
              <span className="filter-pair__sep">–</span>
              <input
                type="number"
                min="1"
                placeholder={t("common.max")}
                value={filters.durationMax}
                onChange={(e) => setField("durationMax")(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group filter-group--full">
            <label>{t("explore.travelers")}</label>
            <div className="filter-chips-row">
              {TRAVELERS_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  className={`filter-chip${filters.travelersCount === opt ? " filter-chip--active" : ""}`}
                  onClick={() => toggleTravelers(opt)}
                >
                  {t(`explore.${opt}`)}
                </button>
              ))}
            </div>
          </div>

          {advancedCount > 0 && (
            <button type="button" className="btn-toggle-filters" onClick={clearAdvanced}>
              {t("explore.clearAdvanced")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Filters;
