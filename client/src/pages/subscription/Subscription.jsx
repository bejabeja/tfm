import toast from "react-hot-toast";
import {
  IoBookOutline,
  IoBriefcaseOutline,
  IoCartOutline,
  IoCheckmarkCircle,
  IoFlashOutline,
  IoJournalOutline,
  IoSparkles,
} from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectIsAuthenticated } from "../../store/auth/authSelectors";
import { selectMe } from "../../store/user/userInfoSelectors";
import "./Subscription.scss";

// Same icons already used for these features elsewhere (Navbar, Account), so
// a premium feature reads as the same thing wherever it shows up in the app.
const PREMIUM_FEATURES = [
  { key: "nav.vanLog", descriptionKey: "subscription.featureVanLogDesc", Icon: IoBookOutline },
  { key: "nav.supplies", descriptionKey: "subscription.featureSuppliesDesc", Icon: IoCartOutline },
  { key: "nav.packingChecklist", descriptionKey: "subscription.featurePackingChecklistDesc", Icon: IoBriefcaseOutline },
  { key: "nav.lifeDiary", descriptionKey: "subscription.featureLifeDiaryDesc", Icon: IoJournalOutline },
  { key: "subscription.featureAiItineraries", descriptionKey: "subscription.featureAiItinerariesDesc", Icon: IoFlashOutline },
];

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
    <section className="subscription section__container">
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
          <p className="subscription__features-title">{t("subscription.featuresTitle")}</p>
          <ul className="subscription__features">
            {PREMIUM_FEATURES.map(({ key, descriptionKey, Icon }) => (
              <li key={key} className="subscription__feature">
                <span className="subscription__feature-icon-badge">
                  <Icon className="subscription__feature-icon" aria-hidden="true" />
                </span>
                <span className="subscription__feature-text">
                  <strong>{t(key)}</strong>
                  <span>{t(descriptionKey)}</span>
                </span>
              </li>
            ))}
          </ul>

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
        </>
      )}
    </section>
  );
};

export default Subscription;
