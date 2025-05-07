import React from "react";
import { Controller } from "react-hook-form";
import { getCategoryIcon } from "../../../assets/icons";
import { InputForm, TextAreaForm } from "../../../components/form/InputForm";
import { itineraryCategories } from "../../../utils/constants/constants";
import AutocompleteObjectInput from "../../../components/form/AutocompleteObjectInput";

const BasicInfoForm = ({ control, errors }) => (
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
      <AutocompleteObjectInput
        name="destination"
        label="Destination"
        control={control}
        error={errors.destination}
      />
    </div>

    <TextAreaForm
      name="description"
      label="Description"
      type="text"
      control={control}
      error={errors.description}
    ></TextAreaForm>
    <TripCategoryForm control={control} />
  </div>
);

const TripCategoryForm = ({ control }) => {
  return (
    <div className="form__trip-type">
      <h2 className="form__subtitle">Trip Category</h2>
      <div className="form__icon-group">
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <>
              {itineraryCategories.map((type) => {
                const Icon = getCategoryIcon(type.value);

                return (
                  <button
                    type="button"
                    key={type.value}
                    className={`form__icon-group-button ${
                      field.value === type.value ? "selected" : ""
                    }`}
                    onClick={() => field.onChange(type.value)}
                  >
                    <Icon />

                    <span>{type.label}</span>
                  </button>
                );
              })}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
