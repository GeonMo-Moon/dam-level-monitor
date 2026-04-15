"use client";

import { useQuery } from "@tanstack/react-query";
import { DamWithWaterLevel } from "@/types/dam";

interface DamsResponse {
  dams: DamWithWaterLevel[];
  fetchedAt: string;
}

async function fetchDams(date?: string): Promise<DamsResponse> {
  const url = date ? `/api/dams?date=${encodeURIComponent(date)}` : "/api/dams";
  const res = await fetch(url);
  if (!res.ok) throw new Error("댐 데이터 조회 실패");
  return res.json();
}

export function useDams(initialDams: DamWithWaterLevel[], date?: string) {
  const { data, error, dataUpdatedAt } = useQuery<DamsResponse>({
    queryKey: ["dams", date ?? "latest"],
    queryFn: () => fetchDams(date),
    initialData: { dams: initialDams, fetchedAt: new Date().toISOString() },
    staleTime: 9 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  return {
    dams: data?.dams ?? initialDams,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
    error: error instanceof Error ? error.message : null,
  };
}
