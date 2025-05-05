import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import ItinerariesSection from "../../components/itineraries/ItinerariesSection";
import { useFollow } from "../../hooks/useFollow";
import { useProfileData } from "../../hooks/useProfileData";
import "./Profile.scss";
import Spinner from '../../components/spinner/Spinner'

const Profile = () => {
  const { id } = useParams();
  const { user, myItineraries, loading, error, isMyProfile } =
    useProfileData(id);
  const { isFollowing, handleFollowToggle } = useFollow(id);

  if (loading) return <Spinner />;
  if (error) return <div>Error fetching data</div>;

  return (
    <section className="profile section__container">
      <HeaderSection
        user={user}
        isMyProfile={isMyProfile}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
      />
      <AboutSection user={user} />
      <ItinerariesSection
        user={user}
        itineraries={myItineraries.data}
        title="Shared Itineraries"
        isLoading={myItineraries.loading}
      />
    </section>
  );
};

export default Profile;

const HeaderSection = ({ user, isMyProfile, isFollowing, onFollowToggle }) => {
  return (
    <div className="profile__header">
      <div className="profile__header-main-content">
        <img
          className="profile__header-image"
          src={user?.avatarUrl}
          alt="Profile"
        />
        <div className="profile__header-info">
          <h1 className="profile__header-info-name">{user?.name}</h1>
          <h2 className="profile__header-info-username">@{user?.username}</h2>
          <div className="profile__header-info-stats">
            <p>
              <strong>{user?.followers}</strong> followers
            </p>
            <p>
              <strong>{user?.following}</strong> following
            </p>
            <p>
              <strong>{user?.totalItineraries}</strong> itineraries
            </p>
          </div>
          <p className="profile__header-info-bio">{user?.bio}</p>
        </div>
      </div>
      <div className="profile__header-actions">
        {isMyProfile ? (
          <Link to={`/profile/edit/${user?.id}`} className="btn btn__primary">
            Edit Profile
          </Link>
        ) : (
          <button className="btn btn__primary" onClick={onFollowToggle}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
};

const AboutSection = ({ user }) => (
  <div className="profile__about">
    <h2 className="profile__about-title">About</h2>
    <div className="profile__about-content">
      <p className="profile__about-content-description">{user?.about}</p>
      <div className="profile__about-content-stats">
        <p className="profile__about-content-stats-location">
          <IoLocationOutline className="nav-icon" />
          <span>{user?.location}</span>
        </p>
        <p className="profile__about-content-stats-created-at">
          <MdOutlineCalendarMonth className="nav-icon" />
          <span>{user?.createdAt}</span>
        </p>
      </div>
    </div>
  </div>
);
