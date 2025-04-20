import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { InputForm } from "../../components/form/InputForm";
import SubmitButton from "../../components/form/SubmitButton";
import { loginUser } from "../../reducers/authReducer";
import { loginSchema } from "../../utils/schemasValidation";
import "./Auth.scss";

const fields = [
  { name: "username", label: "Username", type: "text" },
  { name: "password", label: "Password", type: "password" },
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

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
  console.log(errors);

  return (
    <section className="auth">
      <img
        src="/images/form-bg-login.webp"
        alt="Foto de Annie Spratt en Unsplash"
        className="auth__bg"
        loading="eager"
        fetchPriority="high"
      />

      <form onSubmit={handleSubmit(checkUser)} className="auth__form">
        <h1 className="auth__form-title">Log in</h1>

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

        <SubmitButton label="Log In" />

        <div className="auth__form-link">
          <Link to="/register">Don't have an account? Register!</Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
