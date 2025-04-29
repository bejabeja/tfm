import React from "react";
import { InputForm } from "../../../components/form/InputForm";

const BudgetForm = ({ control, errors }) => (
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
);

export default BudgetForm;
