import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineCameraAlt } from "react-icons/md";
import "./ImageUpload.scss";

const ImageUpload = ({ onUpload, imageUrl: initialImageUrl, isComplete }) => {
  const { t } = useTranslation();
  const f = (key) => t(`itineraryForm.${key}`);

  const [previewUrl, setPreviewUrl] = useState(initialImageUrl || "");
  const [fileName, setFileName]     = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(initialImageUrl || "");
  }, [initialImageUrl]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    onUpload(file);
  };

  const handleSelectFile = (e) => handleFile(e.target.files[0]);
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleClear = () => {
    setPreviewUrl("");
    setFileName("");
    onUpload(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="image-upload-container">
      <h2 className="form__subtitle">
        {f("coverPhotoTitle")}
        {isComplete && <span className="form__section-check">✓</span>}
      </h2>

      {!previewUrl ? (
        <label
          htmlFor="image-upload-input"
          className={`form__dropzone${isDragging ? " form__dropzone--dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <MdOutlineCameraAlt className="form__dropzone-icon" />
          <span className="form__dropzone-text">{f("dropPhotoHere")}</span>
          <span className="form__dropzone-hint">
            {f("orBrowse")} <span className="form__dropzone-link">{f("browseFiles")}</span>
          </span>
        </label>
      ) : (
        <div className="form__dropzone-preview">
          <img src={previewUrl} alt={f("coverPhotoTitle")} className="image-upload-preview" />
          <div className="form__dropzone-actions">
            <label htmlFor="image-upload-input" className="btn btn--secondary">
              {f("changePhoto")}
            </label>
            <button type="button" className="btn btn--danger-outline image-upload-clear" onClick={handleClear}>
              {f("removePhoto")}
            </button>
          </div>
          {fileName && (
            <span className="image-upload-filename" title={fileName}>
              {fileName}
            </span>
          )}
        </div>
      )}

      <input
        id="image-upload-input"
        ref={inputRef}
        type="file"
        onChange={handleSelectFile}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUpload;
