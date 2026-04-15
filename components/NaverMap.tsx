"use client";

import { useEffect, useRef, useState } from "react";
import { DamWithWaterLevel } from "@/types/dam";
import { getStatusInfo } from "./StatusBadge";

interface NaverMapProps {
  dams: DamWithWaterLevel[];
  visible: boolean;
  onDamSelect?: (dam: DamWithWaterLevel) => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
  }
}

export default function NaverMap({ dams, visible, onDamSelect }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const onDamSelectRef = useRef(onDamSelect);
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);

  // Keep ref in sync so the marker closures always call the latest version
  useEffect(() => {
    onDamSelectRef.current = onDamSelect;
  }, [onDamSelect]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!clientId) return;

    function initMap() {
      if (!mapRef.current || !window.naver?.maps) return;
      if (mapInstanceRef.current) return;

      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(36.5, 127.8),
        zoom: 7,
        mapTypeId: window.naver.maps.MapTypeId.NORMAL,
      });
      mapInstanceRef.current = map;

      dams.forEach((dam) => {
        const rsvrt = dam.current?.rsvwtrt ?? null;
        const { markerColor } = getStatusInfo(rsvrt);

        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(dam.lat, dam.lng),
          map,
          icon: {
            content: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
              <div style="
                width:14px; height:14px;
                background:${markerColor};
                border:2px solid #fff;
                border-radius:50%;
                box-shadow:0 1px 4px rgba(0,0,0,0.3);
              "></div>
              <div style="
                margin-top:3px;
                background:rgba(0,0,0,0.65);
                color:#fff;
                font-size:11px;
                font-weight:600;
                padding:1px 5px;
                border-radius:3px;
                white-space:nowrap;
                pointer-events:none;
              ">${dam.damnm}</div>
            </div>`,
            anchor: new window.naver.maps.Point(7, 7),
          },
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          onDamSelectRef.current?.(dam);
        });
      });

      window.naver.maps.Event.addListener(map, "click", (e: { coord: { lat: () => number; lng: () => number } }) => {
        const lat = Math.round(e.coord.lat() * 1000000) / 1000000;
        const lng = Math.round(e.coord.lng() * 1000000) / 1000000;
        setClickedCoord({ lat, lng });
      });
    }

    const scriptId = "naver-map-sdk";

    if (window.naver?.maps) {
      initMap();
      return;
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      const existing = document.getElementById(scriptId) as HTMLScriptElement;
      existing.addEventListener("load", initMap);
    }
  // dams는 초기 한 번만 실행
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (!mapInstanceRef.current || !window.naver?.maps) return;

    const timer = setTimeout(() => {
      window.naver.maps.Event.trigger(mapInstanceRef.current, "resize");
    }, 50);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      {clickedCoord && (
        <div style={{
          position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.75)", color: "#fff",
          borderRadius: 8, padding: "8px 14px",
          fontSize: 13, display: "flex", alignItems: "center", gap: 10,
          zIndex: 100, whiteSpace: "nowrap",
        }}>
          <span>위도 <strong>{clickedCoord.lat}</strong> · 경도 <strong>{clickedCoord.lng}</strong></span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`{ lat: ${clickedCoord.lat}, lng: ${clickedCoord.lng} }`);
            }}
            style={{ background: "#3b82f6", border: "none", color: "#fff", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 12 }}
          >
            복사
          </button>
          <button
            onClick={() => setClickedCoord(null)}
            style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
