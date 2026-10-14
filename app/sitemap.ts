import type { MetadataRoute } from "next";
import { listHotels } from "@/data/hotels";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const hotels = listHotels();
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/demo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...hotels.map((h) => ({
      url: `${base}/demo?hotel=${h.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
