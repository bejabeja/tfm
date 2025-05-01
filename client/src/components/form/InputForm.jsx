import { Controller } from "react-hook-form";
import "./InputForm.scss";

export const InputForm = ({ label, name, control, error, type = "text" }) => {
  return (
    <div className="input">
      <label htmlFor={name} className="input__label">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type={type}
            {...field}
            className={`input__field ${error ? "input__field--invalid" : ""}`}
          />
        )}
      />
      <div className="input__error">{error ? error.message : "\u00A0"}</div>
    </div>
  );
};

export const TextAreaForm = ({
  label,
  name,
  control,
  error,
  type = "text",
}) => {
  return (
    <div className="input">
      <label htmlFor={name} className="input__label">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            id={name}
            type={type}
            {...field}
            className={`input__field ${error ? "input__field--invalid" : ""}`}
          />
        )}
      />
      <div className="input__error">{error ? error.message : "\u00A0"}</div>
    </div>
  );
};

export const DropdownForm = ({ label, name, control, error, options }) => {
  return (
    <div className="input">
      <label htmlFor={name} className="input__label">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            id={name}
            {...field}
            className={`input__field ${error ? "input__field--invalid" : ""}`}
          >
            <option value="" disabled>
              Select an option
            </option>
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      />
      <div className="input__error">{error ? error.message : "\u00A0"}</div>
    </div>
  );
};
