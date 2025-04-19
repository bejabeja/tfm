import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { InputForm, TextAreaForm } from "../../components/form/InputForm";
import { editProfileSchema } from "../../schemas/editProfileFormValidation";
import { getUserById, updateUser } from "../../services/user";
import "./EditProfile.scss";

const EditProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(id);
        setUserData(response);

        setValue("username", response.username);
        setValue("bio", response.bio);
        setValue("location", response.location);
        setValue("name", response.name);
        setValue("about", response.about);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id, setValue]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  const saveUser = async (data) => {
    try {
      await updateUser(data);
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  return (
    <section className="edit-profile section__container">
      <form onSubmit={handleSubmit(saveUser)} className="edit-profile__form">
        <HeaderSection userData={userData} control={control} errors={errors} />
        <AboutSection control={control} />
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

const HeaderSection = ({ userData, control, errors }) => {
  return (
    <div className="edit-profile__header">
      <img
        className="profile__header-image"
        src={userData?.avatarUrl}
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

const AboutSection = ({ control }) => {
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
          />
        </div>
        <div className="profile__about-content-stats">
          <div className="profile__about-content-stats-location edit-profile__location">
            <IoLocationOutline className="nav-icon" />
            <span>
              <InputForm
                name="location"
                control={control}
                type="text"
                placeholder="Edit your location"
              ></InputForm>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
