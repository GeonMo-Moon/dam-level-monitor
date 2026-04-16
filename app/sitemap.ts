import type { MetadataRoute } from "next";
import { DAM_COORDINATES } from "@/lib/dam-coordinates";

const BASE_URL = "https://damlevelmonitor.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const damPages = Object.keys(DAM_COORDINATES).map((damnm) => ({
    url: `${BASE_URL}/dams/${encodeURIComponent(damnm)}`,
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/dams`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    ...damPages,
  ];
}
