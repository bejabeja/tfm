import React from "react";
import { InputForm } from "../../../components/form/InputForm";

const DatesForm = ({ control, errors }) => (
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
);

export default DatesForm;
