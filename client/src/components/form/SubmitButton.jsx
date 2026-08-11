import { useTranslation } from "react-i18next";

const SubmitButton = ({ label, loading = false, disabled = false }) => {
  const { t } = useTranslation();
  const isDisabled = loading || disabled;
  return (
    <button
      type="submit"
      className="btn btn--primary"
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
    >
      {loading ? t("common.loading") : label}
    </button>
  );
};

export default SubmitButton;
