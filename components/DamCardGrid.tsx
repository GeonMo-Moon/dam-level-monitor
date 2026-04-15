"use client";

import Link from "next/link";
import { DamWithWaterLevel } from "@/types/dam";
import { getStatusInfo } from "./StatusBadge";
import { daysForKorea, formatSupply } from "@/lib/water-usage";

interface DamCardGridProps {
  dams: DamWithWaterLevel[];
}

const barColorMap: Record<string, string> = {
  "bg-blue-100 text-blue-700":     "bg-blue-500",
  "bg-green-100 text-green-700":   "bg-green-500",
  "bg-yellow-100 text-yellow-700": "bg-yellow-400",
  "bg-red-100 text-red-700":       "bg-red-500",
  "bg-gray-200 text-gray-600":     "bg-gray-300",
};

const borderColorMap: Record<string, string> = {
  "bg-blue-100 text-blue-700":     "border-blue-200",
  "bg-green-100 text-green-700":   "border-green-200",
  "bg-yellow-100 text-yellow-700": "border-yellow-300",
  "bg-red-100 text-red-700":       "border-red-300",
  "bg-gray-200 text-gray-600":     "border-gray-200",
};

const textColorMap: Record<string, string> = {
  "bg-blue-100 text-blue-700":     "text-blue-700",
  "bg-green-100 text-green-700":   "text-green-700",
  "bg-yellow-100 text-yellow-700": "text-yellow-700",
  "bg-red-100 text-red-700":       "text-red-700",
  "bg-gray-200 text-gray-600":     "text-gray-600",
};

export default function DamCardGrid({ dams }: DamCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {dams.map((dam) => {
        const rsvrt = dam.current?.rsvwtrt ?? null;
        const { label, color } = getStatusInfo(rsvrt);
        const barColor = barColorMap[color] ?? "bg-gray-300";
        const borderColor = borderColorMap[color] ?? "border-gray-200";
        const textColor = textColorMap[color] ?? "text-gray-600";
        const pct = rsvrt != null ? Math.min(Math.max(rsvrt, 0), 100) : 0;
        const supply = formatSupply(daysForKorea(dam.current?.nowrsvwtqy ?? null));

        return (
          <Link
            key={dam.id}
            href={`/dams/${encodeURIComponent(dam.damnm)}`}
            className={`block bg-white rounded-xl border ${borderColor} p-4 hover:shadow-md transition-all group`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {dam.damnm}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{dam.region} · {dam.suge}수계</p>
              </div>
              <span className={`text-xs font-bold ${textColor} shrink-0`}>{label}</span>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>저수율</span>
                <span className={`font-semibold ${textColor}`}>
                  {rsvrt != null ? `${rsvrt.toFixed(1)}%` : "-"}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-1 text-center">
              <div>
                <p className="text-xs text-gray-400">수위</p>
                <p className="text-sm font-semibold text-gray-700">
                  {dam.current?.nowlowlevel ?? "-"}
                </p>
                <p className="text-xs text-gray-400">EL.m</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">유입</p>
                <p className="text-sm font-semibold text-gray-700">
                  {dam.current?.inflowqy ?? "-"}
                </p>
                <p className="text-xs text-gray-400">㎥/s</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">방류</p>
                <p className="text-sm font-semibold text-gray-700">
                  {dam.current?.totdcwtrqy ?? "-"}
                </p>
                <p className="text-xs text-gray-400">㎥/s</p>
              </div>
            </div>

            {/* Supply */}
            {supply !== "-" && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
                <span className="text-xs text-blue-500">💧</span>
                <span className="text-xs text-blue-600 font-medium">{supply} 공급 가능</span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
