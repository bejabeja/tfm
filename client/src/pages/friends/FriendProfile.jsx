import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { useParams } from "react-router-dom";
import { getUserById } from "../../services/user";
import "./FriendProfile.scss";

const FriendProfile = () => {
  const { id } = useParams();
  const [friendData, setFriendData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const response = await getUserById(id);
        setFriendData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFriendData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <section className="friend-profile section__container">
      <div className="friend-profile__header">
        <img
          className="friend-profile__header-image"
          src={friendData?.avatarUrl}
          alt="Profile"
        />
        <div className="friend-profile__header-info">
          <h1 className="friend-profile__header-info-name">
            {friendData?.name}
          </h1>
          <h2 className="friend-profile__header-info-username">
            @{friendData?.username}
          </h2>
          <div className="friend-profile__header-info-stats">
            <p>
              <strong>{friendData?.followers}</strong> followers
            </p>
            <p>
              <strong>{friendData?.following}</strong> following
            </p>
            <p>
              <strong>{friendData?.tripsShared}</strong> itineraries
            </p>
          </div>
          <p className="friend-profile__header-info-bio">{friendData?.bio}</p>
        </div>
        <div className="friend-profile__header-actions">
          <button className="btn btn-primary">
            {friendData?.isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>

      <div className="friend-profile__about">
        <h2 className="friend-profile__about-title">About</h2>

        <div className="friend-profile__about-content">
          <p className="friend-profile__about-content-description">
            {friendData?.about}
          </p>
          <div className="friend-profile__about-content-stats">
            <p className="friend-profile__about-content-stats-location">
              <IoLocationOutline className="nav-icon" />
              <span>{friendData?.location}</span>
            </p>
            <p className="friend-profile__about-content-stats-created-at">
              <MdOutlineCalendarMonth className="nav-icon" />
              <span>{friendData?.createdAt}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="friend-profile__itineraries">
        <h2 className="friend-profile__itineraries-title">
          Shared Itineraries
        </h2>

        <p>No itineraries shared yet.</p>
      </div>
    </section>
  );
};

export default FriendProfile;
