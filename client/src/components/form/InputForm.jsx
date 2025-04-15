import { Controller } from "react-hook-form";
import "./FormComponents.css";

const InputForm = ({ label, name, control, error, type }) => {
  return (
    <div className="input-form">
      <label htmlFor={name} className="input-form__label">
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
            className={`input-form__input ${
              error ? "input-form__input--invalid" : ""
            }`}
          />
        )}
      />
      <div className="input-form__error">
        {error ? error.message : "\u00A0" /* non-breaking space */}
      </div>
    </div>
  );
};

export default InputForm;
