# UI Dynamic Improvement Plan

## Goal
Transform the current static server-rendered dashboard into a live, interactive monitoring experience. All 6 improvements below must be implemented.

## Status Legend
- `[ ]` pending
- `[~]` in progress
- `[x]` done

---

## Improvement 1: Real Auto-Refresh + Live Indicator ✅
**Files**: `app/api/dams/route.ts`, `hooks/useDams.ts`, `components/HomeClient.tsx`, `components/StatsBar.tsx`

Convert pages from pure server fetch to client-side polling via TanStack Query (`refetchInterval: 600_000`). Add a pulsing green dot + "last updated HH:MM" timestamp in the header or stats bar.

- [x] Create `app/api/dams/route.ts` — JSON endpoint that wraps `getDamsWithWaterLevel()`
- [x] Create `hooks/useDams.ts` — `useQuery` with `refetchInterval: 600_000`
- [x] Create `components/HomeClient.tsx` — client wrapper that holds polling state
- [x] Refactor `app/page.tsx` to SSR initial data → hydrate into `HomeClient`
- [x] Pulsing green dot + "HH:MM 기준" timestamp in `StatsBar`

---

## Improvement 2: Animated Stats Cards (Homepage) ✅
**Files**: `components/StatsBar.tsx` (new)

Replace the single-line stats bar with 4 animated cards. Danger card pulses red, caution card pulses yellow.

- [x] Create `components/StatsBar.tsx` with 4 cards: Total / Caution / Danger / Supply Days
- [x] Add count-up animation on mount (rAF-based)
- [x] Add CSS `animate-pulse` on Danger card when count > 0
- [x] Replace inline stats bar in `app/page.tsx` with `<StatsBar>`

---

## Improvement 3: Map Click → Slide-In Side Panel ✅
**Files**: `components/MapTabs.tsx`, `components/DamSidePanel.tsx` (new), `components/DamMap.tsx`, `components/NaverMap.tsx`, `components/DamMapClient.tsx`, `components/NaverMapClient.tsx`

When a dam marker is clicked on either map, a panel slides in from the right showing dam detail (gauge, key metrics, prev-day comparison) without navigating away.

- [x] Create `components/DamSidePanel.tsx` — slide-in panel with dam detail view
- [x] Add `onDamSelect` callback prop to `DamMap` and `NaverMap`
- [x] Use ref pattern in `NaverMap` to avoid stale closure on one-time-init markers
- [x] Wire `onDamSelect` through `MapTabs` → `DamSidePanel` (lift state up)
- [x] CSS slide-in transition (`translate-x-full` → `translate-x-0`)
- [x] StorageGauge + key metrics + prev-day comparison + supply days + detail link

---

## Improvement 4: Inline Progress Bars on `/dams` Table ✅
**Files**: `components/DamListTable.tsx`, `components/ProgressBar.tsx` (new)

Replace the plain `StatusBadge` in the storage rate column with a color-coded progress bar that visually fills to the percentage.

- [x] Create `components/ProgressBar.tsx` — thin bar with status color + percentage label
- [x] Replace `StatusBadge` in table's storage-rate cell with `<ProgressBar>`
- [x] CSS `transition` so bars animate in on render

---

## Improvement 5: Card / Table View Toggle on `/dams` ✅
**Files**: `components/DamListTable.tsx`, `components/DamCardGrid.tsx` (new)

Add a toggle button above the table to switch between table view (current) and card grid view. Cards show status color, storage gauge, and key numbers at a glance.

- [x] Create `components/DamCardGrid.tsx` — responsive grid of dam cards
- [x] Each card: dam name, region, status label, storage bar, inflow/outflow, supply days
- [x] Add view toggle buttons (table/grid SVG icons) in `DamListTable`
- [x] Persist selected view in `localStorage`

---

## Improvement 6: Water Level Gauge Animation on Detail Page ✅
**Files**: `app/dams/[damcode]/page.tsx`, `components/StorageGauge.tsx` (new)

Replace the plain numeric card for storage rate with an animated SVG arc gauge that fills up on mount.

- [x] Create `components/StorageGauge.tsx` — semicircular SVG gauge, animated `stroke-dashoffset`
- [x] Color: mirrors `getStatusInfo()` thresholds (red/yellow/green/blue)
- [x] Replace the `저수율` card in detail page with `<StorageGauge>`

---

## Implementation Order
1. Improvement 4 (progress bars) ✅
2. Improvement 2 (stats cards) ✅
3. Improvement 6 (gauge on detail page) ✅
4. Improvement 1 (auto-refresh) ✅
5. Improvement 5 (card/table toggle) ✅
6. Improvement 3 (map side panel) ✅

**ALL DONE** — build passing as of 2026-04-15.

---

## Key Constraints
- Maps must keep `visibility: hidden` (not `display: none`) pattern — do not break this
- All new client components need `"use client"` directive
- Map components use `ssr: false` dynamic import — keep that pattern
- Status color thresholds live in `components/StatusBadge.tsx` `getStatusInfo()` — reuse, don't duplicate
- `force-dynamic` on page exports must stay (K-water API has no stable cache key)
- `NaverMap` markers are created in a one-time `useEffect` — pass callbacks via `useRef` to avoid stale closures
