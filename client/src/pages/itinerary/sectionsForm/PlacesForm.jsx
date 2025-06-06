import { Controller } from "react-hook-form";
import { getCategoryIcon } from "../../../assets/icons";
import AutocompletePlaceInput from "../../../components/form/AutocompletePlaceInput";
import { TextAreaForm } from "../../../components/form/InputForm";
import { placeCategories } from "../../../utils/constants/constants";

const PlacesForm = ({
  control,
  errors,
  fields,
  append,
  remove,
  destination,
}) => {
  const handleAddPlace = () => append({ description: "", infoPlace: {} });

  return (
    <div className="form__places">
      <h2 className="form__subtitle">Places</h2>
      {fields.map((field, index) => (
        <PlaceField
          key={field.id}
          index={index}
          control={control}
          errors={errors}
          remove={remove}
          disableRemove={fields.length === 1}
          destination={destination}
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

const PlaceField = ({ control, index, errors, remove, destination }) => {
  return (
    <div className="form__places-group">
      <AutocompletePlaceInput
        name={`places.${index}.infoPlace`}
        label="Place name"
        control={control}
        error={errors?.places?.[index]?.infoPlace}
        destination={destination}
      ></AutocompletePlaceInput>

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
