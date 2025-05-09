import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllFollowers, getAllFollowing } from "../services/followers";
import { getItinerariesByUserId } from "../services/itineraries";
import { getUserById } from "../services/users";
import { selectIsAuthenticated } from "../store/auth/authSelectors";
import { selectMe, selectMyFollowers, selectMyFollowing, selectMyItineraries } from "../store/user/userInfoSelectors";

export const useProfileData = (profileId) => {
    const userMe = useSelector(selectMe)
    const myItineraries = useSelector(selectMyItineraries)
    const myFollowers = useSelector(selectMyFollowers)
    const myFollowing = useSelector(selectMyFollowing)
    const isAuthenticated = useSelector(selectIsAuthenticated)

    const [userData, setUserData] = useState(null);
    const [userItineraries, setUserItineraries] = useState(null);


    const [followersData, setFollowersData] = useState(null);
    const [followingData, setFollowingData] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingFollowers, setLoadingFollowers] = useState(true);
    const [loadingFollowing, setLoadingFollowing] = useState(true);
    const [loadingItineraries, setLoadingItineraries] = useState(true);
    const [error, setError] = useState(null);

    const isMyProfile = userMe?.id === profileId;

    const user = isMyProfile ? userMe : userData;
    const followers = isMyProfile ? myFollowers : followersData;
    const following = isMyProfile ? myFollowing : followingData;
    const itineraries = isMyProfile ? myItineraries : userItineraries;

    // useEffect(() => {

    //     if (userMe) {
    //         setIsReady(true);
    //     }

    // }, [userMe]);

    useEffect(() => {
        // if (!isReady) return;

        const fetchData = async () => {
            if (isAuthenticated && userMe === null) return;
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
    }, [profileId, isMyProfile, userMe]);


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
