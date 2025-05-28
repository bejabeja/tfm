import { useEffect, useState } from "react";
import {
  FaBookmark,
  FaCity,
  FaEdit,
  FaRegBookmark,
  FaTrashAlt,
} from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { MdOutlineAttachMoney, MdOutlineCalendarMonth } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCategoryIcon } from "../../assets/icons.js";
import Modal from "../../components/modal/Modal.jsx";
import Spinner from "../../components/spinner/Spinner.jsx";
import {
  addFavorite,
  checkIsFavorite,
  removeFavorite,
} from "../../services/favorites.js";
import { deleteItinerary, getItineraryById } from "../../services/itinerary.js";
import { getUserById } from "../../services/users.js";
import { selectIsAuthenticated } from "../../store/auth/authSelectors";
import {
  setUserInfo,
  setUserInfoItineraries,
} from "../../store/user/userInfoActions.js";

import toast from "react-hot-toast";
import Comments from "../../components/itineraries/comments/Comments.jsx";
import Map from "../../components/itineraries/map/Map.jsx";
import { selectMe } from "../../store/user/userInfoSelectors.js";
import { getCurrencySymbol } from "../../utils/constants/currencies.js";
import "./Itinerary.scss";
import Error from "../error/Error.jsx";

const Itinerary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const userMe = useSelector(selectMe);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userItinerary, setUserItinerary] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const itineraryData = await getItineraryById(id);
        const userData = await getUserById(itineraryData.userId);
        setItinerary(itineraryData);
        setUserItinerary(userData);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !itinerary?.id) return;

    const fetchIsFavorite = async () => {
      try {
        const response = await checkIsFavorite(itinerary.id);
        setIsFavorite(response);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    fetchIsFavorite();
  }, [itinerary, isAuthenticated]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Error message="We couldn't load the itinerary page. Please try again later." />
    );
  }

  const handleRemove = async () => {
    try {
      await deleteItinerary(itinerary.id);
      toast.success("Itinerary deleted successfully");
      navigate(`/profile/${userMe?.id}`);
      dispatch(setUserInfo(itinerary?.userId));
      dispatch(setUserInfoItineraries(itinerary?.userId));
    } catch (error) {
      toast.error("Failed to delete itinerary");
    }
  };

  const isMyItinerary = () => {
    if (!userMe || !itinerary) return false;

    return userMe.id === itinerary.userId;
  };

  return (
    <section className="itinerary break-text">
      <Hero
        itinerary={itinerary}
        userItinerary={userItinerary}
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
        isAuthenticated={isAuthenticated}
        navigate={navigate}
        isMyItinerary={isMyItinerary}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="section__container">
        <div className="itinerary__container">
          <div className="itinerary__container-primary">
            <h1 className="itinerary__title">Description</h1>
            <p className="itinerary__description">{itinerary.description}</p>
            <Stats itinerary={itinerary} />
            <Places itinerary={itinerary} />
          </div>
          <div className="itinerary__container-secondary">
            <h1 className="itinerary__title">Trip Area</h1>
            <Map location={itinerary?.location}></Map>
          </div>
        </div>
        <div className="itinerary__container">
          <div className="itinerary__container-primary">
            <Comments
              itineraryId={itinerary.id}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async () => {
          await handleRemove();
          setIsModalOpen(false);
        }}
        title="Confirm Deletion"
        description="Are you sure you want to delete this itinerary? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </section>
  );
};
const Places = ({ itinerary }) => {
  if (itinerary.places.length === 0) {
    return (
      <div className="itinerary__container-primary-places">
        <h1 className="itinerary__title">Places</h1>
        <p className="itinerary__description">
          No places have been added to this itinerary yet.
        </p>
      </div>
    );
  }
  return (
    <div className="itinerary__container-primary-places">
      <h1 className="itinerary__title">Places</h1>
      {itinerary.places?.map((place, index) => (
        <Place key={index} place={place} index={index} />
      ))}
    </div>
  );
};

const Place = ({ place, index }) => {
  const Icon = getCategoryIcon(place.category) || FaCity;
  return (
    <div className="place">
      <h3 className="place__title ">
        Place {index + 1} : {place.name}
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

const Hero = ({
  itinerary,
  userItinerary,
  isFavorite,
  setIsFavorite,
  isAuthenticated,
  navigate,
  isMyItinerary,
  setIsModalOpen,
}) => {
  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      if (!isFavorite) {
        await addFavorite(itinerary.id);
        toast.success("Itinerary added to favorites!");
      } else {
        await removeFavorite(itinerary.id);
        toast.success("Itinerary removed from favorites!");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      toast.error("Error updating favorites");
    }
  };
  return (
    <div
      className="itinerary__hero"
      style={{
        backgroundImage: `url(${itinerary?.photoUrl || "/images/hero.jpg"})`,
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
              alt={userItinerary?.location?.name}
              className="itinerary__hero-image"
            />
            <span>
              <Link
                to={`/profile/${userItinerary?.id}`}
                className="itinerary__link "
              >
                @{userItinerary?.username}{" "}
              </Link>
            </span>
          </div>

          <div className="itinerary__hero-content-stats-row">
            <MdOutlineCalendarMonth className="nav-icon" />
            <span>{itinerary.tripDates}</span>
          </div>
        </div>
      </div>
      {isMyItinerary() ? (
        <div className="itinerary__hero-actions">
          <Link
            to={`/itinerary/edit/${itinerary.id}`}
            className="action-icon-btn"
            title="Edit itinerary"
          >
            <FaEdit />
          </Link>
          <button
            className="action-icon-btn danger"
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            title="Delete itinerary"
          >
            <FaTrashAlt />
          </button>
        </div>
      ) : (
        <div className="itinerary__hero-actions">
          <button
            className="action-icon-btn"
            onClick={handleSave}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
      )}
    </div>
  );
};

const Stats = ({ itinerary }) => {
  return (
    <div className="itinerary__container-primary-stats">
      <div className="itinerary__container-stats-budget">
        {getCurrencySymbol(itinerary.currency) || (
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
        <p className="itinerary__description">{itinerary.tripTotalDays}</p>
      </div>
      <div className="itinerary__container-stats-people">
        <GoPeople className="icon" />
        <strong className="itinerary__title">People</strong>
        <p className="itinerary__description">{itinerary.numberOfPeople}</p>
      </div>
    </div>
  );
};

export default Itinerary;
