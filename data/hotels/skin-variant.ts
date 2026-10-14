import type { HotelConfig } from "@/data/types";
import { aurelia } from "@/data/hotels/aurelia";

/** Fictional demo skin: same layout as Aurelia, different name and slight rate scale. */
export function makeDemoSkin(
  slug: string,
  displayName: string,
  rateScale: number,
): HotelConfig {
  const roomTypes: HotelConfig["roomTypes"] = {};
  for (const [k, v] of Object.entries(aurelia.roomTypes)) {
    roomTypes[k] = Math.round(v * rateScale / 50) * 50;
  }
  return {
    ...aurelia,
    slug,
    displayName,
    roomTypes,
    menu: aurelia.menu.map((m) => ({ ...m })),
    seedBookings: aurelia.seedBookings.map((b) => ({ ...b })),
    hkInitial: { ...aurelia.hkInitial },
    banquetHalls: aurelia.banquetHalls.map((h) => ({ ...h })),
  };
}
