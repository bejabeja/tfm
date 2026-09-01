import {
  IoBookOutline,
  IoBriefcaseOutline,
  IoCardOutline,
  IoCartOutline,
  IoChevronForward,
  IoJournalOutline,
  IoListOutline,
  IoSaveOutline,
  IoSettingsOutline,
  IoSparkles,
} from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/spinner/Spinner";
import { selectMe } from "../../store/user/userInfoSelectors";
import { generateAvatar } from "../../utils/constants/constants";
import { optimizedCloudinaryUrl } from "../../utils/cloudinaryUrl";
import "./Account.scss";

const Account = () => {
  const { t } = useTranslation();
  const userMe = useSelector(selectMe);

  if (!userMe) return <Spinner />;

  const isPremium = !!userMe.isPremium;

  const links = [
    { to: `/profile/${userMe.id}`, Icon: GoPerson, label: t("nav.profile") },
    { to: "/my-itineraries", Icon: IoListOutline, label: t("nav.myTrips") },
    { to: "/itineraries/saved", Icon: IoSaveOutline, label: t("nav.savedTrips") },
    { to: "/van-log", Icon: IoBookOutline, label: t("nav.vanLog"), premium: true },
    { to: "/supplies", Icon: IoCartOutline, label: t("nav.supplies"), premium: true },
    { to: "/packing-checklist", Icon: IoBriefcaseOutline, label: t("nav.packingChecklist"), premium: true },
    { to: "/life-diary", Icon: IoJournalOutline, label: t("nav.lifeDiary"), premium: true },
    { to: "/settings", Icon: IoSettingsOutline, label: t("settings.title") },
  ];

  return (
    <section className="account">
      <header className="account__header">
        <img
          src={optimizedCloudinaryUrl(userMe.avatarUrl, { width: 64 }) || generateAvatar(userMe.username)}
          alt={userMe.username}
          className="account__avatar"
        />
        <div>
          <p className="account__username">@{userMe.username}</p>
          {isPremium && <span className="account__premium-badge">{t("admin.premium")}</span>}
        </div>
      </header>

      {!isPremium && (
        <Link to="/subscription" className="account__upsell">
          <IoSparkles className="account__upsell-icon" aria-hidden="true" />
          <div>
            <p className="account__upsell-title">{t("subscription.title")}</p>
            <p className="account__upsell-desc">{t("subscription.subtitle")}</p>
          </div>
          <IoChevronForward className="account__upsell-arrow" aria-hidden="true" />
        </Link>
      )}
      {isPremium && (
        <Link to="/subscription" className="account__upsell account__upsell--premium">
          <IoCardOutline className="account__upsell-icon" aria-hidden="true" />
          <div>
            <p className="account__upsell-title">{t("subscription.manageLink")}</p>
          </div>
          <IoChevronForward className="account__upsell-arrow" aria-hidden="true" />
        </Link>
      )}

      <ul className="account__links">
        {links.map(({ to, Icon, label, premium }) => (
          <li key={to}>
            <Link to={to} className="account__link">
              <Icon className="account__link-icon" aria-hidden="true" />
              <span className="account__link-label">{label}</span>
              {premium && !isPremium && (
                <span className="account__link-badge">{t("admin.premium")}</span>
              )}
              <IoChevronForward className="account__link-arrow" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Account;
