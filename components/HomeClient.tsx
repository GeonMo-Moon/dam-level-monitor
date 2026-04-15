"use client";

import { useSearchParams } from "next/navigation";
import { DamWithWaterLevel } from "@/types/dam";
import { useDams } from "@/hooks/useDams";
import { daysForKorea, formatSupply } from "@/lib/water-usage";
import { useState } from "react";
import StatsBar from "./StatsBar";
import DamMapClient from "./DamMapClient";
import DamSidePanel from "./DamSidePanel";

interface HomeClientProps {
  initialDams: DamWithWaterLevel[];
}

export default function HomeClient({ initialDams }: HomeClientProps) {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? undefined;

  const { dams, lastUpdated, error } = useDams(initialDams, date);
  const [selectedDam, setSelectedDam] = useState<DamWithWaterLevel | null>(null);

  const totalRsvwtqy = dams.reduce((sum, d) => sum + (d.current?.nowrsvwtqy ?? 0), 0);
  const stats = {
    total: dams.length,
    danger: dams.filter((d) => (d.current?.rsvwtrt ?? 100) < 30).length,
    caution: dams.filter((d) => {
      const r = d.current?.rsvwtrt ?? 100;
      return r >= 30 && r < 50;
    }).length,
    supply: formatSupply(daysForKorea(totalRsvwtqy || null)),
  };

  return (
    <>
      <StatsBar
        total={stats.total}
        caution={stats.caution}
        danger={stats.danger}
        supply={stats.supply}
        apiError={error}
        lastUpdated={lastUpdated}
      />
      <div className="flex-1 overflow-hidden relative">
        <DamMapClient dams={dams} visible onDamSelect={setSelectedDam} />
        <DamSidePanel dam={selectedDam} onClose={() => setSelectedDam(null)} />
      </div>
    </>
  );
}
