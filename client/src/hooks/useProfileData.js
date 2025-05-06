import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllFollowers, getAllFollowing } from "../services/followers";
import { getItinerariesByUserId } from "../services/itineraries";
import { getUserById } from "../services/users";

export const useProfileData = (profileId) => {
    const { me, myItineraries, myFollowers, myFollowing } = useSelector(
        (state) => state.myInfo
    );
    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const [userData, setUserData] = useState(null);
    const [userItineraries, setUserItineraries] = useState(null);


    const [followersData, setFollowersData] = useState(null);
    const [followingData, setFollowingData] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingFollowers, setLoadingFollowers] = useState(true);
    const [loadingFollowing, setLoadingFollowing] = useState(true);
    const [loadingItineraries, setLoadingItineraries] = useState(true);
    const [error, setError] = useState(null);

    const [isReady, setIsReady] = useState(false);

    const isMyProfile = me?.data?.id === profileId;

    const user = isMyProfile ? me?.data : userData;
    const followers = isMyProfile ? myFollowers?.data : followersData;
    const following = isMyProfile ? myFollowing?.data : followingData;
    const itineraries = isMyProfile ? myItineraries?.data : userItineraries;

    // useEffect(() => {

    //     if (me?.data) {
    //         setIsReady(true);
    //     }

    // }, [me?.data]);

    useEffect(() => {
        // if (!isReady) return;

        const fetchData = async () => {
            if (!isMyProfile) {
                try {
                    const userRes = await getUserById(profileId);
                    const itinerariesRes = await getItinerariesByUserId(profileId)
                    setUserData(userRes);
                    setUserItineraries(itinerariesRes)
                    
                    if (isAuthenticated) {
                        const [followersRes, followingRes] = await Promise.all([
                            getAllFollowers(profileId),
                            getAllFollowing(profileId),
                        ]);
                        setFollowersData(followersRes);
                        setFollowingData(followingRes);
                    }
                } catch (err) {
                    setError(err);
                } finally {
                    setLoadingUser(false);
                    setLoadingFollowers(false);
                    setLoadingFollowing(false);
                    setLoadingItineraries(false);
                }
            } else {
                setLoadingUser(false);
                setLoadingFollowers(false);
                setLoadingFollowing(false);
                setLoadingItineraries(false);
            }
        };

        fetchData();
    }, [isReady, profileId, isMyProfile]);


    return {
        user,
        followers,
        following,
        itineraries,
        isMyProfile,
        loadingUser,
        loadingFollowers,
        loadingFollowing,
        loadingItineraries,
        error,
        isAuthenticated
    };
};
