import { NextRequest, NextResponse } from "next/server";
import { getDamsWithWaterLevel } from "@/lib/get-dams";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? undefined;

  try {
    const dams = await getDamsWithWaterLevel(date);
    return NextResponse.json({ dams, fetchedAt: new Date().toISOString() });
  } catch (e) {
    const message = e instanceof Error ? e.message : "API 호출 실패";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
