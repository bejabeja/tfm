import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../services/followers";
import { setUserInfo } from "../store/user/userInfoActions";

export const useFollow = (targetUserId) => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.myInfo);
    const [isFollowing, setIsFollowing] = useState(false);

    const userInfo = me.data;

    useEffect(() => {
        const checkFollowing = () => {
            const following = userInfo?.followingListIds?.some((u) => u.id === targetUserId);
            setIsFollowing(!!following);
        };
        checkFollowing();
    }, [userInfo, targetUserId]);

    const handleFollowToggle = async () => {
        try {
            isFollowing ? await unfollowUser(targetUserId) : await followUser(targetUserId);
            dispatch(setUserInfo(userInfo.id));
            setIsFollowing((prev) => !prev);
        } catch (err) {
            console.error("Failed to toggle follow:", err);
        }
    };

    return { isFollowing, handleFollowToggle };
};