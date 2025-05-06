import React from "react";
import { useSelector } from "react-redux";
import { useFollow } from "../../hooks/useFollow";
import "./UsersSection.scss";
import UserCard from "./card/UserCard";
import UserCardSkeleton from "./card/UserCardSkeleton";

const UsersSection = ({ users, isLoading }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const skeletonCount = 3;

  return (
    <div className="user-section">
      <div className="user-section__grid">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <UserCardSkeleton key={i} />
            ))
          : users.map((user) => (
              <UserCardWithFollow
                key={user.id}
                user={user}
                isAuthenticated={isAuthenticated}
              />
            ))}
      </div>
    </div>
  );
};

export default UsersSection;

const UserCardWithFollow = ({ user, isAuthenticated }) => {
  const { isFollowing, toggleFollow } = useFollow(user.id);

  return (
    <UserCard
      {...user}
      isAuthenticated={isAuthenticated}
      isFollowing={isFollowing}
      onFollowToggle={toggleFollow}
    />
  );
};
