import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getDamsWithWaterLevel } from "@/lib/get-dams";
import StatusBadge from "@/components/StatusBadge";
import StorageGauge from "@/components/StorageGauge";
import DamCompareCard from "@/components/WaterLevelChart";
import { daysForKorea, formatSupply } from "@/lib/water-usage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ damcode: string }>;
}): Promise<Metadata> {
  const { damcode } = await params;
  const damnm = decodeURIComponent(damcode);
  return {
    title: `${damnm} 수위 현황`,
    description: `${damnm}의 실시간 수위, 저수율, 유입량, 방류량을 확인합니다.`,
    alternates: {
      canonical: `https://damlevelmonitor.vercel.app/dams/${damcode}`,
    },
    openGraph: {
      title: `${damnm} 수위 현황`,
      description: `${damnm}의 실시간 수위, 저수율, 유입량, 방류량을 확인합니다.`,
    },
  };
}

export default async function DamDetailPage({
  params,
}: {
  params: Promise<{ damcode: string }>;
}) {
  const { damcode } = await params;
  const damnm = decodeURIComponent(damcode);

  const dams = await getDamsWithWaterLevel();
  const dam = dams.find((d) => d.damnm === damnm);
  if (!dam) notFound();

  const c = dam.current;

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto w-full">
      <Link href="/dams" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← 전체 목록
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{dam.damnm}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {dam.region} · {dam.suge}수계
          </p>
        </div>
        <StatusBadge rsvrt={c?.rsvwtrt ?? null} />
      </div>

      {/* 현재 수치 카드 */}
      <div className="flex gap-3 mb-4 items-stretch">
        {/* 저수율 게이지 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-center shrink-0">
          <StorageGauge rsvrt={c?.rsvwtrt ?? null} />
        </div>
        {/* 나머지 수치 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          {[
            { label: "수위",   value: c?.nowlowlevel,  unit: "EL.m" },
            { label: "유입량", value: c?.inflowqy,      unit: "㎥/s" },
            { label: "방류량", value: c?.totdcwtrqy,    unit: "㎥/s" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-xl font-bold text-gray-900">
                {value != null ? value : "-"}
              </p>
              <p className="text-xs text-gray-400">{unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 전국민 공급 가능 일수 */}
      {(() => {
        const days = daysForKorea(c?.nowrsvwtqy ?? null);
        return (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center gap-4">
            <div className="text-3xl">💧</div>
            <div>
              <p className="text-sm text-blue-700 font-medium">전국민 공급 가능 기간</p>
              <p className="text-xl font-bold text-blue-900">
                {formatSupply(days)}
              </p>
              <p className="text-xs text-blue-500 mt-0.5">
                현재 저수량 기준 · 1인 하루 300L 사용 · 전국민 5,100만명
              </p>
            </div>
          </div>
        );
      })()}

      {/* 현재 vs 전일 비교 */}
      {c && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">현재 vs 전일 비교</h2>
          <DamCompareCard current={c} />
        </div>
      )}

      {/* 강우 현황 */}
      {c && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">강우 현황</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "금일 강우",     value: c.zerosevenhourprcptqy, unit: "mm" },
              { label: "전일 강우",     value: c.prcptqy,              unit: "mm" },
              { label: "금년 누계",     value: c.pyacurf,              unit: "mm" },
            ].map(({ label, value, unit }) => (
              <div key={label}>
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-lg font-bold text-gray-900">{value ?? "-"}</p>
                <p className="text-xs text-gray-400">{unit}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
