import { Suspense } from "react";
import { getDamsWithWaterLevel } from "@/lib/get-dams";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  let dams: Awaited<ReturnType<typeof getDamsWithWaterLevel>> = [];
  try {
    dams = await getDamsWithWaterLevel(date);
  } catch {
    // HomeClient will show error state on next poll; start with empty list
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 53px)" }}>
      <Suspense>
        <HomeClient initialDams={dams} />
      </Suspense>
    </div>
  );
}
