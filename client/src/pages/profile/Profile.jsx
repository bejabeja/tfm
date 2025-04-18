import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { getUserById } from "../../services/user";
import "./Profile.scss";

const Profile = ({ isMyProfile }) => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(id);
        setUserData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <section className="profile section__container">
      <HeaderSection userData={userData} isMyProfile={isMyProfile} />

      <AboutSection userData={userData} />

      <ItinerariesSection itineraries={userData?.itineraries} />
    </section>
  );
};

export default Profile;

const HeaderSection = ({ userData, isMyProfile }) => {
  return (
    <div className="profile__header">
      <div className="profile__header-main-content">
        <img
          className="profile__header-image"
          src={userData?.avatarUrl}
          alt="Profile"
        />
        <div className="profile__header-info">
          <h1 className="profile__header-info-name">{userData?.name}</h1>
          <h2 className="profile__header-info-username">
            @{userData?.username}
          </h2>
          <div className="profile__header-info-stats">
            <p>
              <strong>{userData?.followers}</strong> followers
            </p>
            <p>
              <strong>{userData?.following}</strong> following
            </p>
            <p>
              <strong>{userData?.tripsShared}</strong> itineraries
            </p>
          </div>
          <p className="profile__header-info-bio">{userData?.bio}</p>
        </div>
      </div>
      <div className="profile__header-actions">
        {isMyProfile ? (
          <Link
            to={`/edit-profile/${userData?.id}/me`}
            className="btn btn-primary"
          >
            Edit Profile
          </Link>
        ) : (
          <button className="btn btn-primary">
            {userData?.isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
};

const AboutSection = ({ userData }) => {
  return (
    <div className="profile__about">
      <h2 className="profile__about-title">About</h2>

      <div className="profile__about-content">
        <p className="profile__about-content-description">{userData?.about}</p>
        <div className="profile__about-content-stats">
          <p className="profile__about-content-stats-location">
            <IoLocationOutline className="nav-icon" />
            <span>{userData?.location}</span>
          </p>
          <p className="profile__about-content-stats-created-at">
            <MdOutlineCalendarMonth className="nav-icon" />
            <span>{userData?.createdAt}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const ItinerariesSection = ({ itineraries }) => {
  return (
    <div className="profile__itineraries">
      <h2 className="profile__itineraries-title">Shared Itineraries</h2>

      <p>No itineraries shared yet.</p>
    </div>
  );
};
