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

### Core types (`types/dam.ts`)

- `MultipurposeDamRecord` — raw K-water API fields (all numeric fields are `number | null`)
- `DamWithWaterLevel` — internal type combining static dam info (lat/lng, region) with `current: MultipurposeDamRecord | null`
- `dam.id === dam.damnm` — the Korean name string is the sole identifier throughout

### Key design decisions

**Dam identity**: Dams are identified by `damnm` (Korean name string, e.g. `"소양강댐"`), not a numeric ID. The `id` field on `DamWithWaterLevel` is just `damnm` re-used.

**K-water API**: Calls `multipurPoseDamlist` with `vdate/tdate/ldate/vtime`. If today's data is missing, `fetchMultipurposeDams()` automatically retries up to 2 days back. The API is HTTP-only so it must be called server-side.

**Status color system**: All status colors and thresholds are defined in `components/StatusBadge.tsx` `getStatusInfo()`. Changing thresholds here affects the entire app — map markers, progress bars, gauges, and badges all read from this single function. `DamCardGrid.tsx` and `StorageGauge.tsx` each maintain a local `hexColorMap` that maps the Tailwind class strings returned by `getStatusInfo()` to hex values (needed for inline styles / SVG fill). Keep these maps in sync when adding new status tiers.

**Map**: react-leaflet v5, `ssr: false` dynamic import. `DamMap.tsx` injects marker keyframe CSS directly into `<head>` via `ensureKeyframes()` because Leaflet's `divIcon` HTML runs outside the Next.js CSS scope. Do not use Tailwind classes inside `L.divIcon` HTML — use inline styles only.

**Client component pattern**: `DamMap.tsx` (logic) → `DamMapClient.tsx` (`dynamic(..., { ssr: false })` wrapper) → `HomeClient.tsx`. Any new map component must follow the same wrapper pattern.

**Polling**: `QueryProvider` sets global `staleTime: 9min`, `refetchInterval: 10min`. `useDams` uses `initialData` to hydrate from SSR, so there is no loading flash.

**Supply calculation** (`lib/water-usage.ts`): `daysForKorea(nowrsvwtqy)` converts reservoir volume (백만㎥) to days of national water supply. `formatSupply(days)` formats the result as a human-readable Korean string. Both are used across multiple pages and the side panel.

### Mobile responsiveness

**Header**: `SiteHeader.tsx` is a client component with hamburger menu state. On mobile it shows logo + DatePicker + hamburger; clicking hamburger reveals a dropdown nav. On desktop it shows the full horizontal nav. Layout renders `<SiteHeader />` directly (no Suspense needed — DatePicker is suspended inside SiteHeader).

**StatsBar**: Mobile renders as a 2×2 CSS grid (`grid-cols-2`); desktop uses `flex`. The time indicator spans both columns (`col-span-2`) on mobile and moves to `ml-auto` on sm+.

**DamSidePanel**: Uses `fixed sm:absolute` and different translate axes depending on breakpoint. Mobile: slides up from bottom (`translate-y-full` → `translate-y-0`, 78vh, `rounded-t-2xl`). Desktop: slides in from right (`translate-x-full` → `translate-x-0`, `w-80`, full height). The backdrop is `fixed sm:absolute`. Footer uses `pb-[max(1rem,env(safe-area-inset-bottom))]` for iPhone home indicator.

**DamListTable**: Defaults to card view on mobile (checked via `window.innerWidth < 640` on first mount if no saved preference). In table view, non-essential columns are `hidden sm:table-cell`: 수계, 지역, 수위, 유입량, 방류량, 전국민 공급.

**Do not use Tailwind classes inside `L.divIcon` HTML** — the map marker pulse ring keyframe is injected via `ensureKeyframes()` in `DamMap.tsx`, not `globals.css`.

### Animation / visual effects

- `globals.css` defines `wave-flow` and `shimmer-move` keyframes; also Leaflet zoom button size override for mobile (`max-width: 639px`)
- `StorageGauge.tsx` — circular water-fill tank with SVG wave at surface, animates on mount; size is `w-24 h-24 sm:w-32 sm:h-32`
- `DamCardGrid.tsx` — card background water fill + wave; progress bar uses `.shimmer-bar` pseudo-element
- `ProgressBar.tsx` — shimmer bar (`.shimmer-bar` class from globals.css)
- `DamMap.tsx` — pulse ring on markers where `rsvrt < 50%`; keyframe injected via `ensureKeyframes()` not globals.css

### `WaterLevelChart.tsx`

Despite the filename, this exports `DamCompareCard` — a current-vs-previous-day comparison *table*, not a chart. The `recharts` package is installed but currently unused.
