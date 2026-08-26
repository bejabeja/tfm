import { buildItineraryJsonLd, buildProfileJsonLd } from "./jsonLd.js";

describe("buildItineraryJsonLd", () => {
  const baseArgs = {
    itinerary: { title: "3 days in Kyoto", places: [] },
    description: "A short trip",
    image: "https://cdn/photo.jpg",
    url: "https://example.com/itinerary/1",
  };

  it("returns null while the itinerary hasn't loaded yet", () => {
    expect(buildItineraryJsonLd({ ...baseArgs, itinerary: null })).toBeNull();
  });

  it("builds a TouristTrip with the given name, description, image and url", () => {
    const jsonLd = buildItineraryJsonLd(baseArgs);

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("TouristTrip");
    expect(jsonLd.name).toBe("3 days in Kyoto");
    expect(jsonLd.description).toBe("A short trip");
    expect(jsonLd.image).toBe("https://cdn/photo.jpg");
    expect(jsonLd.url).toBe("https://example.com/itinerary/1");
  });

  it("omits provider when no author is given", () => {
    expect(buildItineraryJsonLd(baseArgs).provider).toBeUndefined();
  });

  it("includes the author as a Person under provider", () => {
    const jsonLd = buildItineraryJsonLd({ ...baseArgs, author: { username: "jane" } });

    expect(jsonLd.provider).toEqual({ "@type": "Person", name: "jane" });
  });

  it("omits the itinerary places list when there are no places", () => {
    expect(buildItineraryJsonLd(baseArgs).itinerary).toBeUndefined();
  });

  it("maps places to an ordered ItemList of Place items", () => {
    const jsonLd = buildItineraryJsonLd({
      ...baseArgs,
      itinerary: {
        ...baseArgs.itinerary,
        places: [
          { name: "Fushimi Inari", address: "Kyoto" },
          { name: "Arashiyama Bamboo Grove" },
        ],
      },
    });

    expect(jsonLd.itinerary["@type"]).toBe("ItemList");
    expect(jsonLd.itinerary.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, item: { "@type": "Place", name: "Fushimi Inari", address: "Kyoto" } },
      { "@type": "ListItem", position: 2, item: { "@type": "Place", name: "Arashiyama Bamboo Grove" } },
    ]);
  });
});

describe("buildProfileJsonLd", () => {
  const baseArgs = {
    user: { username: "jane" },
    description: "Travelling the world",
    url: "https://example.com/friend-profile/1",
  };

  it("returns null while the user hasn't loaded yet", () => {
    expect(buildProfileJsonLd({ ...baseArgs, user: null })).toBeNull();
  });

  it("builds a ProfilePage with a Person mainEntity", () => {
    const jsonLd = buildProfileJsonLd(baseArgs);

    expect(jsonLd["@type"]).toBe("ProfilePage");
    expect(jsonLd.mainEntity).toEqual({
      "@type": "Person",
      name: "jane",
      alternateName: "@jane",
      description: "Travelling the world",
      url: "https://example.com/friend-profile/1",
    });
  });

  it("prefers the display name over the username when both exist", () => {
    const jsonLd = buildProfileJsonLd({ ...baseArgs, user: { username: "jane", name: "Jane Doe" } });

    expect(jsonLd.mainEntity.name).toBe("Jane Doe");
  });

  it("includes the image only when one is given", () => {
    expect(buildProfileJsonLd(baseArgs).mainEntity.image).toBeUndefined();
    expect(buildProfileJsonLd({ ...baseArgs, image: "https://cdn/avatar.jpg" }).mainEntity.image).toBe(
      "https://cdn/avatar.jpg"
    );
  });
});
