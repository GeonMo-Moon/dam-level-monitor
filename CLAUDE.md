# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm run start    # start production server
```

No test runner is configured.

## Environment Variables

- `KWATER_SERVICE_KEY` — K-water 공공데이터 API 인증키 (server-side only)

## Architecture

**Data flow**: All pages are Server Components with `export const dynamic = "force-dynamic"`. They call `lib/get-dams.ts` → `lib/kwater-api.ts` (K-water 다목적댐 API) + `lib/dam-coordinates.ts` (static coord lookup by Korean dam name) → return `DamWithWaterLevel[]`.

**API**: `fetchMultipurposeDams()` calls `https://apis.data.go.kr/B500001/dam/multipurPoseDam/multipurPoseDamlist` with date params (`vdate`, `tdate`, `ldate`, `vtime`). Returns 21 multipurpose dams. Dams are identified by `damnm` (Korean name string), not a numeric code.

**Routes**:
- `/` — full-screen map with status bar
- `/dams` — sortable dam list table
- `/dams/[damcode]` — detail page; `damcode` is `encodeURIComponent(damnm)`

**Map**: Uses OpenStreetMap (react-leaflet v5) via `DamMapClient.tsx` (dynamic, `ssr: false`). Rendered inside `HomeClient.tsx` with `visible` always true. Marker click opens `DamSidePanel`.

**Client component pattern**: Map components need `"use client"` + `ssr: false` dynamic import. Pattern: `DamMap.tsx` (logic) → `DamMapClient.tsx` (dynamic wrapper) → used in `HomeClient.tsx`.

**Status colors**: Defined in `components/StatusBadge.tsx` `getStatusInfo()` — used by both map popups and the table/detail pages. Change thresholds there to affect the whole app.

**`WaterLevelChart.tsx`** is actually named `DamCompareCard` internally — it shows current vs. previous day comparison table (no charts despite the filename).
