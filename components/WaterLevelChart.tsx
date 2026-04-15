"use client";

import { MultipurposeDamRecord } from "@/types/dam";

interface DamCompareCardProps {
  current: MultipurposeDamRecord;
}

function Row({
  label,
  now,
  prev,
  unit,
}: {
  label: string;
  now: number | null;
  prev: number | null;
  unit: string;
}) {
  const diff = now !== null && prev !== null ? now - prev : null;
  const diffColor = diff === null ? "" : diff > 0 ? "text-red-500" : diff < 0 ? "text-blue-500" : "text-gray-400";
  const diffSign = diff !== null && diff > 0 ? "+" : "";

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 pr-4 text-sm text-gray-500 w-28">{label}</td>
      <td className="py-3 pr-4 text-sm font-medium text-gray-900 text-right">
        {now !== null ? `${now} ${unit}` : "-"}
      </td>
      <td className="py-3 pr-4 text-sm text-gray-400 text-right">
        {prev !== null ? `${prev} ${unit}` : "-"}
      </td>
      <td className={`py-3 text-sm font-medium text-right ${diffColor}`}>
        {diff !== null ? `${diffSign}${diff.toFixed(1)} ${unit}` : "-"}
      </td>
    </tr>
  );
}

export default function DamCompareCard({ current }: DamCompareCardProps) {
  return (
    <div>
      <div className="flex text-xs text-gray-400 mb-1 px-1">
        <span className="w-28"></span>
        <span className="flex-1 text-right pr-4">현재</span>
        <span className="flex-1 text-right pr-4">전일</span>
        <span className="flex-1 text-right">변화</span>
      </div>
      <table className="w-full">
        <tbody>
          <Row label="수위" now={current.nowlowlevel} prev={current.lastlowlevel} unit="EL.m" />
          <Row
            label="저수량"
            now={
              typeof current.nowrsvwtqy === "string"
                ? parseFloat((current.nowrsvwtqy as string).replace(/,/g, ""))
                : current.nowrsvwtqy
            }
            prev={current.lastrsvwtqy}
            unit="백만㎥"
          />
          <Row label="저수율" now={current.rsvwtrt} prev={null} unit="%" />
          <Row label="유입량" now={current.inflowqy} prev={null} unit="㎥/s" />
          <Row label="방류량" now={current.totdcwtrqy} prev={null} unit="㎥/s" />
          <Row label="금일 강우" now={current.zerosevenhourprcptqy} prev={current.prcptqy} unit="mm" />
        </tbody>
      </table>
      <p className="mt-3 text-xs text-gray-400">금년 누계 강우량: {current.pyacurf ?? "-"} mm</p>
    </div>
  );
}
