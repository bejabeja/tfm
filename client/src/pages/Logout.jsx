import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../reducers/userReducer";

const Login = () => {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <section>
      <button onClick={logout}>Logout</button>
    </section>
  );
};

export default Login;
