import React from "react";
import { useSelector } from "react-redux";
import Hero from "../components/hero/Hero";
import UsersSection from "../components/users/UsersSection.jsx";
import "./Home.css";

const Home = () => {
  const { featured } = useSelector((state) => state.users);

  return (
    <section className="home">
      <Hero />
      <div className="home__users section__container">
        <h2>People</h2>
        <p>Discover amazing people and their travel stories.</p>
        <UsersSection users={featured} />
      </div>
    </section>
  );
};

export default Home;
