"use client";

import { useEffect, useRef, useState } from "react";

interface StatsBarProps {
  total: number;
  caution: number;
  danger: number;
  supply: string;
  apiError?: string | null;
  lastUpdated?: Date | null;
}

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}

interface StatCardProps {
  label: string;
  value: number | string;
  animate?: boolean;
  pulse?: boolean;
  colorClass: string;
  bgClass: string;
  icon: string;
}

function StatCard({ label, value, animate, pulse, colorClass, bgClass, icon }: StatCardProps) {
  const numericValue = typeof value === "number" ? value : 0;
  const counted = useCountUp(animate ? numericValue : 0);
  const displayed = typeof value === "string" ? value : counted;

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl border ${bgClass} ${pulse ? "animate-pulse" : ""} transition-all`}
    >
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 leading-none mb-0.5">{label}</p>
        <p className={`text-lg font-bold leading-none ${colorClass}`}>{displayed}</p>
      </div>
    </div>
  );
}

export default function StatsBar({ total, caution, danger, supply, apiError, lastUpdated }: StatsBarProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(lastUpdated ?? new Date());
  }, [lastUpdated]);

  const timeStr = now
    ? now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100 shrink-0 overflow-x-auto">
      <StatCard
        label="전체 댐"
        value={total}
        animate
        colorClass="text-gray-800"
        bgClass="border-gray-200 bg-gray-50"
        icon="🏞️"
      />
      <StatCard
        label="주의"
        value={caution}
        animate
        colorClass="text-yellow-700"
        bgClass="border-yellow-200 bg-yellow-50"
        icon="⚠️"
      />
      <StatCard
        label="경계"
        value={danger}
        animate
        pulse={danger > 0}
        colorClass="text-red-700"
        bgClass={danger > 0 ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}
        icon="🚨"
      />
      <StatCard
        label="전국민 공급"
        value={supply}
        colorClass="text-blue-700"
        bgClass="border-blue-200 bg-blue-50"
        icon="💧"
      />

      <div className="ml-auto flex items-center gap-2 shrink-0">
        {apiError ? (
          <span className="text-xs text-red-500">API 오류: {apiError}</span>
        ) : (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs text-gray-400">
              {timeStr ? `${timeStr} 기준` : "갱신 중..."}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
