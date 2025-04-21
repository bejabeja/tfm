import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { InputForm } from "../../components/form/InputForm";
import SubmitButton from "../../components/form/SubmitButton";
import { createItinerarySchema } from "../../utils/schemasValidation";
import "./CreateItinerary.scss";

const fields = [
  { name: "title", label: "Title", type: "text" },
  { name: "destination", label: "Destination", type: "text" },
  { name: "description", label: "Description", type: "text" },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
  { name: "placeName", label: "Place Name", type: "text" },
  { name: "placeDescription", label: "Place Description", type: "text" },
  { name: "budget", label: "Budget", type: "number" },
  { name: "currency", label: "Currency", type: "text" },
  { name: "numberOfTravellers", label: "Number of Travellers", type: "number" },
];

const CreateItinerary = () => {
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
      placeName: "",
      placeDescription: "",
      budget: 0,
      currency: "",
      numberOfTravellers: 1,
    },
  });

  const addItinerary = (data) => {
    console.log(data);
  };

  return (
    <section className="section__container">
      <form className="form__container" onSubmit={handleSubmit(addItinerary)}>
        <h1 className="form__title">Create Itinerary</h1>
        {fields.map((field) => (
          <InputForm
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            control={control}
            error={errors[field.name]}
          />
        ))}
        <SubmitButton label="Create itinerary" />
      </form>
    </section>
  );
};

export default CreateItinerary;
