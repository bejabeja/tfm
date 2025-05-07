import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { useGeocodeSearch } from "../../hooks/useGeocodeSearch";
import "./InputForm.scss";

const AutocompleteStringInput = ({
  label,
  name,
  control,
  error,
  destination,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const { searchPlaces } = useGeocodeSearch();
  const inputRef = useRef(null);

  const debouncedSearch = useRef(
    debounce(async (val) => {
      if (val.length >= 3) {
        const results = await searchPlaces(val, destination);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 600)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  
  return (
    <div className="autocomplete-input">
      <label htmlFor={name} className="input__label">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              id={name}
              type="text"
              value={field.value ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                field.onChange(val);
                debouncedSearch(val);
              }}
              className={`input__field ${error ? "input__field--invalid" : ""}`}
              autoComplete="off"
              aria-invalid={!!error}
              disabled={!destination.name}
              ref={inputRef}
            />
            <div className="input__error">
              {error && destination.name ? error.message : "\u00A0"}
              {error && !destination.name
                ? "Please select a valid destination first"
                : ""}
            </div>

            {suggestions.length > 0 && (
              <ul className="autocomplete-dropdown">
                {suggestions.map((place, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      field.onChange(place.label); // solo string
                      setSuggestions([]);
                    }}
                  >
                    {place.label}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      />
    </div>
  );
};

export default AutocompleteStringInput;
