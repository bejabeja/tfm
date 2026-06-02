import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const MAX_TRAVELLERS = 20;

const TravellersForm = ({ control }) => {
  const { t } = useTranslation();
  const f = (key, vars) => t(`itineraryForm.${key}`, vars);

  return (
    <div className="form__travellers">
      <h2 className="form__subtitle">{f("travellers")}</h2>
      <Controller
        name="numberOfTravellers"
        control={control}
        render={({ field }) => {
          const value = parseInt(field.value) || 1;
          return (
            <div className="form__travellers-row">
              <div className="form__stepper">
                <button
                  type="button"
                  className="form__stepper-btn"
                  onClick={() => field.onChange(Math.max(1, value - 1))}
                  disabled={value <= 1}
                  aria-label={f("travellers") + " −"}
                >
                  −
                </button>
                <span className="form__stepper-value">{value}</span>
                <button
                  type="button"
                  className="form__stepper-btn"
                  onClick={() => field.onChange(Math.min(MAX_TRAVELLERS, value + 1))}
                  disabled={value >= MAX_TRAVELLERS}
                  aria-label={f("travellers") + " +"}
                >
                  +
                </button>
              </div>
              <span className="form__travellers-label">
                {value === 1 ? f("travellingSolo") : f("groupOf", { count: value })}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
};

export default TravellersForm;
