import { useTranslation } from "react-i18next";
import { IoAlertCircleOutline, IoLockClosedOutline } from "react-icons/io5";
import "./FeatureLoadState.scss";

// Shown instead of a feature's normal empty/error state when the list failed
// to load, so a 403 (premium required) doesn't look like a generic error.
const FeatureLoadState = ({ status, onRetry }) => {
  const { t } = useTranslation();

  if (status === "premium") {
    return (
      <div className="feature-load-state">
        <IoLockClosedOutline className="feature-load-state__icon" />
        <p className="feature-load-state__title">{t("premium.requiredTitle")}</p>
        <p className="feature-load-state__desc">{t("premium.requiredDesc")}</p>
      </div>
    );
  }

  return (
    <div className="feature-load-state">
      <IoAlertCircleOutline className="feature-load-state__icon" />
      <p className="feature-load-state__title">{t("premium.loadErrorDesc")}</p>
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          {t("common.retry")}
        </button>
      )}
    </div>
  );
};

export default FeatureLoadState;
