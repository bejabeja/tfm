import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { followUser, unfollowUser } from "../services/followers";
import { selectIsAuthenticated } from "../store/auth/authSelectors";
import { setUserInfo, setUserInfoFollowing } from "../store/user/userInfoActions";
import { selectMe } from "../store/user/userInfoSelectors";

export const useFollow = (targetUserId) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const userMe = useSelector(selectMe);

    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);

    const isMyUser = targetUserId === userMe?.id;

    useEffect(() => {
        const checkFollowing = () => {
            const following = userMe?.followingListIds?.some((u) => u.id === targetUserId);
            setIsFollowing(!!following);
        };
        checkFollowing();
    }, [userMe, targetUserId]);

    const toggleFollow = async () => {
        if (!isAuthenticated) {
            navigate('/login')
            return;
        }

        const wasFollowing = isFollowing;
        setIsFollowing(!wasFollowing);
        setIsLoadingFollow(true);
        try {
            if (wasFollowing) {
                await unfollowUser(targetUserId);
            } else {
                await followUser(targetUserId);
            }
            if (userMe?.id) {
                dispatch(setUserInfo(userMe.id));
                dispatch(setUserInfoFollowing(userMe.id));
            }
        } catch (err) {
            console.error("Failed to toggle follow:", err);
            toast.error("Could not update follow status. Please try again.");
            setIsFollowing(wasFollowing);
        } finally {
            setIsLoadingFollow(false);
        }
    };

    return { isFollowing, toggleFollow, isMyUser, isLoadingFollow };
};