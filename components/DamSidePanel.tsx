"use client";

import Link from "next/link";
import { DamWithWaterLevel } from "@/types/dam";
import StorageGauge from "./StorageGauge";
import DamCompareCard from "./WaterLevelChart";
import { daysForKorea, formatSupply } from "@/lib/water-usage";

interface DamSidePanelProps {
  dam: DamWithWaterLevel | null;
  onClose: () => void;
}

export default function DamSidePanel({ dam, onClose }: DamSidePanelProps) {
  const open = dam !== null;

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="absolute inset-0 bg-black/20 z-[400] sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl z-[500] flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {dam && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="font-bold text-lg text-gray-900 leading-tight">{dam.damnm}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{dam.region} · {dam.suge}수계</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1 mt-0.5"
                aria-label="닫기"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Gauge */}
              <div className="flex justify-center">
                <StorageGauge rsvrt={dam.current?.rsvwtrt ?? null} />
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "수위",   value: dam.current?.nowlowlevel,  unit: "EL.m" },
                  { label: "유입량", value: dam.current?.inflowqy,      unit: "㎥/s" },
                  { label: "방류량", value: dam.current?.totdcwtrqy,    unit: "㎥/s" },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-bold text-gray-800">{value ?? "-"}</p>
                    <p className="text-xs text-gray-400">{unit}</p>
                  </div>
                ))}
              </div>

              {/* Supply days */}
              {(() => {
                const days = daysForKorea(dam.current?.nowrsvwtqy ?? null);
                const supply = formatSupply(days);
                if (supply === "-") return null;
                return (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center gap-3">
                    <span className="text-2xl">💧</span>
                    <div>
                      <p className="text-xs text-blue-500">전국민 공급 가능</p>
                      <p className="text-base font-bold text-blue-800">{supply}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Prev-day comparison */}
              {dam.current && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">현재 vs 전일 비교</p>
                  <DamCompareCard current={dam.current} />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-5 py-4 border-t border-gray-100">
              <Link
                href={`/dams/${encodeURIComponent(dam.damnm)}`}
                className="block w-full text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg py-2.5"
              >
                상세 페이지로 →
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
