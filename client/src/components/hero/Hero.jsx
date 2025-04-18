import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Hero.scss";

const Hero = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <section className="hero">
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__content__title">Connect with Your World</h1>
        <p className="hero__content__description">
          Share moments, build connections, and discover amazing stories from
          people around the globe.
        </p>
        {!isAuthenticated && (
          <div className="hero__content__buttons">
            <Link to="/register" className="btn btn-secondary">
              Join Now
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
