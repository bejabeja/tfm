import React from "react";
import { DropdownForm, InputForm } from "../../../components/form/InputForm";
import { currencyOptions } from "../../../utils/constants/currencies";

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
      <DropdownForm
        name="currency"
        label="Currency"
        type="select"
        options={currencyOptions}
        control={control}
        error={errors.currency}
      />
    </div>
  </div>
);

export default BudgetForm;
