import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Spinner from "./components/spinner/Spinner";
import PrivateLayout from "./pages/PrivateLayout";
import Home from "./pages/home/Home";
import { clearError, initAuthUser } from "./store/auth/authActions";
import { refreshUnreadCount } from "@tobeatraveller/shared";
import { useCanonicalUrl } from "./hooks/useCanonicalUrl";

import CustomToaster from "./components/toast/CustomToaster";
import {
  selectAuthUser,
  selectIsAuthenticated,
} from "./store/auth/authSelectors";
import { initFilters } from "./store/filters/filterActions";
import { loadMyUserInfo } from "./store/user/userInfoActions";

// Code-split per route so the initial bundle isn't the whole app; Home stays eager
// since it's the most common cold-landing page and shouldn't wait on a chunk fetch.
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Logout = lazy(() => import("./pages/auth/Logout"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Explore = lazy(() => import("./pages/explore/Explore"));
const Community = lazy(() => import("./pages/community/Community"));
const Contact = lazy(() => import("./pages/legal/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Itinerary = lazy(() => import("./pages/itinerary/Itinerary"));
const FollowersList = lazy(() => import("./pages/follows/FollowersList"));
const FollowingList = lazy(() => import("./pages/follows/FollowingList"));
const Onboarding = lazy(() => import("./pages/onboarding/Onboarding"));
const Notifications = lazy(() => import("./pages/notifications/Notifications"));
const MyItineraries = lazy(() => import("./pages/myItineraries/MyItineraries"));
const Favorites = lazy(() => import("./pages/favorites/Favorites"));
const EditProfile = lazy(() => import("./pages/profile/EditProfile"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const CreateItinerary = lazy(() => import("./pages/itinerary/create/CreateItinerary"));
const CreateExperience = lazy(() => import("./pages/experience/CreateExperience"));
const EditExperience = lazy(() => import("./pages/experience/EditExperience"));
const EditItinerary = lazy(() => import("./pages/itinerary/edit/EditItinerary"));

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userAuthenticated = useSelector(selectAuthUser);

  useCanonicalUrl(location.pathname);

  useEffect(() => {
    dispatch(initAuthUser());
    dispatch(initFilters());
  }, []);

  useEffect(() => {
    if (isAuthenticated && userAuthenticated?.id) {
      dispatch(loadMyUserInfo(userAuthenticated.id));
    }
  }, [dispatch, isAuthenticated, userAuthenticated?.id]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, location]);

  // Poll unread notification count every 30s and on tab focus
  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(refreshUnreadCount());
    const interval = setInterval(() => dispatch(refreshUnreadCount()), 30_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") dispatch(refreshUnreadCount());
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [dispatch, isAuthenticated]);

  const publicRoutes = ["/", "/explore", "/community", "/privacy-policy", "/terms", "/contact"];

  const isAuthRoute = ["/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname);

  const isPublicRoute = publicRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace(/:[^\s/]+/g, "[^/]+")}$`);
    return regex.test(location.pathname);
  });

  return (
    <div className="App ">
      <CustomToaster />
      <div className={`side-content${isAuthRoute ? " side-content--hidden" : ""}`}>
        <Navbar />
      </div>
      <div className={`main-content${isAuthRoute ? " main-content--auth" : ""}`}>
        <main className="content">
          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/community" element={<Community />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />

              {/* routes to decide if private or not */}
              <Route path="/friend-profile/:id" element={<Profile />} />
              <Route path="/itinerary/:id" element={<Itinerary />} />
              <Route path="/profile/:id/followers" element={<FollowersList />} />
              <Route path="/profile/:id/following" element={<FollowingList />} />

              {/* private routes */}
              <Route element={<PrivateLayout />}>
                <Route path="/welcome" element={<Onboarding />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/my-itineraries" element={<MyItineraries />} />
                <Route path="/itineraries/saved" element={<Favorites />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/profile/edit/:id" element={<EditProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/create-itinerary" element={<CreateItinerary />} />
                <Route path="/create-experience" element={<CreateExperience />} />
                <Route path="/experience/edit/:id" element={<EditExperience />} />
                <Route path="/itinerary/edit/:id" element={<EditItinerary />} />
              </Route>
            </Routes>
          </Suspense>
        </main>

        {isPublicRoute && <Footer />}
      </div>
    </div>
  );
};

export default App;
