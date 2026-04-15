// 1인당 하루 평균 수돗물 사용량 (L)
const DAILY_USAGE_L = 300;
// 대한민국 인구
const KOREA_POPULATION = 51_000_000;

/**
 * 저수량(백만㎥)으로 전국민이 며칠 쓸 수 있는지 계산
 * 백만㎥ × 10⁶ m³ × 1000 L/m³ = × 10⁹ L
 */
export function daysForKorea(nowrsvwtqy: number | null): number | null {
  if (nowrsvwtqy === null || nowrsvwtqy <= 0) return null;
  const totalLiters = nowrsvwtqy * 1_000_000_000;
  const dailyNational = DAILY_USAGE_L * KOREA_POPULATION;
  return Math.floor(totalLiters / dailyNational);
}

export function formatSupply(days: number | null): string {
  if (days === null) return "-";
  if (days >= 365) {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    return months > 0 ? `약 ${years}년 ${months}개월` : `약 ${years}년`;
  }
  if (days >= 30) return `약 ${Math.floor(days / 30)}개월`;
  return `약 ${days}일`;
}
