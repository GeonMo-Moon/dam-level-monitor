import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import QueryProvider from "@/components/QueryProvider";
import { Suspense } from "react";
import DatePicker from "@/components/DatePicker";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "대한민국 댐 수위 모니터",
  description: "전국 댐의 수위, 저수율, 유입량, 방류량을 실시간으로 확인합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2247400586882906"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="h-full flex flex-col bg-gray-50 text-gray-900">
        <QueryProvider>
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6 shadow-sm">
            <Link href="/" className="font-bold text-lg text-blue-700 hover:text-blue-800">
              💧 다목적댐 수위 모니터
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                지도
              </Link>
              <Link href="/dams" className="text-gray-600 hover:text-blue-600 transition-colors">
                전체 목록
              </Link>
            </nav>
            <Suspense fallback={null}>
              <DatePicker />
            </Suspense>
          </header>
          <main className="flex-1 flex flex-col">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
