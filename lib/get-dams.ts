import { fetchMultipurposeDams } from "./kwater-api";
import { getDamCoordinate } from "./dam-coordinates";
import { DamWithWaterLevel } from "@/types/dam";
import { parseISO, isValid } from "date-fns";

export async function getDamsWithWaterLevel(dateStr?: string): Promise<DamWithWaterLevel[]> {
  let date: Date | undefined;
  if (dateStr) {
    const parsed = parseISO(dateStr);
    if (isValid(parsed)) date = parsed;
  }
  const records = await fetchMultipurposeDams(date);

  const result: DamWithWaterLevel[] = [];

  for (const record of records) {
    const coord = getDamCoordinate(record.damnm);
    if (!coord) continue;
    result.push({
      id: record.damnm,
      damnm: record.damnm,
      suge: record.suge,
      lat: coord.lat,
      lng: coord.lng,
      region: coord.region,
      current: record,
    });
  }

  return result;
}
