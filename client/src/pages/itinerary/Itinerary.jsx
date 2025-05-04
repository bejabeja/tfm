import React, { useEffect, useState } from "react";
import { FaCity } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { MdOutlineAttachMoney, MdOutlineCalendarMonth } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getCategoryIcon } from "../../assets/icons.js";
import Spinner from "../../components/spinner/Spinner.jsx";
import { deleteItinerary, getItineraryById } from "../../services/itinerary.js";
import { getUserById } from "../../services/user.js";
import { setUserInfo } from "../../store/user/userInfoActions.js";
import { getCurrencySymbol } from "../../utils/constants/currencies.js";
import "./Itinerary.scss";

const Itinerary = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { me } = useSelector((state) => state.myInfo);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userItinerary, setUserItinerary] = useState(null);
  const userInfo = me.data;
  
  useEffect(() => {
    const fetchItinerary = async () => {
      setLoading(true);
      try {
        const response = await getItineraryById(id);
        setItinerary(response);
      } catch (error) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  useEffect(() => {
    if (!itinerary?.userId) {
      return;
    }
    const fecthUser = async () => {
      const response = await getUserById(itinerary.userId);
      setUserItinerary(response);
    };

    fecthUser();
  }, [itinerary?.userId]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  const handleRemove = async () => {
    await deleteItinerary(itinerary.id);
    dispatch(setUserInfo(itinerary?.userId));
  };

  const isMyItinerary = () => {
    if (!userInfo || !itinerary) return false;

    return userInfo.id === itinerary.userId;
  };

  return (
    <section className="itinerary break-text">
      <div
        className="itinerary__hero"
        style={{
          backgroundImage: `url(${itinerary.photoUrl || "/images/hero.jpg"})`,
        }}
      >
        <div className="itinerary__hero-overlay" />
        <div className="itinerary__hero-content">
          <h1 className="itinerary__title">
            {itinerary.title}
            {"   "}
            {itinerary.category !== "other" && (
              <span className="itinerary__badge">{itinerary.category}</span>
            )}
          </h1>
          <div className="itinerary__hero-content-stats">
            <div className="itinerary__hero-content-stats-row">
              <img
                src={userItinerary?.avatarUrl}
                alt={userItinerary?.location}
                className="itinerary__hero-image"
              />
              <span>@{userItinerary?.username}</span>
            </div>

            <div className="itinerary__hero-content-stats-row">
              <MdOutlineCalendarMonth className="nav-icon" />
              <span>{itinerary.tripDates}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="itinerary__container section__container">
        <div className="itinerary__container-primary">
          <h1 className="itinerary__title">Description</h1>
          <p className="itinerary__description">{itinerary.description}</p>
          <div className="itinerary__container-primary-stats">
            <div className="itinerary__container-stats-budget">
              {getCurrencySymbol(itinerary.currency) ?? (
                <MdOutlineAttachMoney className="icon" />
              )}
              <strong className="itinerary__title">Budget</strong>
              <p className="itinerary__description">
                {itinerary.budget} {itinerary.currency}
              </p>
            </div>
            <div className="itinerary__container-stats-days">
              <MdOutlineCalendarMonth className="icon" />
              <strong className="itinerary__title">Travel days</strong>
              <p className="itinerary__description">
                {itinerary.tripTotalDays}
              </p>
            </div>
            <div className="itinerary__container-stats-people">
              <GoPeople className="icon" />
              <strong className="itinerary__title">People</strong>
              <p className="itinerary__description">
                {itinerary.numberOfPeople}
              </p>
            </div>
          </div>
          <div className="itinerary__container-primary-places">
            <h1 className="itinerary__title">Places</h1>
            {itinerary.places.map((place, index) => (
              <Place key={place.id} place={place} index={index} />
            ))}
          </div>
          {isMyItinerary() && (
            <div className="itinerary__container-primary-actions">
              <Link
                to={`/profile/${userInfo.id}`}
                className="btn btn__danger"
                onClick={handleRemove}
              >
                Delete
              </Link>
              <Link
                to={`/itinerary/edit/${itinerary.id}`}
                className="btn btn__primary"
              >
                Edit
              </Link>
            </div>
          )}
        </div>
        <div className="itinerary__container-secondary">
          {/* <h1 className="itinerary__title">Trip Area</h1> */}
        </div>
      </div>
    </section>
  );
};

const Place = ({ place, index }) => {
  const Icon = getCategoryIcon(place.category) || FaCity;
  return (
    <div className="place">
      <h3 className="place__title ">
        Place {index + 1} : {place.title}
      </h3>
      <div className="place__info">
        <div className="place__info-left">
          <Icon className="icon" />
        </div>
        <div className="place__info-right">
          <p className="place__description">{place.description}</p>
        </div>
      </div>
      {place.address && (
        <p className="place__address">
          <span className="place__address-title">
            <strong>Address: </strong>
          </span>
          {place.address}
        </p>
      )}
    </div>
  );
};

export default Itinerary;
