import React from "react";
import Login from "./Login";
import Logout from "./Logout";
import Signup from "./Signup";

const Home = () => {
  return (
    <div>
      <Signup />
      <Login />
      <Logout />
    </div>
  );
};

export default Home;
