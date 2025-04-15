import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { bgImage } from "../utils/constants";
import InputForm from "../components/form/InputForm";
import SubmitButton from "../components/form/SubmitButton";
import { loginUser } from "../reducers/authReducer";
import { loginSchema } from "../schemas/loginFormValidation";
import "./Login.css";

const fields = [
  { name: "username", label: "Username", type: "text" },
  { name: "password", label: "Password", type: "password" },
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const checkUser = (data) => {
    dispatch(
      loginUser(data, () => {
        navigate("/");
      })
    );
  };

  return (
    <section className="login">
     <picture>
        <source
          srcSet="/images/form-bg-mobile.webp"
          media="(max-width: 768px)"
          type="image/webp"
        />
        <img
          src="/images/form-bg.webp"
          alt="Foto de Annie Spratt en Unsplash"
          className="login__bg"
          loading="lazy"
        />
      </picture>

      <form onSubmit={handleSubmit(checkUser)} className="login__form">
        <h1 className="title-form-h1">Log in</h1>
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
        <div className="error-message">{error ? error : "\u00A0"}</div>

        <SubmitButton label="Log In" />
        <div className="form--navigate-link">
          <Link to="/register">Don't have an account? Register</Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
