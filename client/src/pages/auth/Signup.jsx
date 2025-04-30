import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { InputForm } from "../../components/form/InputForm";
import SubmitButton from "../../components/form/SubmitButton";
import { createUser, setImageAuthLoaded } from "../../reducers/authReducer";
import { authImage } from "../../utils/constants";
import { preloadImg } from "../../utils/preloadImg";
import { signupSchema } from "../../utils/schemasValidation";
import "./Auth.scss";

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
  const { error, imageAuthLoaded } = useSelector((state) => state.auth);

  useEffect(() => {
    if (imageAuthLoaded) return;
    preloadImg(authImage, () => {
      dispatch(setImageAuthLoaded());
    });
  }, [dispatch, imageAuthLoaded]);

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
    <section className="auth">
      <div className={`auth__bg ${imageAuthLoaded ? "loaded" : ""}`} />

      <form onSubmit={handleSubmit(addUser)} className="auth__form">
        <h1 className="auth__form-title">Sign up</h1>

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

        <div className="auth__form-error">
          {error && Object.keys(errors).length === 0 ? error : "\u00A0"}
        </div>

        <div className="auth__form-link">
          <SubmitButton label="Sign Up" />
          <Link to="/login">Already have an account? Log in!</Link>
        </div>
      </form>
    </section>
  );
};

export default Signup;
