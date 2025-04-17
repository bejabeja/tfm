import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Topbar from "./components/topbar/Topbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import PrivateLayout from "./pages/PrivateLayout";
import Signup from "./pages/Signup";
import FriendProfile from "./pages/friends/FriendProfile";
import { clearError, initUser } from "./reducers/authReducer";
import { initUsers } from "./reducers/usersReducer";
const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(initUser());
    dispatch(initUsers());
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
        {isAuthenticated && (
          <div className="header">
            <Topbar />
          </div>
        )}
        <div className="content">
          <Routes>
            {/* public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/explore" element={<div>Explore</div>} />
            <Route path="/community" element={<div>Community</div>} />

            {/* routes to decide if private or not */}
            <Route
              path="/friend-profile/:id"
              element={<FriendProfile>Friend Profile</FriendProfile>}
            />

            {/* private routes */}
            <Route element={<PrivateLayout />}>
              <Route path="/my-itineraries" element={<div>Itineraries</div>} />
              <Route path="/friends" element={<div>Friends</div>} />
              <Route path="/profile" element={<div>Profile</div>} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
