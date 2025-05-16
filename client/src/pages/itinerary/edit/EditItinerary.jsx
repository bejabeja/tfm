import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../../../components/modal/Modal";
import { getItineraryById, updateItinerary } from "../../../services/itinerary";
import {
  loadMyUserInfo,
  setUserInfo,
} from "../../../store/user/userInfoActions";
import { selectMe } from "../../../store/user/userInfoSelectors";
import { createItinerarySchema } from "../../../utils/schemasValidation";
import BasicInfoForm from "../sections/BasicInfoForm";
import BudgetForm from "../sections/BudgetForm";
import DatesForm from "../sections/DatesForm";
import ImageUpload from "../sections/ImageUpload";
import PlacesForm from "../sections/PlacesForm";
import TravellersForm from "../sections/TravellersForm";

const EditItinerary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const userMe = useSelector(selectMe);

  const [itineraryData, setItineraryData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const isMyItinerary = () => {
    if (!userMe || !itineraryData) return false;
    return userMe.id === itineraryData.userId;
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isLoading },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: {
      imageUrl: "",
      imagePublicId: "",
      title: "",
      destination: {
        name: "",
        label: "",
        coordinates: {
          lat: 0,
          lon: 0,
        },
      },
      description: "",
      startDate: "",
      endDate: "",
      places: [
        {
          id: "",
          description: "",
          category: "",
          infoPlace: {
            name: "",
            label: "",
            coordinates: {
              lat: 0,
              lon: 0,
            },
          },
        },
      ],
      budget: "",
      currency: "",
      numberOfTravellers: "",
      category: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "places",
  });

  useEffect(() => {
    const fetchItineraryData = async () => {
      const response = await getItineraryById(id);
      const resetValues = {
        imageUrl: response.photoUrl,
        imagePublicId: response.photoPublicId,
        title: response.title,
        destination: {
          name: response.location.name,
          label: response.location.label,
          coordinates: {
            lat: Number(response.location.lat) || 0,
            lon: Number(response.location.lon) || 0,
          },
        },
        description: response.description,
        startDate: response.startDate.split("T")[0],
        endDate: response.endDate.split("T")[0],
        budget: response.budget?.toString(),
        currency: response.currency,
        numberOfTravellers: response.numberOfPeople.toString(),
        category: response.category,
        places: response.places.map((place) => ({
          id: place.id,
          description: place.description,
          category: place.category,
          infoPlace: {
            name: place.name,
            label: place.label,
            coordinates: {
              lat: Number(place.latitude),
              lon: Number(place.longitude),
            },
          },
        })),
      };
      reset(resetValues);
      setItineraryData(response);
    };
    fetchItineraryData();
  }, []);

  const editItinerary = async (data) => {
    const body = {
      userId: userMe.id,
      photoUrl: data.imageUrl,
      photoPublicId: data.imagePublicId,
      title: data.title,
      description: data.description,
      location: {
        name: data.destination.name,
        label: data.destination.label,
        lat: data.destination.coordinates.lat,
        lon: data.destination.coordinates.lon,
      },
      startDate: data.startDate,
      endDate: data.endDate,
      budget: Number(data.budget),
      currency: data.currency,
      numberOfPeople: Number(data.numberOfTravellers),
      places: data.places.map((place, index) => ({
        id: place.id,
        description: place.description,
        category: place.category || "other",
        orderIndex: index,
        infoPlace: {
          name: place.infoPlace.name,
          label: place.infoPlace.label,
          lat: place.infoPlace.coordinates.lat,
          lon: place.infoPlace.coordinates.lon,
        },
      })),
      category: data.category,
    };

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("itinerary", JSON.stringify(body));

    await updateItinerary(id, formData);
    dispatch(setUserInfo(userMe.id));
    dispatch(loadMyUserInfo(userMe.id));
    navigate(`/profile/${userMe.id}`);
  };

  return (
    <section className="create-itinerary section__container">
      <h1 className="form__title">Edit Itinerary</h1>

      <form className="form__container">
        <ImageUpload onUpload={(file) => setImageFile(file)} />
        <BasicInfoForm control={control} errors={errors} disabled={true} />
        <DatesForm control={control} errors={errors} />
        <PlacesForm
          control={control}
          errors={errors}
          fields={fields}
          append={append}
          remove={remove}
          destination={watch("destination")}
        />
        <BudgetForm control={control} errors={errors} />
        <TravellersForm control={control} errors={errors} />
        {isMyItinerary() && (
          <div className="form__cta">
            <Link
              to={`/my-itineraries`}
              type="button"
              className="btn btn__tertiary"
            >
              Cancel
            </Link>
            <button
              type="button"
              className="btn btn__primary"
              onClick={async () => {
                const isValid = await trigger();
                if (isValid) {
                  setIsModalOpen(true);
                }
              }}
            >
              Update itinerary
            </button>
          </div>
        )}
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubmit(async (data) => {
          await editItinerary(data);
          setIsModalOpen(false);
        })}
        title="Confirm Update"
        description="Are you sure you want to update this itinerary?"
        confirmText="Update"
        type="confirm"
      />
    </section>
  );
};

export default EditItinerary;
