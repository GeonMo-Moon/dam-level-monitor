"use client";

import { getStatusInfo } from "./StatusBadge";

interface ProgressBarProps {
  rsvrt: number | null;
}

const colorMap: Record<string, string> = {
  "bg-blue-100 text-blue-700":     "bg-blue-500",
  "bg-green-100 text-green-700":   "bg-green-500",
  "bg-yellow-100 text-yellow-700": "bg-yellow-400",
  "bg-red-100 text-red-700":       "bg-red-500",
  "bg-gray-200 text-gray-600":     "bg-gray-300",
};

export default function ProgressBar({ rsvrt }: ProgressBarProps) {
  const { label, color } = getStatusInfo(rsvrt);
  const barColor = colorMap[color] ?? "bg-gray-300";
  const pct = rsvrt != null ? Math.min(Math.max(rsvrt, 0), 100) : 0;

  return (
    <div className="flex items-center gap-2 justify-end">
      <span className="text-xs text-gray-500 w-16 text-right shrink-0">
        {rsvrt != null ? `${rsvrt.toFixed(1)}%` : "-"}
      </span>
      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium w-8 shrink-0" style={{ color: "inherit" }}>
        {label}
      </span>
    </div>
  );
}
