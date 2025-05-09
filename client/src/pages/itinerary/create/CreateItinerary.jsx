import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "../../../components/form/SubmitButton";
import { createItinerary } from "../../../services/itinerary";
import {
  setUserInfo,
  setUserInfoItineraries,
} from "../../../store/user/userInfoActions";
import { selectMe } from "../../../store/user/userInfoSelectors";
import { createItinerarySchema } from "../../../utils/schemasValidation";
import BasicInfoForm from "../sections/BasicInfoForm";
import BudgetForm from "../sections/BudgetForm";
import DatesForm from "../sections/DatesForm";
import PlacesForm from "../sections/PlacesForm";
import TravellersForm from "../sections/TravellersForm";
import "./CreateItinerary.scss";

const CreateItinerary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMe = useSelector(selectMe);

  const today = new Date().toISOString().split("T")[0];
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: {
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
      startDate: today,
      endDate: today,
      places: [
        {
          description: "",
          category: "other",
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
      budget: "0",
      currency: "",
      numberOfTravellers: "1",
      category: "other",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "places",
  });

  const addItinerary = async (data) => {
    const body = {
      userId: userMe.id,
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
    await createItinerary(body);
    dispatch(setUserInfo(userMe.id));
    dispatch(setUserInfoItineraries(userMe.id));
    navigate(`/profile/${userMe.id}`);
  };

  return (
    <section className="create-itinerary section__container">
      <h1 className="form__title">Create Itinerary</h1>

      <form className="form__container" onSubmit={handleSubmit(addItinerary)}>
        <BasicInfoForm control={control} errors={errors} />
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
        <div className="form__cta">
          <Link
            to={`/my-itineraries`}
            type="button"
            className="btn btn__tertiary"
          >
            Cancel
          </Link>
          <SubmitButton label="Create itinerary" />
        </div>
      </form>
    </section>
  );
};

export default CreateItinerary;
