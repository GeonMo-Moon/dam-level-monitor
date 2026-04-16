import type { Metadata } from "next";
import { getDamsWithWaterLevel } from "@/lib/get-dams";
import DamListTable from "@/components/DamListTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "전국 댐 현황",
  description: "전국 21개 다목적댐의 수위, 저수율, 유입량, 방류량 전체 목록을 확인합니다.",
  alternates: {
    canonical: "https://damlevelmonitor.vercel.app/dams",
  },
};

export default async function DamsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const dams = await getDamsWithWaterLevel(date);

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-1">전국 댐 현황</h1>
      <p className="text-sm text-gray-500 mb-6">총 {dams.length}개 댐 · 10분 주기 갱신</p>
      <DamListTable dams={dams} />
    </div>
  );
}
