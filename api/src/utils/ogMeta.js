import { optimizedCloudinaryUrl } from './cloudinaryUrl.js';

const DESCRIPTION_MAX_LENGTH = 160;
const OG_IMAGE_WIDTH = 1200;

export const buildItineraryOgMeta = (itinerary, appUrl) => {
    const title = itinerary.title || 'Trip on ToBeATraveller';
    const description = itinerary.description
        ? itinerary.description.slice(0, DESCRIPTION_MAX_LENGTH)
        : `A ${itinerary.tripTotalDays}-day trip to ${itinerary.location?.name || 'an amazing destination'}`;
    const imageUrl = optimizedCloudinaryUrl(itinerary.photoUrl, { width: OG_IMAGE_WIDTH }) || `${appUrl}/images/hero.jpg`;

    return { title, description, imageUrl };
};

export const buildUserOgMeta = (user) => {
    const title = `@${user.username}`;
    const description = user.bio || user.about || `${user.username}'s travel itineraries on ToBeATraveller`;
    const imageUrl = optimizedCloudinaryUrl(user.avatarUrl, { width: OG_IMAGE_WIDTH });

    return { title, description, imageUrl };
};
