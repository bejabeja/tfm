import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../../services/followers";
import { initUserInfo } from "../../store//user/userInfoActions";
import "./UsersSection.scss";
import UserCard from "./card/UserCard";
import UserCardSkeleton from "./card/UserCardSkeleton";

const UsersSection = ({ users, isLoading }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.myInfo.userInfo);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const handleFollowToggle = async (userId, isCurrentFollowing) => {
    try {
      if (isCurrentFollowing) {
        await unfollowUser(userId);
        dispatch(initUserInfo(authUser.id));
      } else {
        await followUser(userId);
        dispatch(initUserInfo(authUser.id));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  const skeletonCount = 3;

  return (
    <div className="user-section">
      <div className="user-section__grid">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <UserCardSkeleton key={i} />
            ))
          : users.map((user, index) => {
              const isFollowing = authUser?.followingListIds?.some(
                (followedUser) => followedUser.id === user.id
              );
              
              return (
                <UserCard
                  key={index}
                  {...user}
                  isAuthenticated={isAuthenticated}
                  isFollowing={isFollowing}
                  onFollowToggle={() =>
                    handleFollowToggle(user.id, isFollowing)
                  }
                />
              );
            })}
      </div>
    </div>
  );
};

export default UsersSection;
