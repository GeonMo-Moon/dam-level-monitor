"use client";

import { useEffect, useState } from "react";
import { getStatusInfo } from "./StatusBadge";

interface StorageGaugeProps {
  rsvrt: number | null;
}

const svgColorMap: Record<string, string> = {
  "bg-blue-100 text-blue-700":     "#2563EB",
  "bg-green-100 text-green-700":   "#16A34A",
  "bg-yellow-100 text-yellow-700": "#CA8A04",
  "bg-red-100 text-red-700":       "#DC2626",
  "bg-gray-200 text-gray-600":     "#9CA3AF",
};

export default function StorageGauge({ rsvrt }: StorageGaugeProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // trigger animation on next frame
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { label, color } = getStatusInfo(rsvrt);
  const strokeColor = svgColorMap[color] ?? "#9CA3AF";
  const pct = rsvrt != null ? Math.min(Math.max(rsvrt, 0), 100) : 0;

  // Semicircle arc: radius=40, center=50,54, starts at 180°, sweeps 180°
  const R = 40;
  const circumference = Math.PI * R; // half circle = πr
  const offset = animated ? circumference * (1 - pct / 100) : circumference;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 58" className="w-32 h-auto overflow-visible">
        {/* track */}
        <path
          d="M10,54 A40,40 0 0,1 90,54"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* fill */}
        <path
          d="M10,54 A40,40 0 0,1 90,54"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* percentage text */}
        <text
          x="50"
          y="46"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill={strokeColor}
        >
          {rsvrt != null ? `${rsvrt.toFixed(1)}%` : "-"}
        </text>
      </svg>
      <span
        className="text-xs font-semibold mt-1 px-2 py-0.5 rounded"
        style={{ color: strokeColor, background: `${strokeColor}18` }}
      >
        {label}
      </span>
      <p className="text-xs text-gray-400 mt-1">저수율</p>
    </div>
  );
}
