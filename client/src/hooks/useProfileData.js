import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllFollowers, getAllFollowing } from "../services/followers";
import { getUserById } from "../services/users";

export const useProfileData = (profileId) => {
    const { me, myItineraries, myFollowers, myFollowing } = useSelector(
        (state) => state.myInfo
    );
    
    const [userData, setUserData] = useState(null);
    const [followersData, setFollowersData] = useState(null);
    const [followingData, setFollowingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingFollowers, setLoadingFollowers] = useState(true);
    const [loadingFollowing, setLoadingFollowing] = useState(true);
    const [error, setError] = useState(null);

    const [isReady, setIsReady] = useState(false);

    const isMyProfile = me?.data?.id === profileId;

    const user = isMyProfile ? me?.data : userData;
    const followers = isMyProfile ? myFollowers?.data : followersData;
    const following = isMyProfile ? myFollowing?.data : followingData;

    useEffect(() => {
        if (me?.data) {
            setIsReady(true); //isAuthenticated
        }
    }, [me?.data]);

    useEffect(() => {
        if (!isReady) return;

        const fetchData = async () => {
            if (!isMyProfile) {
                try {
                    const [userRes, followersRes, followingRes] = await Promise.all([
                        getUserById(profileId),
                        getAllFollowers(profileId),
                        getAllFollowing(profileId)
                    ]);
                    setUserData(userRes);
                    setFollowersData(followersRes);
                    setFollowingData(followingRes);
                } catch (err) {
                    setError(err);
                } finally {
                    setLoading(false);
                    setLoadingFollowers(false);
                    setLoadingFollowing(false);
                }
            } else {
                setLoading(false);
                setLoadingFollowers(false);
                setLoadingFollowing(false);
            }
        };

        fetchData();
    }, [isReady, profileId, isMyProfile]);

    return {
        user,
        followers,
        following,
        myItineraries,
        isMyProfile,
        loading,
        loadingFollowers,
        loadingFollowing,
        error,
    };
};
