import React from "react";
import { Controller } from "react-hook-form";
import { getCategoryIcon } from "../../../assets/icons";
import { InputForm, TextAreaForm } from "../../../components/form/InputForm";
import { placeCategories } from "../../../utils/constants/constants";

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
          className="btn btn__primary"
          onClick={handleAddPlace}
        >
          Add place
        </button>
      </div>
    </div>
  );
};

const PlaceField = ({ control, index, errors, remove }) => {
  return (
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
      <PlaceCategoryForm control={control} index={index} />

      <div className="form__cta-delete">
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => remove(index)}
        >
          Delete place
        </button>
      </div>
    </div>
  );
};

const PlaceCategoryForm = ({ control, index }) => {
  return (
    <div className="form__place-type">
      <h2 className="form__subtitle">Place Category</h2>
      <div className="form__icon-group">
        <Controller
          name={`places.${index}.category`}
          control={control}
          render={({ field }) => (
            <>
              {placeCategories.map((type) => {
                const Icon = getCategoryIcon(type.value);
                return (
                  <button
                    type="button"
                    key={type.value}
                    className={`form__icon-group-button only-icon ${
                      field.value === type.value ? "selected" : ""
                    }`}
                    onClick={() => field.onChange(type.value)}
                  >
                    <Icon />
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

export default PlacesForm;
