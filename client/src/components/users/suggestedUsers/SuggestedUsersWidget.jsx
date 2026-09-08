import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSuggestedUsers } from "@tobeatraveller/shared";
import { useFollow } from "../../../hooks/useFollow";
import { generateAvatar } from "../../../utils/constants/constants";
import "./SuggestedUsersWidget.scss";

// Matches userRepository.findSuggested()'s own LIMIT 8: no point asking
// for fewer than the backend already returns.
const VISIBLE_COUNT = 8;

const SuggestedUsersWidget = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuggestedUsers()
      .then((data) => setUsers(data ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && users?.length === 0) return null;

  return (
    <div className="suggested-users">
      <div className="suggested-users__header">
        <h2 className="suggested-users__title">{t("profile.peopleToFollow")}</h2>
        <Link to="/community" className="suggested-users__see-more">{t("profile.seeMorePeople")}</Link>
      </div>
      <div className="suggested-users__list">
        {loading
          ? Array.from({ length: VISIBLE_COUNT }, (_, i) => <SuggestedUserRowSkeleton key={i} />)
          : users.slice(0, VISIBLE_COUNT).map((user) => (
              <SuggestedUserRow key={user.id} user={user} />
            ))}
      </div>
    </div>
  );
};

const SuggestedUserRow = ({ user }) => {
  const { isFollowing, toggleFollow, isLoadingFollow } = useFollow(user.id);
  const { t } = useTranslation();

  return (
    <div className="suggested-users__card">
      <Link to={`/friend-profile/${user.id}`} className="suggested-users__user">
        <img
          className="suggested-users__avatar"
          src={user.avatarUrl || generateAvatar(user.username)}
          alt={user.username}
          onError={(e) => { e.currentTarget.src = generateAvatar(user.username); }}
        />
        <span className="suggested-users__username">@{user.username}</span>
        {user.location?.name && (
          <span className="suggested-users__location">{user.location.name}</span>
        )}
      </Link>
      <button
        className={`btn suggested-users__follow-btn${isFollowing ? " btn--secondary" : " btn--primary"}`}
        onClick={toggleFollow}
        disabled={isLoadingFollow}
      >
        {isLoadingFollow ? "…" : isFollowing ? t("profile.unfollow") : t("profile.follow")}
      </button>
    </div>
  );
};

const SuggestedUserRowSkeleton = () => (
  <div className="suggested-users__card">
    <div className="suggested-users__user">
      <div className="skeleton suggested-users__avatar" />
      <div className="skeleton" style={{ width: 70, height: 12, borderRadius: 6 }} />
      <div className="skeleton" style={{ width: 50, height: 11, borderRadius: 6, marginTop: 4 }} />
    </div>
    <div className="skeleton" style={{ width: "100%", height: 30, borderRadius: 999 }} />
  </div>
);

export default SuggestedUsersWidget;
