import type { BanquetHall, MenuItem } from "@/data/types";
import { totalWithGst } from "@/lib/pos/gst";

export interface BanquetQuoteInput {
  hall: BanquetHall;
  hours: number;
  guestCount: number;
  cateringPerHead: number;
  menuItems: MenuItem[];
  cateringItemIds: string[];
}

export function buildBanquetQuote(input: BanquetQuoteInput) {
  const hallCharge = input.hall.ratePerHour * input.hours;
  const catering = input.guestCount * input.cateringPerHead;
  const extras = input.cateringItemIds.reduce((s, id) => {
    const m = input.menuItems.find((x) => x.id === id);
    return s + (m?.price ?? 0);
  }, 0);
  const subtotal = hallCharge + catering + extras;
  return {
    hallCharge,
    catering,
    extras,
    subtotal,
    total: totalWithGst(subtotal),
  };
}
