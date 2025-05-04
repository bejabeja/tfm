import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserById } from "../services/user";

export const useProfileData = (profileId) => {
    const { me, myItineraries } = useSelector((state) => state.myInfo);
    const isMyProfile = me?.data?.id === profileId;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = isMyProfile ? me.data : userData;
    useEffect(() => {
        const fetchUser = async () => {
            if (isMyProfile) return setLoading(false);

            try {
                const data = await getUserById(profileId);
                setUserData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [profileId, isMyProfile]);

    return { user, myItineraries, loading, error, isMyProfile };
};