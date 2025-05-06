import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useGeocodeSearch } from "../../hooks/useGeocodeSearch";

const AutocompleteInput = ({ label, value, onChange, error, cityContext }) => {
  const [suggestions, setSuggestions] = useState([]);
  const { searchPlaces } = useGeocodeSearch();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const debouncedSearch = debounce(async (val) => {
    const results = await searchPlaces(val, cityContext);
    setSuggestions(results);
  }, 300);

  const handleInputChange = async (e) => {
    const val = e.target.value;
    onChange(val);
    if (val.length >= 3) {
      debouncedSearch(val);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (place) => {
    onChange(place.name);
    setSuggestions([]);
  };

  useEffect(() => {
    // const handleClickOutside = (event) => {
    //   if (
    //     dropdownRef.current &&
    //     !dropdownRef.current.contains(event.target) &&
    //     !inputRef.current.contains(event.target)
    //   ) {
    //     setSuggestions([]);
    //   }
    // };
    // document.addEventListener("mousedown", handleClickOutside);
    return () => {
    //   document.removeEventListener("mousedown", handleClickOutside);
      debouncedSearch.cancel();
    };
  }, []);

  return (
    <div className="autocomplete-input">
      <label htmlFor="autocomplete" className="input__label">
        {label}
      </label>
      <input
        id="autocomplete"
        type="text"
        value={value}
        ref={inputRef}
        onChange={handleInputChange}
        className={`input__field ${error ? "input__field--invalid" : ""}`}
        autoComplete="off"
      />
      <div className="input__error">{error ? error.message : "\u00A0"}</div>
      {suggestions.length > 0 && (
        <ul className="autocomplete-dropdown" ref={dropdownRef}>
          {suggestions.map((place, index) => (
            <li key={index} onClick={() => handleSelect(place)}>
              {place.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
