export const buildItineraryJsonLd = ({ itinerary, author, description, image, url }) => {
  if (!itinerary) return null;

  const places = itinerary.places?.length
    ? {
        "@type": "ItemList",
        itemListElement: itinerary.places.map((place, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Place",
            name: place.name,
            ...(place.address ? { address: place.address } : {}),
          },
        })),
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: itinerary.title,
    description,
    image,
    url,
    ...(author ? { provider: { "@type": "Person", name: author.username } } : {}),
    ...(places ? { itinerary: places } : {}),
  };
};

export const buildProfileJsonLd = ({ user, description, image, url }) => {
  if (!user) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: user.name || user.username,
      alternateName: `@${user.username}`,
      description,
      ...(image ? { image } : {}),
      url,
    },
  };
};
