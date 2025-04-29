import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/navbar/Navbar";
import Topbar from "./components/topbar/Topbar";
import PrivateLayout from "./pages/PrivateLayout";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import Signup from "./pages/auth/Signup";
import CreateItinerary from "./pages/createItinerary/CreateItinerary";
import Home from "./pages/home/Home";
import Itinerary from "./pages/itinerary/Itinerary";
import MyItineraries from "./pages/myItineraries/MyItineraries";
import EditProfile from "./pages/profile/EditProfile";
import Profile from "./pages/profile/Profile";
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
            <Route path="/friend-profile/:id" element={<Profile />} />
            <Route path="/itinerary/:id" element={<Itinerary />} />

            {/* private routes */}
            <Route element={<PrivateLayout />}>
              <Route path="/my-itineraries" element={<MyItineraries />} />
              <Route path="/friends" element={<div>Friends</div>} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="profile/edit/:id" element={<EditProfile />} />
              <Route path="/create-itinerary" element={<CreateItinerary />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
