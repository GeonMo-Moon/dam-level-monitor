"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DamWithWaterLevel } from "@/types/dam";
import ProgressBar from "./ProgressBar";
import DamCardGrid from "./DamCardGrid";
import { daysForKorea, formatSupply } from "@/lib/water-usage";

interface DamListTableProps {
  dams: DamWithWaterLevel[];
}

type SortKey = "damnm" | "region" | "suge" | "rsvrt" | "nowlowlevel";
type ViewMode = "table" | "card";

const VIEW_KEY = "dam-list-view";

function TableIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={active ? "text-blue-600" : "text-gray-400"}>
      <rect x="1" y="1" width="14" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="1" y="6" width="14" height="3" rx="1" fill="currentColor" />
      <rect x="1" y="11" width="14" height="3" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={active ? "text-blue-600" : "text-gray-400"}>
      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

export default function DamListTable({ dams }: DamListTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rsvrt");
  const [sortAsc, setSortAsc] = useState(true);
  const [view, setView] = useState<ViewMode>("card");

  // 저장된 뷰 복원 — 없으면 모바일은 카드, 데스크톱은 테이블
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_KEY);
    if (saved === "card" || saved === "table") {
      setView(saved);
    } else if (window.innerWidth >= 640) {
      setView("table");
    }
  }, []);

  function switchView(v: ViewMode) {
    setView(v);
    localStorage.setItem(VIEW_KEY, v);
  }

  const filtered = dams
    .filter((d) => d.damnm.includes(query) || d.region.includes(query) || d.suge.includes(query))
    .sort((a, b) => {
      let va: string | number, vb: string | number;
      if (sortKey === "damnm")       { va = a.damnm; vb = b.damnm; }
      else if (sortKey === "region") { va = a.region; vb = b.region; }
      else if (sortKey === "suge")   { va = a.suge; vb = b.suge; }
      else if (sortKey === "rsvrt")  { va = a.current?.rsvwtrt ?? -1; vb = b.current?.rsvwtrt ?? -1; }
      else                           { va = a.current?.nowlowlevel ?? -1; vb = b.current?.nowlowlevel ?? -1; }

      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>;
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="댐 이름, 지역, 수계 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => switchView("table")}
            className={`p-1.5 rounded-md transition-colors ${view === "table" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
            title="테이블 뷰"
          >
            <TableIcon active={view === "table"} />
          </button>
          <button
            onClick={() => switchView("card")}
            className={`p-1.5 rounded-md transition-colors ${view === "card" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
            title="카드 뷰"
          >
            <GridIcon active={view === "card"} />
          </button>
        </div>
      </div>

      {/* Card view */}
      {view === "card" && <DamCardGrid dams={filtered} />}

      {/* Table view */}
      {view === "table" && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort("damnm")}>
                  댐 이름 <SortIcon k="damnm" />
                </th>
                {/* 수계/지역 — 모바일 숨김 */}
                <th className="hidden sm:table-cell px-4 py-3 text-left cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort("suge")}>
                  수계 <SortIcon k="suge" />
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort("region")}>
                  지역 <SortIcon k="region" />
                </th>
                <th className="px-3 sm:px-4 py-3 text-right cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort("rsvrt")}>
                  저수율 <SortIcon k="rsvrt" />
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-right cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort("nowlowlevel")}>
                  수위 (EL.m) <SortIcon k="nowlowlevel" />
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-right">유입량 (㎥/s)</th>
                <th className="hidden sm:table-cell px-4 py-3 text-right">방류량 (㎥/s)</th>
                <th className="hidden sm:table-cell px-4 py-3 text-right">전국민 공급</th>
                <th className="px-3 sm:px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((dam) => (
                <tr key={dam.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 sm:px-4 py-3 font-medium text-gray-900">{dam.damnm}</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-gray-500">{dam.suge}</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-gray-500">{dam.region}</td>
                  <td className="px-3 sm:px-4 py-3">
                    <ProgressBar rsvrt={dam.current?.rsvwtrt ?? null} />
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 text-right text-gray-700">
                    {dam.current?.nowlowlevel ?? "-"}
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 text-right text-gray-700">
                    {dam.current?.inflowqy ?? "-"}
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 text-right text-gray-700">
                    {dam.current?.totdcwtrqy ?? "-"}
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 text-right text-blue-600 font-medium text-xs">
                    {formatSupply(daysForKorea(dam.current?.nowrsvwtqy ?? null))}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <Link
                      href={`/dams/${encodeURIComponent(dam.damnm)}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      상세
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-2 text-xs text-gray-400">총 {filtered.length}개 댐</p>
    </div>
  );
}
