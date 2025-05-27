import React from "react";
import { InputForm } from "../../../components/form/InputForm";
const TravellersForm = ({ control, errors }) => (
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
);

export default TravellersForm;
