import React, { useEffect, useState } from "react";

const ImageUpload = ({ onUpload, imageUrl: initialImageUrl }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    setImageUrl(initialImageUrl || "");
  }, [initialImageUrl]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dybgqufyi/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setImageUrl(data.secure_url);
      onUpload(data.secure_url); // enviar url al formulario padre
    } catch (error) {
      console.error("Error uploading image", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    onUpload("");
    setInputKey(Date.now());
  };

  return (
    <div className="image-upload-container">
      <div className="buttons-row">
        <label
          htmlFor="image-upload-input"
          className={`btn  ${imageUrl ? "btn__secondary" : "btn__primary"}`}
        >
          {imageUrl ? "Change Image" : "Upload Image"}
        </label>
        {imageUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="btn btn__danger"
            aria-label="Remove uploaded image"
          >
            Remove Image
          </button>
        )}
      </div>
      <input
        key={inputKey}
        id="image-upload-input"
        type="file"
        onChange={handleUpload}
        accept="image/*"
        style={{ display: "none" }}
      />
      {loading && <p>Uploading...</p>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded preview"
          className="image-upload-preview"
        />
      )}
    </div>
  );
};
export default ImageUpload;
