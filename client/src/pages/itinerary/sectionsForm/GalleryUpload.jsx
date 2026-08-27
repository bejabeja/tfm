import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdClose, MdOutlineAddPhotoAlternate } from "react-icons/md";
import "./GalleryUpload.scss";

const MAX_GALLERY_IMAGES = 6;

const toPreview = (item) => (item instanceof File ? URL.createObjectURL(item) : item.photoUrl);
const toKey = (item, index) => (item instanceof File ? `file-${item.name}-${index}` : item.id);

const GalleryUpload = ({ images, onChange }) => {
  const { t } = useTranslation();
  const f = (key) => t(`itineraryForm.${key}`);
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (fileList) => {
    const newFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (!newFiles.length) return;
    onChange([...images, ...newFiles].slice(0, MAX_GALLERY_IMAGES));
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSelectFiles = (e) => addFiles(e.target.files);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeAt = (index) => onChange(images.filter((_, i) => i !== index));

  const canAddMore = images.length < MAX_GALLERY_IMAGES;

  return (
    <div className="gallery-upload">
      <h2 className="form__subtitle">{f("galleryTitle")}</h2>
      <div className="gallery-upload__grid">
        {images.map((item, index) => (
          <div className="gallery-upload__thumb" key={toKey(item, index)}>
            <img src={toPreview(item)} alt="" />
            <button
              type="button"
              className="gallery-upload__remove"
              onClick={() => removeAt(index)}
              aria-label={f("removePhoto")}
            >
              <MdClose />
            </button>
          </div>
        ))}

        {canAddMore && (
          <label
            htmlFor="gallery-upload-input"
            className={`gallery-upload__add${isDragging ? " gallery-upload__add--dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <MdOutlineAddPhotoAlternate className="gallery-upload__add-icon" />
            <span>{f("addMorePhotos")}</span>
          </label>
        )}
      </div>

      <input
        id="gallery-upload-input"
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelectFiles}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default GalleryUpload;
