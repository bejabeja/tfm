import { useState } from "react";
import { Controller } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export const PasswordInputForm = ({ label, name, control, error, hint, autoComplete }) => {
  const { t } = useTranslation();
  const errorId = `${name}-error`;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-password input">
      <label htmlFor={name} className="input__label">
        {label}
      </label>
      <div className="input-password__wrapper">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              id={name}
              type={showPassword ? "text" : "password"}
              autoComplete={autoComplete}
              {...field}
              className={`input__field ${error ? "input__field--invalid" : ""}`}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            />
          )}
        />
        <button
          type="button"
          className="input-password__toggle"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
          title={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {hint && !error && <p className="input-password__hint">{hint}</p>}
      <div
        className="input__error"
        id={errorId}
        role="alert"
        aria-live="assertive"
      >
        {error ? error.message : "\u00A0"}
      </div>
    </div>
  );
};
