import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { followUser, unfollowUser } from "../services/followers";
import { setUserInfo, setUserInfoFollowing } from "../store/user/userInfoActions";

export const useFollow = (targetUserId) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state) => state.auth);
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

    const toggleFollow = async () => {
        if (!isAuthenticated) {
            navigate('/login')
        }
        try {
            if (isFollowing) {
                await unfollowUser(targetUserId);
            } else {
                await followUser(targetUserId);
            }
            dispatch(setUserInfo(userInfo.id));
            dispatch(setUserInfoFollowing(userInfo.id));
            setIsFollowing((prev) => !prev);
        } catch (err) {
            console.error("Failed to toggle follow:", err);
        }
    };

    return { isFollowing, toggleFollow };
};