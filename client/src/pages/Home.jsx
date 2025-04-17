import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Hero from "../components/hero/Hero";
import UsersSection from "../components/users/UsersSection.jsx";
import { initUsers } from "../reducers/usersReducer.js";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const { featured, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(initUsers);
  }, [dispatch]);

  return (
    <section className="home">
      <Hero />
      <div className="home__users section__container">
        <h2>People</h2>
        <p>Discover amazing people and their travel stories.</p>
        <UsersSection users={featured} isLoading={loading} />
      </div>
    </section>
  );
};

export default Home;
