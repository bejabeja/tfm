import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import InputForm from "../components/form/InputForm";
import SubmitButton from "../components/form/SubmitButton";
import { loginUser } from "../reducers/userReducer";
import { loginSchema } from "../schemas/loginFormValidation";

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
    <section>
      <form onSubmit={handleSubmit(checkUser)}>
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
        <SubmitButton label="Log In" />
        <div>
          <Link to="/register">Don't have an account? Register</Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
