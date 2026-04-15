"use client";

import dynamic from "next/dynamic";
import { DamWithWaterLevel } from "@/types/dam";

const NaverMap = dynamic(() => import("./NaverMap"), { ssr: false });

export default function NaverMapClient({
  dams,
  visible,
  onDamSelect,
}: {
  dams: DamWithWaterLevel[];
  visible: boolean;
  onDamSelect?: (dam: DamWithWaterLevel) => void;
}) {
  return <NaverMap dams={dams} visible={visible} onDamSelect={onDamSelect} />;
}
