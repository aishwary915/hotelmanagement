import type { Booking, HotelConfig } from "@/data/types";
import { fmtD } from "@/lib/dates";
import { computeStats } from "@/lib/booking/stats";

export function buildAssistantContext(
  hotel: HotelConfig,
  bookings: Booking[],
  eventOn: boolean,
): string {
  const stats = computeStats(bookings, hotel.rooms);
  const menuSample = hotel.menu.slice(0, 5).map((m) => m.name).join(", ");
  return [
    `Property: ${hotel.displayName} (demo data only).`,
    `Rooms: ${hotel.rooms.length}. Tonight booked: ${stats.tonightBooked}.`,
    `Room types and base rates (INR): ${JSON.stringify(hotel.roomTypes)}.`,
    `Sample menu: ${menuSample}.`,
    `Today is ${fmtD(0)}. Wedding season surcharge on Fri–Sun: ${eventOn ? "on" : "off"}.`,
    `Answer briefly for hotel guests. Use INR. Do not invent real policies beyond demo.`,
  ].join("\n");
}
