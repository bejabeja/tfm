import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "./Map.scss";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Map = ({ location }) => {
  const coordinates = [location.lat, location.lon];

  if (!coordinates) {
    return <p className="map__error">No map available</p>;
  }
  return (
    <div className="map">
      <MapContainer
        center={coordinates}
        zoom={13}
        // scrollWheelZoom={false}
        // zoomControl={false}
        className="map__container"
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>Trip location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
