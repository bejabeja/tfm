// Keep in sync with api/src/utils/cloudinaryUrl.js (api/ doesn't depend on
// client/ or shared/, so this transformation logic is duplicated by necessity).
const UPLOAD_MARKER = "/upload/";

export const optimizedCloudinaryUrl = (url, { width } = {}) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes(UPLOAD_MARKER)) {
    return url;
  }

  const transformations = ["f_auto", "q_auto", width && `w_${width}`].filter(Boolean).join(",");
  return url.replace(UPLOAD_MARKER, `${UPLOAD_MARKER}${transformations}/`);
};
