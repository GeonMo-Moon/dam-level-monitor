import { MultipurposeDamRecord } from "@/types/dam";
import { format, subYears, subDays } from "date-fns";

const BASE_URL = "https://apis.data.go.kr/B500001/dam";
const SERVICE_KEY = process.env.KWATER_SERVICE_KEY ?? "";

function parseNumber(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  const n = Number(typeof val === "string" ? val.replace(/,/g, "") : val);
  return isNaN(n) ? null : n;
}

function buildUrl(base: Date): string {
  const vdate = format(base, "yyyy-MM-dd");
  const tdate = format(subDays(base, 1), "yyyy-MM-dd");
  const ldate = format(subYears(base, 1), "yyyy-MM-dd");
  const isToday = vdate === format(new Date(), "yyyy-MM-dd");
  const vtime = isToday ? format(new Date(), "HH") : "23";

  const url = new URL(`${BASE_URL}/multipurPoseDam/multipurPoseDamlist`);
  url.searchParams.set("serviceKey", SERVICE_KEY);
  url.searchParams.set("_type", "json");
  url.searchParams.set("numOfRows", "30");
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("vdate", vdate);
  url.searchParams.set("tdate", tdate);
  url.searchParams.set("ldate", ldate);
  url.searchParams.set("vtime", vtime);
  return url.toString();
}

function parseItems(data: unknown): MultipurposeDamRecord[] | null {
  const items = (data as Record<string, unknown> | null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.valueOf() && (data as any)?.response?.body?.items?.item;
  if (!items) return null;
  const list = Array.isArray(items) ? items : [items];
  return list.map((item: Record<string, unknown>) => ({
    damnm: String(item.damnm ?? ""),
    suge: String(item.suge ?? ""),
    nowlowlevel: parseNumber(item.nowlowlevel),
    nowrsvwtqy: parseNumber(item.nowrsvwtqy),
    rsvwtrt: parseNumber(item.rsvwtrt),
    inflowqy: parseNumber(item.inflowqy),
    totdcwtrqy: parseNumber(item.totdcwtrqy),
    lastlowlevel: parseNumber(item.lastlowlevel),
    lastrsvwtqy: parseNumber(item.lastrsvwtqy),
    zerosevenhourprcptqy: parseNumber(item.zerosevenhourprcptqy),
    prcptqy: parseNumber(item.prcptqy),
    pyacurf: parseNumber(item.pyacurf),
  }));
}

// 다목적댐 관리현황 조회 (전체 21개 한 번에 반환)
// 당일 데이터가 없으면 전일로 자동 fallback
export async function fetchMultipurposeDams(
  date?: Date
): Promise<MultipurposeDamRecord[]> {
  const today = date ?? new Date();

  for (let daysBack = 0; daysBack <= 2; daysBack++) {
    const base = subDays(today, daysBack);
    const url = buildUrl(base);
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        console.error(`[API 오류] HTTP ${res.status}`);
        continue;
      }
      const text = await res.text();
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        console.error(`[API 오류] JSON 파싱 실패 — 응답:`, text.slice(0, 100));
        throw new Error(text.slice(0, 100));
      }
      const records = parseItems(data);
      if (records && records.length > 0) return records;
    } catch (e) {
      throw e;
    }
  }

  return [];
}
