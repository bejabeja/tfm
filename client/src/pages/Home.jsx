import React from "react";
import { logout } from "../services/user";
import Login from "./Login";
import Signup from "./Signup";

const Home = () => {
  return (
    <div>
      <Signup />
      <Login />
    </div>
  );
};

export default Home;
