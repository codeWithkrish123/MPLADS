import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface StateSummary {
  state: string;
  code?: string;
  latitude?: number;
  longitude?: number;
}

interface HeroMapProps {
  states: StateSummary[];
  selectedState: string;
  onSelectState: (state: string) => void;
}

export const HeroMap: React.FC<HeroMapProps> = ({
  states,
  selectedState,
  onSelectState,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current!).setView([20.5937, 78.9629], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance.current);
    }

    const markersLayer = L.layerGroup().addTo(mapInstance.current);
    states.forEach((st) => {
      if (st.latitude && st.longitude) {
        const marker = L.marker([st.latitude, st.longitude]).addTo(markersLayer);
        marker.on("click", () => onSelectState(st.state));
        if (st.state === selectedState) {
          // Optional custom styling for selected state
        }
      }
    });

    return () => {
      markersLayer.clearLayers();
    };
  }, [states, selectedState, onSelectState]);

  return <div className="hero-map h-96 w-full rounded-lg shadow-md" ref={mapRef} />;
};
