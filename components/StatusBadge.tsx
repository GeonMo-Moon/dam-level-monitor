"use client";

interface StatusBadgeProps {
  rsvrt: number | null;
}

export function getStatusInfo(rsvrt: number | null) {
  if (rsvrt === null) return { label: "정보없음", color: "bg-gray-200 text-gray-600", markerColor: "#9CA3AF" };
  if (rsvrt >= 80) return { label: "풍수",   color: "bg-blue-100 text-blue-700",   markerColor: "#2563EB" };
  if (rsvrt >= 50) return { label: "정상",   color: "bg-green-100 text-green-700", markerColor: "#16A34A" };
  if (rsvrt >= 30) return { label: "주의",   color: "bg-yellow-100 text-yellow-700", markerColor: "#CA8A04" };
  return             { label: "경계",   color: "bg-red-100 text-red-700",     markerColor: "#DC2626" };
}

export default function StatusBadge({ rsvrt }: StatusBadgeProps) {
  const { label, color } = getStatusInfo(rsvrt);
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${color}`}>
      {label}{rsvrt !== null ? ` ${rsvrt.toFixed(1)}%` : ""}
    </span>
  );
}
