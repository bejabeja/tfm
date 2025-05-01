import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { InputForm, TextAreaForm } from "../../components/form/InputForm";
import Spinner from "../../components/spinner/Spinner";
import { updateUser } from "../../services/user";
import { initUser } from "../../store/auth/authActions";
import { initUserInfo } from "../../store/user/userInfoActions";
import { updateUserSchema } from "../../utils/schemasValidation";
import "./EditProfile.scss";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { userInfo, loading, error } = useSelector((state) => state.myInfo);
  const [errorSubmit, setErrorSubmit] = useState(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    dispatch(initUserInfo(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!userInfo) return;

    setValue("username", userInfo.username);
    setValue("bio", userInfo.bio);
    setValue("location", userInfo.location);
    setValue("name", userInfo.name);
    setValue("about", userInfo.about);
  }, [userInfo, setValue]);

  if (loading) {
    return <Spinner />;
  }

  const saveUser = async (data) => {
    try {
      await updateUser(data);
      dispatch(initUser());
      dispatch(initUserInfo(id));
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error("Error updating profile", err);
      setErrorSubmit(err.message);
    }
  };

  return (
    <section className="edit-profile section__container">
      <form onSubmit={handleSubmit(saveUser)} className="edit-profile__form">
        <HeaderSection userInfo={userInfo} control={control} errors={errors} />
        <AboutSection control={control} errors={errors} />
        {errorSubmit && <div className="error-message">{error}</div>}
        <div className="edit-profile__header-actions">
          <button type="submit" className="btn btn-primary">
            Save Profile
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProfile;

const HeaderSection = ({ userInfo, control, errors }) => {
  return (
    <div className="edit-profile__header">
      <img
        className="profile__header-image"
        src={userInfo?.avatarUrl}
        alt="Profile"
      />
      <div className="edit-profile__header-info">
        <InputForm
          name="name"
          control={control}
          type="text"
          placeholder="Edit your name"
          error={errors.name}
        />
        <InputForm
          name="username"
          control={control}
          type="text"
          placeholder="Edit your username"
          error={errors.username}
        />
        <TextAreaForm
          name="bio"
          control={control}
          type="text"
          placeholder="Edit your bio"
          error={errors.bio}
        />
      </div>
    </div>
  );
};

const AboutSection = ({ control, errors }) => {
  return (
    <div className="profile__about">
      <h2 className="profile__about-title">About</h2>

      <div className="profile__about-content">
        <div className="profile__about-content-description">
          <TextAreaForm
            name="about"
            control={control}
            type="text"
            placeholder="Edit your about"
            error={errors.about}
          />
        </div>
        <div className="profile__about-content-stats">
          <div className="profile__about-content-stats-location edit-profile__location">
            <IoLocationOutline className="nav-icon" />
            <div>
              <InputForm
                name="location"
                control={control}
                type="text"
                placeholder="Edit your location"
                error={errors.location}
              ></InputForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
