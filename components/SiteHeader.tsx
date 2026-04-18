"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import DatePicker from "./DatePicker";

const navLinks = [
  { href: "/", label: "🗺️ 지도" },
  { href: "/dams", label: "📋 전체 목록" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm shrink-0">
      {/* Main bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="font-bold text-base sm:text-lg text-blue-700 hover:text-blue-800 shrink-0"
        >
          💧 <span className="hidden sm:inline">다목적댐</span> 수위 모니터
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-4 text-sm">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                pathname === href
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* DatePicker — always visible */}
        <div className="ml-auto">
          <Suspense fallback={null}>
            <DatePicker />
          </Suspense>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="14" width="16" height="2" rx="1" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown nav */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-gray-100 bg-white">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center px-5 py-3.5 text-sm border-b border-gray-50 last:border-0 ${
                pathname === href
                  ? "text-blue-600 font-semibold bg-blue-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
