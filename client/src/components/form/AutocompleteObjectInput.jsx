import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { useGeocodeSearch } from "../../hooks/useGeocodeSearch";
import "./InputForm.scss";

const AutocompleteObjectInput = ({
  label,
  name,
  control,
  error,
  disabled = false,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const { searchPlaces } = useGeocodeSearch();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const debouncedSearch = useRef(
    debounce(async (val) => {
      if (val.length >= 3) {
        const results = await searchPlaces(val);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="autocomplete-input" ref={dropdownRef}>
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
              value={field.value?.name ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                field.onChange({ name: val });
                debouncedSearch(val);
              }}
              className={`input__field ${error ? "input__field--invalid" : ""}`}
              autoComplete="off"
              aria-invalid={!!error}
              ref={inputRef}
              disabled={disabled}
            />
            <div className="input__error">
              {error && !error?.label ? error.message : "\u00A0"}
              {error?.label
                ? "Please select a valid destination from the list"
                : "\u00A0"}
            </div>
            {suggestions.length > 0 && (
              <ul className="autocomplete-dropdown">
                {suggestions.map((place, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      field.onChange(place);
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

export default AutocompleteObjectInput;
