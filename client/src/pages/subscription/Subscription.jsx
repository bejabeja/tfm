import toast from "react-hot-toast";
import { IoCheckmarkCircle, IoSparkles } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectIsAuthenticated } from "../../store/auth/authSelectors";
import { selectMe } from "../../store/user/userInfoSelectors";
import "./Subscription.scss";

// The emoji itself is the icon (in the colored badge), so titles here are
// plain text, separate from the nav.* labels used in the sidebar/account
// page (a nav item shouldn't be this playful, but a pricing page can be).
const PREMIUM_FEATURES = [
  { key: "subscription.featureVanLogTitle", descriptionKey: "subscription.featureVanLogDesc", emoji: "🚐", color: "#E8743B" },
  { key: "subscription.featureSuppliesTitle", descriptionKey: "subscription.featureSuppliesDesc", emoji: "🛒", color: "#2E86AB" },
  { key: "subscription.featurePackingChecklistTitle", descriptionKey: "subscription.featurePackingChecklistDesc", emoji: "🎒", color: "#6B4C9A" },
  { key: "subscription.featureLifeDiaryTitle", descriptionKey: "subscription.featureLifeDiaryDesc", emoji: "📖", color: "#C2447B" },
  { key: "subscription.featureAiItineraries", descriptionKey: "subscription.featureAiItinerariesDesc", emoji: "✨", color: "#1A535C" },
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
    <div className="subscription">
      {/* Full-bleed hero band, same pattern as Explore's/Home's, so this page
          gets the same "arrival moment" instead of just being plain text. */}
      <header className="subscription__hero">
        <IoSparkles className="subscription__hero-icon" aria-hidden="true" />
        <h1 className="subscription__title">{t("subscription.title")}</h1>
        <p className="subscription__subtitle">{t("subscription.subtitle")}</p>

        {!isPremium && (
          isAuthenticated ? (
            <button type="button" className="btn btn--primary subscription__trial-cta" onClick={handleSubscribeClick}>
              {t("subscription.ctaFreeTrial")}
            </button>
          ) : (
            <Link to="/register" className="btn btn--primary subscription__trial-cta">
              {t("subscription.ctaFreeTrial")}
            </Link>
          )
        )}
      </header>

      <section className="subscription__content section__container">
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
            {PREMIUM_FEATURES.map(({ key, descriptionKey, emoji, color }) => (
              <li key={key} className="subscription__feature">
                <span className="subscription__feature-icon-badge" style={{ background: `${color}1A` }} aria-hidden="true">
                  {emoji}
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

          <p className="subscription__disclaimer">{t("subscription.disclaimer")}</p>
        </>
      )}
      </section>
    </div>
  );
};

export default Subscription;
