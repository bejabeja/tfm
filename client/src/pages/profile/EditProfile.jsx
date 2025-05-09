import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { InputForm, TextAreaForm } from "../../components/form/InputForm";
import Spinner from "../../components/spinner/Spinner";
import { updateUser } from "../../services/users";
import { initAuthUser } from "../../store/auth/authActions";
import { setUserInfo } from "../../store/user/userInfoActions";
import {
  selectMe,
  selectMeError,
  selectMeLoading,
} from "../../store/user/userInfoSelectors";
import { generateAvatar } from "../../utils/constants/constants";
import { updateUserSchema } from "../../utils/schemasValidation";
import "./EditProfile.scss";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const userMe = useSelector(selectMe);
  const userMeLoading = useSelector(selectMeLoading);
  const userMeError = useSelector(selectMeError);

  const [errorSubmit, setErrorSubmit] = useState(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      name: "",
      bio: "",
      location: "",
      about: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    dispatch(setUserInfo(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!userMe) return;

    setValue("username", userMe.username);
    setValue("bio", userMe.bio);
    setValue("location", userMe.location);
    setValue("name", userMe.name);
    setValue("about", userMe.about);
    setValue("avatarUrl", userMe.avatarUrl);
  }, [userMe, setValue]);

  if (userMeLoading) {
    return <Spinner />;
  }

  const saveUser = async (data) => {
    try {
      await updateUser(data);
      dispatch(initAuthUser());
      dispatch(setUserInfo(id));
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error("Error updating profile", err);
      setErrorSubmit(err.message);
    }
  };

  return (
    <section className="edit-profile section__container">
      <form onSubmit={handleSubmit(saveUser)} className="edit-profile__form">
        <HeaderSection userInfo={userMe} control={control} errors={errors} />
        <AboutSection control={control} errors={errors} />
        {errorSubmit && <div className="error-message">{userMeError}</div>}
        <div className="edit-profile__header-actions">
          <button type="submit" className="btn btn__primary">
            Save Profile
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProfile;

const HeaderSection = ({ userMe, control, errors }) => {
  const avatarUrl = useWatch({ control, name: "avatarUrl" });

  return (
    <div className="edit-profile__header">
      <img
        className="profile__header-image"
        src={avatarUrl || generateAvatar(userMe?.username)}
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
