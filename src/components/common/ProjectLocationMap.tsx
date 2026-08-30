import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ProjectLocationMapProps {
  lat: number;
  lng: number;
  label?: string;
}

export const ProjectLocationMap: React.FC<ProjectLocationMapProps> = ({ lat, lng, label }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, {
      center: [lat, lng],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);
    const marker = L.circleMarker([lat, lng], {
      radius: 8,
      color: "#003399",
      fillColor: "#003399",
      fillOpacity: 0.85,
      weight: 2,
    }).addTo(map);
    if (label) marker.bindPopup(label);
    return () => {
      map.remove();
    };
  }, [lat, lng, label]);

  return (
    <div
      ref={ref}
      className="h-64 w-full overflow-hidden rounded-md border border-[#E2E8F0]"
      role="img"
      aria-label={label ? `Map location for ${label}` : "Project location map"}
    />
  );
};
