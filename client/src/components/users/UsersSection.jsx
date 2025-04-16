import React from "react";
import "./UsersSection.css";
import UserCard from "./card/UserCard";

const UsersSection = ({ users }) => {
  return (
    <div className="user-section">
      <div className="user-section__grid">
        {users?.map((user, index) => (
          <UserCard key={index} {...user} />
        ))}
      </div>
    </div>
  );
};

export default UsersSection;
