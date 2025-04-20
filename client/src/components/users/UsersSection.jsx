import React from "react";
import "./UsersSection.scss";
import UserCard from "./card/UserCard";
import UserCardSkeleton from "./card/UserCardSkeleton";

const UsersSection = ({ users, isLoading }) => {
  const skeletonCount = 3;
  return (
    <div className="user-section">
      <div className="user-section__grid">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <UserCardSkeleton key={i} />
            ))
          : users.map((user, index) => <UserCard key={index} {...user} />)}
      </div>
    </div>
  );
};

export default UsersSection;
