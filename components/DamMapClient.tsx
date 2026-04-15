"use client";

import dynamic from "next/dynamic";
import { DamWithWaterLevel } from "@/types/dam";

const DamMap = dynamic(() => import("./DamMap"), { ssr: false });

export default function DamMapClient({
  dams,
  visible,
  onDamSelect,
}: {
  dams: DamWithWaterLevel[];
  visible: boolean;
  onDamSelect?: (dam: DamWithWaterLevel) => void;
}) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DamMap dams={dams} visible={visible} onDamSelect={onDamSelect} />
    </div>
  );
}
