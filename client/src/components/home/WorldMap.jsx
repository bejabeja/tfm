import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Tooltip, useMap } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getDestinations } from "../../services/itineraries";
import "./WorldMap.scss";

setWorkerUrl(maplibreWorkerUrl);

const BASEMAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const BASEMAP_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> ' +
  '&copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> ' +
  'Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';

const createDestinationMarker = (count) =>
  L.divIcon({
    className: "",
    html: `<div class="world-map__pin">${count > 99 ? "99+" : count}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

// The OpenMapTiles vector schema carries the local name in `name` and the
// English one in `name_en`; the default style prefers the local name, so
// every label layer using `name` gets forced to `name_en` (falling back to
// `name` when a feature has no English variant).
const forceEnglishLabels = (maplibreMap) => {
  maplibreMap
    .getStyle()
    .layers.filter(
      (layer) =>
        layer.type === "symbol" &&
        JSON.stringify(layer.layout?.["text-field"] ?? "").includes("name")
    )
    .forEach((layer) => {
      maplibreMap.setLayoutProperty(layer.id, "text-field", [
        "coalesce",
        ["get", "name_en"],
        ["get", "name"],
      ]);
    });
};

const EnglishBasemap = () => {
  const map = useMap();

  useEffect(() => {
    const glLayer = maplibreGL({
      style: BASEMAP_STYLE_URL,
      attribution: BASEMAP_ATTRIBUTION,
    }).addTo(map);
    const maplibreMap = glLayer.getMaplibreMap();

    if (maplibreMap.isStyleLoaded()) forceEnglishLabels(maplibreMap);
    else maplibreMap.once("load", () => forceEnglishLabels(maplibreMap));

    return () => map.removeLayer(glLayer);
  }, [map]);

  return null;
};

// Destinations close enough to visually overlap at the map's low default
// zoom get grouped into clusters (transitively: A-close-to-B and B-close-to-C
// join the same cluster even if A and C aren't close enough on their own),
// then spread evenly around their cluster's centroid so nearby pins stay
// individually clickable instead of stacking exactly on top of each other.
const OVERLAP_THRESHOLD_DEG = 7;
const OVERLAP_RADIUS_DEG = 6;

const spreadOverlappingDestinations = (destinations) => {
  const points = destinations.map((dest) => ({
    ...dest,
    lat: parseFloat(dest.lat),
    lon: parseFloat(dest.lon),
  }));

  const clusterOf = points.map((_, i) => i);
  const find = (i) => (clusterOf[i] === i ? i : (clusterOf[i] = find(clusterOf[i])));
  const union = (a, b) => { clusterOf[find(a)] = find(b); };

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const closeEnough = Math.abs(points[i].lat - points[j].lat) < OVERLAP_THRESHOLD_DEG
        && Math.abs(points[i].lon - points[j].lon) < OVERLAP_THRESHOLD_DEG;
      if (closeEnough) union(i, j);
    }
  }

  const clusterMembers = {};
  points.forEach((_, i) => {
    const root = find(i);
    (clusterMembers[root] ??= []).push(i);
  });

  return points.map((point, i) => {
    const members = clusterMembers[find(i)];
    if (members.length === 1) return point;

    const centroid = members.reduce(
      (acc, idx) => ({ lat: acc.lat + points[idx].lat / members.length, lon: acc.lon + points[idx].lon / members.length }),
      { lat: 0, lon: 0 }
    );
    const angle = (members.indexOf(i) / members.length) * 2 * Math.PI;
    return {
      ...point,
      lat: centroid.lat + Math.sin(angle) * OVERLAP_RADIUS_DEG,
      lon: centroid.lon + Math.cos(angle) * OVERLAP_RADIUS_DEG,
    };
  });
};

const WorldMap = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const spreadDestinations = useMemo(() => spreadOverlappingDestinations(destinations), [destinations]);

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(() => {});
  }, []);

  return (
    <div className="world-map">
      <MapContainer
        center={[20, 10]}
        zoom={2}
        className="world-map__container"
        scrollWheelZoom={false}
        minZoom={2}
        maxZoom={10}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
      >
        <EnglishBasemap />
        {spreadDestinations.map((dest, i) => (
          <Marker
            key={i}
            position={[dest.lat, dest.lon]}
            icon={createDestinationMarker(dest.count)}
            eventHandlers={{
              click: () => navigate(`/explore?location=${encodeURIComponent(dest.name)}`),
            }}
          >
            <Tooltip direction="top" offset={[0, -20]}>
              <strong>{dest.name}</strong>
              <span>{t("home.worldMapItineraryCount", { count: dest.count })}</span>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
