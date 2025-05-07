import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import SubmitButton from "../../../components/form/SubmitButton";
import { getItineraryById, updateItinerary } from "../../../services/itinerary";
import {
  loadMyUserInfo,
  setUserInfo,
} from "../../../store/user/userInfoActions";
import { createItinerarySchema } from "../../../utils/schemasValidation";
import BasicInfoForm from "../sections/BasicInfoForm";
import BudgetForm from "../sections/BudgetForm";
import DatesForm from "../sections/DatesForm";
import PlacesForm from "../sections/PlacesForm";
import TravellersForm from "../sections/TravellersForm";

const EditItinerary = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { me } = useSelector((state) => state.myInfo);
  const userInfo = me.data;

  const [itineraryData, setItineraryData] = useState(null);
  const navigate = useNavigate();

  const isMyItinerary = () => {
    if (!userInfo || !itineraryData) return false;
    return userInfo.id === itineraryData.userId;
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
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
      startDate: "",
      endDate: "",
      places: [{ id: "", title: "", description: "", category: "" }],
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
        title: response.title,
        destination: { name: response.location },
        description: response.description,
        startDate: response.startDate.split("T")[0],
        endDate: response.endDate.split("T")[0],
        budget: response.budget?.toString(),
        currency: response.currency,
        numberOfTravellers: response.numberOfPeople.toString(),
        category: response.category,
        places: response.places.map((place) => ({
          id: place.id,
          title: place.title,
          description: place.description,
          category: place.category,
        })),
      };
      console.log(response);
      reset(resetValues);
      setItineraryData(response);
    };
    fetchItineraryData();
  }, []);

  const editItinerary = async (data) => {
    const body = {
      userId: userInfo.id,
      title: data.title,
      description: data.description,
      location: data.destination,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: Number(data.budget),
      currency: data.currency,
      numberOfPeople: Number(data.numberOfTravellers),
      places: data.places.map((place, index) => ({
        id: place.id,
        title: place.title,
        description: place.description,
        category: place.category || "other",
        orderIndex: index,
      })),
      category: data.category,
    };

    await updateItinerary(id, body);
    dispatch(setUserInfo(userInfo.id));
    dispatch(loadMyUserInfo(userInfo.id));
    navigate(`/profile/${userInfo.id}`);
  };

  return (
    <section className="create-itinerary section__container">
      <h1 className="form__title">Edit Itinerary</h1>

      <form className="form__container" onSubmit={handleSubmit(editItinerary)}>
        <BasicInfoForm control={control} errors={errors} disabled={true} />
        <DatesForm control={control} errors={errors} />
        <PlacesForm
          control={control}
          errors={errors}
          fields={fields}
          append={append}
          remove={remove}
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
            <SubmitButton label="Update itinerary" />
          </div>
        )}
      </form>
    </section>
  );
};

export default EditItinerary;
