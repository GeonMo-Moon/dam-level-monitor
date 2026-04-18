import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import SiteHeader from "@/components/SiteHeader";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "대한민국 댐 수위 모니터",
    template: "%s | 댐 수위 모니터",
  },
  description: "전국 21개 다목적댐의 수위, 저수율, 유입량, 방류량을 실시간으로 확인합니다. 소양강댐, 충주댐, 안동댐 등 K-water 공공데이터 기반.",
  keywords: ["댐 수위", "저수율", "다목적댐", "소양강댐", "충주댐", "안동댐", "K-water", "댐 현황", "저수량"],
  authors: [{ name: "댐 수위 모니터" }],
  metadataBase: new URL("https://damlevelmonitor.vercel.app"),
  openGraph: {
    title: "대한민국 댐 수위 모니터",
    description: "전국 21개 다목적댐의 수위, 저수율, 유입량, 방류량을 실시간으로 확인합니다.",
    url: "https://damlevelmonitor.vercel.app",
    siteName: "댐 수위 모니터",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://damlevelmonitor.vercel.app",
  },
  verification: {
    google: "35XWpbXc-V-a7791-yjc8J7HgTkgtyQuOd0vY5onBQw",
  },
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
          <SiteHeader />
          <main className="flex-1 flex flex-col">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
