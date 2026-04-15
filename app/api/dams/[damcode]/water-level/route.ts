import { NextResponse } from "next/server";
import { getDamsWithWaterLevel } from "@/lib/get-dams";

export const revalidate = 600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ damcode: string }> }
) {
  const { damcode } = await params;
  const damnm = decodeURIComponent(damcode);

  try {
    const dams = await getDamsWithWaterLevel();
    const dam = dams.find((d) => d.damnm === damnm);
    if (!dam) {
      return NextResponse.json({ error: "댐을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json(dam);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "댐 데이터 조회 실패" }, { status: 500 });
  }
}
