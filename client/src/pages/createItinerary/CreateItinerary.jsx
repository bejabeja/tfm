import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { InputForm, TextAreaForm } from "../../components/form/InputForm";
import SubmitButton from "../../components/form/SubmitButton";
import { createItinerary } from "../../services/itineraries";
import { createItinerarySchema } from "../../utils/schemasValidation";
import "./CreateItinerary.scss";

const CreateItinerary = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: {
      title: "",
      destination: "",
      description: "",
      startDate: today,
      endDate: today,
      places: [{ title: "", description: "" }],
      budget: "0",
      currency: "",
      numberOfTravellers: "1",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "places",
  });

  const addItinerary = async (data) => {
    const body = {
      userId: user.id,
      title: data.title,
      description: data.description,
      location: data.destination,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: Number(data.budget),
      numberOfPeople: Number(data.numberOfTravellers),
      places: data.places.map((place, index) => ({
        title: place.title,
        description: place.description,
        category: "General",
        orderIndex: index,
      })),
    };
    await createItinerary(body);
    navigate(`/profile/${user.id}`);
  };

  return (
    <section className="create-itinerary section__container">
      <h1 className="form__title">Create Itinerary</h1>

      <form className="form__container" onSubmit={handleSubmit(addItinerary)}>
        <div className="form__basic-info">
          <h2 className="form__subtitle">Basic Information</h2>
          <div className="form__row-group">
            <InputForm
              name="title"
              label="Title"
              type="text"
              control={control}
              error={errors.title}
            ></InputForm>
            <InputForm
              name="destination"
              label="Destination"
              type="text"
              control={control}
              error={errors.destination}
            ></InputForm>
          </div>

          <TextAreaForm
            name="description"
            label="Description"
            type="text"
            control={control}
            error={errors.description}
          ></TextAreaForm>
        </div>
        <div className="form__dates">
          <h2 className="form__subtitle">Dates</h2>
          <div className="form__row-group">
            <InputForm
              name="startDate"
              label="Start Date"
              type="date"
              control={control}
              error={errors.startDate}
            ></InputForm>
            <InputForm
              name="endDate"
              label="End Date"
              type="date"
              control={control}
              error={errors.endDate}
            ></InputForm>
          </div>
        </div>
        <PlacesForm
          control={control}
          errors={errors}
          fields={fields}
          append={append}
          remove={remove}
        />
        <div className="form__budget">
          <h2 className="form__subtitle">Budget</h2>
          <div className="form__row-group">
            <InputForm
              name="budget"
              label="Budget"
              type="number"
              control={control}
              error={errors.budget}
            ></InputForm>
            <InputForm
              name="currency"
              label="Currency"
              type="text"
              control={control}
              error={errors.currency}
            ></InputForm>
          </div>
        </div>
        <div className="form__travellers">
          <h2 className="form__subtitle">Travellers</h2>
          <div className="form__row-group">
            <InputForm
              name="numberOfTravellers"
              label="Number of Travellers"
              type="number"
              control={control}
              error={errors.numberOfTravellers}
            ></InputForm>
          </div>
        </div>
        <div className="form__cta">
          <Link
            to={`/my-itineraries`}
            type="button"
            className="btn btn--tertiary"
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

const PlacesForm = ({ control, errors, fields, append, remove }) => {
  const handleAddPlace = () => append({ title: "", description: "" });

  return (
    <div className="form__places">
      <h2 className="form__subtitle">Places</h2>
      {fields.length === 0 && (
        <div>
          <p className="error-message">
            Please add at least one place to your itinerary.
          </p>
        </div>
      )}
      {fields.map((field, index) => (
        <PlaceField
          key={field.id}
          index={index}
          control={control}
          errors={errors}
          remove={remove}
          disableRemove={fields.length === 1}
        />
      ))}
      <div className="form__cta">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddPlace}
        >
          Add place
        </button>
      </div>
    </div>
  );
};

const PlaceField = ({ control, index, errors, remove }) => (
  <div className="form__places-group">
    <div className="form__row-group">
      <InputForm
        name={`places.${index}.title`}
        label="Place Name"
        type="text"
        control={control}
        error={errors?.places?.[index]?.title}
      />
    </div>
    <TextAreaForm
      name={`places.${index}.description`}
      label="Place Description"
      type="text"
      control={control}
      error={errors?.places?.[index]?.description}
    />
    <div className="form__cta-delete">
      <button
        type="button"
        className="btn btn--danger"
        onClick={() => remove(index)}
      >
        Delete place
      </button>
    </div>
  </div>
);
