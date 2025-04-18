import { Controller } from "react-hook-form";
import "./InputForm.scss";

const InputForm = ({ label, name, control, error, type = "text" }) => {
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

export default InputForm;
