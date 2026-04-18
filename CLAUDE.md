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

- `KWATER_SERVICE_KEY` — K-water 공공데이터 API 인증키 (server-side only, never expose to client)

## Architecture

### Data flow

```
Server page (force-dynamic)
  └── getDamsWithWaterLevel(date?)       [lib/get-dams.ts]
        ├── fetchMultipurposeDams()      [lib/kwater-api.ts]  → K-water API (HTTP, server-side only)
        └── getDamCoordinate(damnm)      [lib/dam-coordinates.ts]  → static lat/lng lookup by Korean name
              → DamWithWaterLevel[]
```

Pages SSR the initial data and pass it as `initialDams` to client components. The client then polls `/api/dams` every 10 minutes via TanStack Query (`hooks/useDams.ts`).

### Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server + Client | Full-screen map. SSR → `HomeClient` (polling, stats bar, map, side panel) |
| `/dams` | Server | Dam list with table/card toggle, search, sort |
| `/dams/[damcode]` | Server | Detail page; `damcode` = `encodeURIComponent(damnm)` |
| `/api/dams` | Route Handler | JSON endpoint wrapping `getDamsWithWaterLevel()`; used by `useDams` hook |

### Key design decisions

**Dam identity**: Dams are identified by `damnm` (Korean name string, e.g. `"소양강댐"`), not a numeric ID. The `id` field on `DamWithWaterLevel` is just `damnm` re-used.

**K-water API**: Calls `multipurPoseDamlist` with `vdate/tdate/ldate/vtime`. If today's data is missing, `fetchMultipurposeDams()` automatically retries up to 2 days back. The API is HTTP-only so it must be called server-side.

**Status color system**: All status colors and thresholds are defined in `components/StatusBadge.tsx` `getStatusInfo()`. Changing thresholds here affects the entire app — map markers, progress bars, gauges, and badges all read from this single function.

**Map**: react-leaflet v5, `ssr: false` dynamic import. `DamMap.tsx` injects marker keyframe CSS directly into `<head>` via `ensureKeyframes()` because Leaflet's `divIcon` HTML runs outside the Next.js CSS scope. Do not use Tailwind classes inside `L.divIcon` HTML — use inline styles only.

**Client component pattern**: `DamMap.tsx` (logic) → `DamMapClient.tsx` (`dynamic(..., { ssr: false })` wrapper) → `HomeClient.tsx`. Any new map component must follow the same wrapper pattern.

**Polling**: `QueryProvider` sets global `staleTime: 9min`, `refetchInterval: 10min`. `useDams` uses `initialData` to hydrate from SSR, so there is no loading flash.

### Animation / visual effects

- `globals.css` defines `wave-flow` and `shimmer-move` keyframes
- `StorageGauge.tsx` — circular water-fill tank with SVG wave at surface, animates on mount
- `DamCardGrid.tsx` — card background water fill + wave; progress bar uses `.shimmer-bar` pseudo-element
- `ProgressBar.tsx` — shimmer bar (`.shimmer-bar` class from globals.css)
- `DamMap.tsx` — pulse ring on markers where `rsvrt < 50%`; keyframe injected via `ensureKeyframes()` not globals.css

### `WaterLevelChart.tsx`

Despite the filename, this exports `DamCompareCard` — a current-vs-previous-day comparison *table*, not a chart. The `recharts` package is installed but currently unused.
