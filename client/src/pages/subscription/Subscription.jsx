import toast from "react-hot-toast";
import { IoCheckmarkCircle, IoSparkles } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectIsAuthenticated } from "../../store/auth/authSelectors";
import { selectMe } from "../../store/user/userInfoSelectors";
import "./Subscription.scss";

const PREMIUM_FEATURE_KEYS = ["nav.vanLog", "nav.supplies", "nav.packingChecklist", "nav.lifeDiary"];

const PLANS = [
  {
    id: "monthly",
    nameKey: "subscription.monthlyPlanName",
    priceKey: "subscription.monthlyPriceAmount",
    periodKey: "subscription.monthlyPricePeriod",
  },
  {
    id: "annual",
    nameKey: "subscription.annualPlanName",
    priceKey: "subscription.annualPriceAmount",
    periodKey: "subscription.annualPricePeriod",
    badgeKey: "subscription.annualBadge",
    highlighted: true,
  },
];

const Subscription = () => {
  const { t } = useTranslation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userMe = useSelector(selectMe);
  const isPremium = !!userMe?.isPremium;

  const handleSubscribeClick = () => toast(t("subscription.comingSoonToast"));

  return (
    <section className="subscription">
      <header className="subscription__header">
        <IoSparkles className="subscription__hero-icon" aria-hidden="true" />
        <h1 className="subscription__title">{t("subscription.title")}</h1>
        <p className="subscription__subtitle">{t("subscription.subtitle")}</p>
      </header>

      {isPremium ? (
        <div className="subscription__already-premium">
          <IoCheckmarkCircle className="subscription__already-premium-icon" aria-hidden="true" />
          <h2>{t("subscription.alreadyPremiumTitle")}</h2>
          <p>{t("subscription.alreadyPremiumDesc")}</p>
        </div>
      ) : (
        <>
          <div className="subscription__plans">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`subscription__plan${plan.highlighted ? " subscription__plan--highlighted" : ""}`}
              >
                {plan.badgeKey && <span className="subscription__plan-badge">{t(plan.badgeKey)}</span>}
                <p className="subscription__plan-name">{t(plan.nameKey)}</p>
                <p className="subscription__price">
                  <span className="subscription__price-amount">{t(plan.priceKey)}</span>
                  <span className="subscription__price-period">{t(plan.periodKey)}</span>
                </p>

                {isAuthenticated ? (
                  <button type="button" className="btn btn--primary subscription__cta" onClick={handleSubscribeClick}>
                    {t("subscription.ctaSubscribe")}
                  </button>
                ) : (
                  <Link to="/register" className="btn btn--primary subscription__cta">
                    {t("subscription.ctaCreateAccount")}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <p className="subscription__features-title">{t("subscription.featuresTitle")}</p>
          <ul className="subscription__features">
            {PREMIUM_FEATURE_KEYS.map((key) => (
              <li key={key}>
                <IoCheckmarkCircle className="subscription__feature-icon" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
            <li>
              <IoCheckmarkCircle className="subscription__feature-icon" aria-hidden="true" />
              {t("subscription.featureAiItineraries")}
            </li>
          </ul>
        </>
      )}
    </section>
  );
};

export default Subscription;
