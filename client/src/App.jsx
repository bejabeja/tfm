import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import PrivateLayout from "./pages/PrivateLayout";
import Signup from "./pages/Signup";
import { clearError, initUser } from "./reducers/userReducer";
import { useLocation } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(initUser());
  }, []);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, location]);

  return (
    <div className="App">
      <div className="side-content">
        <Navbar />
      </div>
      <div className="main-content">
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/explore" element={<div>Explore</div>} />
          <Route path="/community" element={<div>Community</div>} />

          {/* private routes */}
          <Route element={<PrivateLayout />}>
            <Route path="/my-itineraries" element={<div>Itineraries</div>} />
            <Route path="/friends" element={<div>Friends</div>} />
            <Route path="/profile" element={<div>Profile</div>} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
