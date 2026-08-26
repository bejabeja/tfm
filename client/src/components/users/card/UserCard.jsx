import { useNavigate } from "react-router-dom";
import { optimizedCloudinaryUrl } from "../../../utils/cloudinaryUrl";
import OfficialBadge from "../OfficialBadge";

const UserCard = ({
  id,
  username,
  location,
  totalItineraries,
  avatarUrl,
  lastItinerary,
  isAuthenticated,
  isFollowing,
  onFollowToggle,
  role,
}) => {
  const navigate = useNavigate();
  const handleFollow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    onFollowToggle(id, isFollowing);
  };

  const handleProfile = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/friend-profile/${id}`);
  };

  return (
    <div className="user-card" onClick={handleProfile}>
      <div className="user-card__banner">
        {lastItinerary?.photoUrl && (
          <img
            src={optimizedCloudinaryUrl(lastItinerary.photoUrl, { width: 480 })}
            alt={`Cover photo of @${username}'s trip${lastItinerary.title ? `: ${lastItinerary.title}` : ""}`}
            loading="lazy"
            className="user-card__banner-img"
          />
        )}
        <img
          src={optimizedCloudinaryUrl(avatarUrl, { width: 96 })}
          alt={username}
          loading="lazy"
          className="user-card__image"
        />
      </div>
      <div className="user-card__body">
        <div className="user-card__name-row">
          <h3 className="user-card__name">@{username}{role === "official" && <OfficialBadge size={14} />}</h3>
          <button
            className={`user-card__follow-btn ${isFollowing ? "following" : ""}`}
            onClick={(e) => { e.stopPropagation(); handleFollow(); }}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
        {location?.name && (
          <p className="user-card__location">{location.name}</p>
        )}
        {lastItinerary?.title && (
          <p className="user-card__last-trip">Last trip: {lastItinerary.title}</p>
        )}
        <p className="user-card__trips">{totalItineraries} itineraries</p>
      </div>
    </div>
  );

};

export default UserCard;
