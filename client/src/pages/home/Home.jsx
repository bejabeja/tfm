import React from "react";
import { useSelector } from "react-redux";
import Hero from "../../components/hero/Hero.jsx";
import UsersSection from "../../components/users/UsersSection.jsx";
import "./Home.scss";

const Home = () => {
  const { featured, loading } = useSelector((state) => state.users);

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
