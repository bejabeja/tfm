import { optimizedCloudinaryUrl } from "./cloudinaryUrl.js";

describe("optimizedCloudinaryUrl", () => {
  it("inserts f_auto,q_auto right after /upload/", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/v1/itineraries/abc.jpg";

    expect(optimizedCloudinaryUrl(url)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1/itineraries/abc.jpg"
    );
  });

  it("adds a width transformation when width is given", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/v1/itineraries/abc.jpg";

    expect(optimizedCloudinaryUrl(url, { width: 480 })).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_480/v1/itineraries/abc.jpg"
    );
  });

  it("leaves non-Cloudinary URLs untouched", () => {
    const url = "https://ui-avatars.com/api/?name=Jane&background=random";

    expect(optimizedCloudinaryUrl(url, { width: 480 })).toBe(url);
  });

  it("passes through falsy values without throwing", () => {
    expect(optimizedCloudinaryUrl(undefined)).toBeUndefined();
    expect(optimizedCloudinaryUrl("")).toBe("");
  });
});
