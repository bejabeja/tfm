import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const handleInputChange = useCallback(
    (val, onChange) => {
      onChange({ name: val });
      debouncedSearch(val);
    },
    [debouncedSearch]
  );

  const handleSuggestionClick = useCallback((place, onChange) => {
    onChange(place);
    setSuggestions([]);
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
              onChange={(e) =>
                handleInputChange(e.target.value, field.onChange)
              }
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

            {(suggestions.length > 0 ||
              inputRef.current?.value.length >= 3) && (
              <ul className="autocomplete-dropdown">
                {suggestions.length > 0 ? (
                  suggestions.map((place, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleSuggestionClick(place, field.onChange)
                      }
                    >
                      {place.label}
                    </li>
                  ))
                ) : (
                  <li className="no-results">No results found</li>
                )}
              </ul>
            )}
          </>
        )}
      />
    </div>
  );
};

export default AutocompleteObjectInput;
