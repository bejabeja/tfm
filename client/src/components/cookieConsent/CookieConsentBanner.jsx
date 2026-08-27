import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  denyCookieConsent,
  getCookieConsent,
  grantCookieConsent,
  REOPEN_COOKIE_PREFERENCES_EVENT,
} from "../../utils/analytics";
import "./CookieConsentBanner.scss";

const CookieConsentBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => getCookieConsent() === null);

  useEffect(() => {
    const reopen = () => setVisible(true);
    window.addEventListener(REOPEN_COOKIE_PREFERENCES_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_COOKIE_PREFERENCES_EVENT, reopen);
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    grantCookieConsent();
    setVisible(false);
  };

  const handleDecline = () => {
    denyCookieConsent();
    setVisible(false);
  };

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label={t("cookieConsent.title")}>
      <div className="cookie-consent__content">
        <p className="cookie-consent__text">
          {t("cookieConsent.description")}{" "}
          <Link to="/privacy-policy">{t("cookieConsent.learnMore")}</Link>
        </p>
        <div className="cookie-consent__actions">
          <button type="button" className="cookie-consent__decline" onClick={handleDecline}>
            {t("cookieConsent.decline")}
          </button>
          <button type="button" className="cookie-consent__accept" onClick={handleAccept}>
            {t("cookieConsent.accept")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
