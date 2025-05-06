import { Link, useParams } from "react-router-dom";
import { useFollow } from "../../hooks/useFollow";
import { useProfileData } from "../../hooks/useProfileData";
import "./Follows.scss";

const FollowingList = () => {
  const { id } = useParams();
  const { following, loadingFollowing, error } = useProfileData(id);

  if (loadingFollowing) return <p>Loading...</p>;
  if (error) return <div>Error loading followings.</div>;

  return (
    <section className="follow-list section__container">
      <h2 className="follow-list__title">Following</h2>
      <div className="follow-list__grid">
        {following?.length === 0 ? (
          <p>No followings to show.</p>
        ) : (
          following?.map((user) => <UserCard key={user.id} user={user} />)
        )}
      </div>
    </section>
  );
};

export default FollowingList;

const UserCard = ({ user }) => {
  const { toggleFollow } = useFollow(user.id);

  const handleUnfollowClick = (e) => {
    e.preventDefault();
    toggleFollow();
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${user.id}`} className="user-card__link">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="user-card__avatar"
        />
        <div className="user-card__info">
          <h3 className="user-card__name">{user.name}</h3>
          <p className="user-card__username">@{user.username}</p>
        </div>
      </Link>
      <button className="btn btn__danger-outline" onClick={handleUnfollowClick}>
        Unfollow
      </button>
    </div>
  );
};
