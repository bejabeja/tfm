import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>Connect with Your World</h1>
        <p>
          Share moments, build connections, and discover amazing stories from
          people around the globe.
        </p>
        {!isAuthenticated && (
          <Link to="/register" className="hero-button">
            Join Now
          </Link>
        )}
      </div>
    </section>
  );
};

export default Hero;
