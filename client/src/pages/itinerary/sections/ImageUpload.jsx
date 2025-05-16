import React, { useEffect, useState } from "react";

const ImageUpload = ({ onUpload, imageUrl: initialImageUrl }) => {
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl || "");

  useEffect(() => {
    setPreviewUrl(initialImageUrl || "");
  }, [initialImageUrl]);

  const handleSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    onUpload(file);
  };

  return (
    <div className="image-upload-container">
      <label htmlFor="image-upload-input" className="btn btn__primary">
        Upload Image
      </label>
      <input
        id="image-upload-input"
        type="file"
        onChange={handleSelectFile}
        accept="image/*"
        style={{ display: "none" }}
      />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Uploaded preview"
          className="image-upload-preview"
        />
      )}
    </div>
  );
};

export default ImageUpload;
