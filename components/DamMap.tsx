"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { DamWithWaterLevel } from "@/types/dam";
import { getStatusInfo } from "./StatusBadge";
import "leaflet/dist/leaflet.css";

interface DamMapProps {
  dams: DamWithWaterLevel[];
  visible: boolean;
  onDamSelect?: (dam: DamWithWaterLevel) => void;
}

function MapResizer({ visible }: { visible: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 50);
    return () => clearTimeout(timer);
  }, [visible, map]);
  return null;
}

export default function DamMap({ dams, visible, onDamSelect }: DamMapProps) {
  return (
    <MapContainer
      center={[36.5, 127.8]}
      zoom={7}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      <MapResizer visible={visible} />
      {dams.map((dam) => {
        const rsvrt = dam.current?.rsvwtrt ?? null;
        const { markerColor } = getStatusInfo(rsvrt);
        return (
          <CircleMarker
            key={dam.id}
            center={[dam.lat, dam.lng]}
            radius={8}
            fillColor={markerColor}
            color="#fff"
            weight={1.5}
            fillOpacity={0.9}
            eventHandlers={{
              click: () => onDamSelect?.(dam),
            }}
          >
            <Tooltip permanent direction="bottom" offset={[0, 6]} opacity={1} className="dam-label">
              {dam.damnm}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
