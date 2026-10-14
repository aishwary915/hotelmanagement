import type { HotelConfig } from "@/data/types";
import { aurelia } from "@/data/hotels/aurelia";
import { trivana } from "@/data/hotels/trivana";
import { regency } from "@/data/hotels/regency";
import { obGreens } from "@/data/hotels/ob-greens";

const hotels: HotelConfig[] = [aurelia, trivana, regency, obGreens];

const bySlug = new Map(hotels.map((h) => [h.slug, h]));

export function normalizeHotelSlug(input: string | null | undefined): string {
  if (!input) return aurelia.slug;
  const s = input.trim().toLowerCase().replace(/\s+/g, "-");
  if (s === "hotel-trivana" || s === "trivana") return "trivana";
  if (s === "regal-regency" || s === "regency") return "regency";
  if (s === "o-br-greens" || s === "ob-greens") return "ob-greens";
  if (s === "aurelia" || s === "hotel-aurelia") return "aurelia";
  return bySlug.has(s) ? s : aurelia.slug;
}

export function getHotelConfig(slug: string | null | undefined): HotelConfig {
  const key = normalizeHotelSlug(slug);
  return bySlug.get(key) ?? aurelia;
}

export function listHotels(): Pick<HotelConfig, "slug" | "displayName">[] {
  return hotels.map(({ slug, displayName }) => ({ slug, displayName }));
}
