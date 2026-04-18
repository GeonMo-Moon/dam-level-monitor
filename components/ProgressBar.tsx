"use client";

import { getStatusInfo } from "./StatusBadge";

interface ProgressBarProps {
  rsvrt: number | null;
}

const hexColorMap: Record<string, string> = {
  "bg-blue-100 text-blue-700":     "#2563EB",
  "bg-green-100 text-green-700":   "#16A34A",
  "bg-yellow-100 text-yellow-700": "#CA8A04",
  "bg-red-100 text-red-700":       "#DC2626",
  "bg-gray-200 text-gray-600":     "#9CA3AF",
};

export default function ProgressBar({ rsvrt }: ProgressBarProps) {
  const { label, color } = getStatusInfo(rsvrt);
  const fillColor = hexColorMap[color] ?? "#9CA3AF";
  const pct = rsvrt != null ? Math.min(Math.max(rsvrt, 0), 100) : 0;

  return (
    <div className="flex items-center gap-2 justify-end">
      <span className="text-xs text-gray-500 w-16 text-right shrink-0">
        {rsvrt != null ? `${rsvrt.toFixed(1)}%` : "-"}
      </span>
      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
        {/* Bar fill with shimmer */}
        <div
          className="h-full rounded-full relative overflow-hidden shimmer-bar"
          style={{
            width: `${pct}%`,
            background: fillColor,
            transition: "width 0.7s ease-out",
          }}
        />
      </div>
      <span className="text-xs font-medium w-8 shrink-0" style={{ color: fillColor }}>
        {label}
      </span>
    </div>
  );
}
