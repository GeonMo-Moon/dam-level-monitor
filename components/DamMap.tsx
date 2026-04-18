"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { DamWithWaterLevel } from "@/types/dam";
import { getStatusInfo } from "./StatusBadge";
import "leaflet/dist/leaflet.css";

interface DamMapProps {
  dams: DamWithWaterLevel[];
  visible: boolean;
  onDamSelect?: (dam: DamWithWaterLevel) => void;
}

// keyframe style injected once into <head>
const STYLE_ID = "dam-marker-keyframes";
function ensureKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes dam-ring {
      0%   { transform: translate(-50%,-50%) scale(1); opacity: .7; }
      100% { transform: translate(-50%,-50%) scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(s);
}

function createDamIcon(markerColor: string, pulse: boolean): L.DivIcon {
  ensureKeyframes();
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:20px;height:20px;">
        ${pulse ? `
          <div style="
            position:absolute;
            top:50%;left:50%;
            width:12px;height:12px;
            border-radius:50%;
            background:${markerColor};
            animation:dam-ring 1.8s ease-out infinite;
            pointer-events:none;
          "></div>` : ""}
        <div style="
          position:absolute;
          top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:12px;height:12px;
          border-radius:50%;
          background:${markerColor};
          border:2.5px solid white;
          box-shadow:0 1px 4px rgba(0,0,0,.35);
        "></div>
      </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    tooltipAnchor: [0, 10],
  });
}

function MapResizer({ visible }: { visible: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => map.invalidateSize(), 50);
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
        const pulse = rsvrt !== null && rsvrt < 50;

        return (
          <Marker
            key={dam.id}
            position={[dam.lat, dam.lng]}
            icon={createDamIcon(markerColor, pulse)}
            eventHandlers={{ click: () => onDamSelect?.(dam) }}
          >
            <Tooltip
              permanent
              direction="bottom"
              offset={[0, 10]}
              opacity={1}
              className="dam-label"
            >
              {dam.damnm}
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
