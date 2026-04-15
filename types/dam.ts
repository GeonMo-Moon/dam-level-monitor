// 다목적댐 API 응답 타입 (multipurPoseDamlist)

export interface MultipurposeDamRecord {
  damnm: string;                        // 댐 이름
  suge: string;                         // 수계
  nowlowlevel: number | null;           // 현재 수위 (EL.m)
  nowrsvwtqy: number | null;            // 현재 저수량 (백만㎥)
  rsvwtrt: number | null;               // 저수율 (%)
  inflowqy: number | null;              // 유입량 (㎥/s)
  totdcwtrqy: number | null;            // 방류량 (㎥/s)
  lastlowlevel: number | null;          // 전일 수위 (EL.m)
  lastrsvwtqy: number | null;           // 전일 저수량 (백만㎥)
  zerosevenhourprcptqy: number | null;  // 금일 강우량 (mm)
  prcptqy: number | null;               // 전일 강우량 (mm)
  pyacurf: number | null;               // 금년 누계 강우량 (mm)
}

export interface DamCoordinate {
  lat: number;
  lng: number;
  region: string;
}

// 앱 내부에서 사용하는 통합 타입

export interface Dam {
  id: string;       // URL 라우팅용 ID (댐 이름)
  damnm: string;
  suge: string;
  lat: number;
  lng: number;
  region: string;
}

export interface DamWithWaterLevel extends Dam {
  current: MultipurposeDamRecord | null;
}
