import { Controller } from "react-hook-form";

const InputForm = ({ label, name, control, error, type }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type={type}
            {...field}
            className={`form-control ${error ? "is-invalid" : ""}`}
          />
        )}
      ></Controller>
      {error && <div className="error">{error.message}</div>}
    </div>
  );
};

export default InputForm;
