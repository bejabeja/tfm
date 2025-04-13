import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/form/InputForm";
import SubmitButton from "../components/form/SubmitButton";
import { createUser } from "../reducers/userReducer";
import { signupSchema } from "../schemas/signupFormValidation";

const fields = [
  { name: "username", label: "Username", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
  { name: "location", label: "Location", type: "text" },
];

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
    },
  });

  const addUser = (data) => {
    dispatch(
      createUser(data, () => {
        navigate("/login");
      })
    );
  };

  return (
    <section>
      <form onSubmit={handleSubmit(addUser)}>
        {fields.map((field) => (
          <InputForm
            key={field.name}
            name={field.name}
            label={field.label}
            control={control}
            type={field.type}
            error={errors[field.name]}
          />
        ))}
        {error && <div className="error-message">{error}</div>}
        <SubmitButton label="Sign Up" />
      </form>
    </section>
  );
};

export default Signup;
