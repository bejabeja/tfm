import React, { useState } from "react";

const ImageUpload = ({
  onUpload,
  imageUrl: initialImageUrl,
  imagePublicId: initialImagePublicId,
}) => {
  const [previewUrl, setPreviewUrl] = useState("");

  const handleSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostrar preview
    setPreviewUrl(URL.createObjectURL(file));

    // Pasar el archivo al formulario principal (para que lo envíe al backend)
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
 
  // useEffect(() => {
  //   setImageUrl(initialImageUrl || "");
  // }, [initialImageUrl]);

  // return (
  //   <div className="image-upload-container">
  //     <label
  //       htmlFor="image-upload-input"
  //       className={`btn ${imageUrl ? "btn__secondary" : "btn__primary"}`}
  //     >
  //       {imageUrl ? "Change Image" : "Upload Image"}
  //     </label>
  //     <input
  //       id="image-upload-input"
  //       type="file"
  //       onChange={handleUpload}
  //       accept="image/*"
  //       style={{ display: "none" }}
  //     />
  //     {loading && <p>Uploading...</p>}
  //     {imageUrl && (
  //       <img
  //         src={imageUrl}
  //         alt="Uploaded preview"
  //         className="image-upload-preview"
  //       />
  //     )}
  //   </div>
  // );
};

export default ImageUpload;
