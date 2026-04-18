"use client";

import { useEffect, useState } from "react";
import { getStatusInfo } from "./StatusBadge";

interface StorageGaugeProps {
  rsvrt: number | null;
}

const hexColorMap: Record<string, string> = {
  "bg-blue-100 text-blue-700":     "#2563EB",
  "bg-green-100 text-green-700":   "#16A34A",
  "bg-yellow-100 text-yellow-700": "#CA8A04",
  "bg-red-100 text-red-700":       "#DC2626",
  "bg-gray-200 text-gray-600":     "#9CA3AF",
};

// Wave SVG path — 2 full periods in viewBox 200×20, loops seamlessly
const WAVE_PATH = "M0,10 Q25,2 50,10 Q75,18 100,10 Q125,2 150,10 Q175,18 200,10 L200,20 L0,20 Z";

export default function StorageGauge({ rsvrt }: StorageGaugeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { label, color } = getStatusInfo(rsvrt);
  const fillColor = hexColorMap[color] ?? "#9CA3AF";
  const pct = rsvrt != null ? Math.min(Math.max(rsvrt, 0), 100) : 0;
  const displayPct = mounted ? pct : 0;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Circular water tank */}
      <div
        className="relative w-32 h-32 rounded-full overflow-hidden"
        style={{
          boxShadow: `0 0 0 3px ${fillColor}30, 0 0 0 6px ${fillColor}10`,
          border: `3px solid ${fillColor}50`,
          background: "#F9FAFB",
        }}
      >
        {/* Static water fill */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: `${displayPct}%`,
            background: `${fillColor}22`,
            transition: "height 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        />

        {/* Wave at water surface */}
        <div
          className="absolute left-0 h-5 overflow-hidden"
          style={{
            width: "200%",
            bottom: `calc(${displayPct}% - 10px)`,
            transition: "bottom 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="water-wave-anim w-full h-full">
            <svg
              viewBox="0 0 200 20"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path d={WAVE_PATH} fill={fillColor} opacity="0.55" />
            </svg>
          </div>
        </div>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span
            className="text-xl font-bold leading-tight"
            style={{ color: fillColor }}
          >
            {rsvrt != null ? `${rsvrt.toFixed(1)}%` : "-"}
          </span>
          <span
            className="text-xs font-semibold mt-0.5 px-1.5 py-0.5 rounded"
            style={{ color: fillColor, background: `${fillColor}18` }}
          >
            {label}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-400">저수율</p>
    </div>
  );
}
