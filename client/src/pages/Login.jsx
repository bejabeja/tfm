import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
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
    dispatch(loginUser(data));
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

        <SubmitButton label="Log In" />
      </form>
    </section>
  );
};

export default Login;
