import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setImageHeroLoaded } from "../../reducers/authReducer";
import { preloadImg } from "../../utils/preloadImg";
import "./Hero.scss";
import { heroImage } from "../../utils/constants";

const Hero = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, imageHeroLoaded } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (imageHeroLoaded) return;
    preloadImg(heroImage, () => {
      dispatch(setImageHeroLoaded());
    });
  }, [dispatch, imageHeroLoaded]);

  return (
    <section className={`hero ${imageHeroLoaded ? "loaded" : ""}`}>
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
