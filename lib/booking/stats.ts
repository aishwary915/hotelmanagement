import type { Booking, Room } from "@/data/types";
import { bookedAt } from "@/lib/booking/availability";

export interface DashboardStats {
  tonightBooked: number;
  roomCount: number;
  occupancy7: number;
  arrivalsToday: number;
  bookedRevenue: number;
}

export function computeStats(bookings: Booking[], rooms: Room[]): DashboardStats {
  const tonightBooked = rooms.filter((_, i) => bookedAt(bookings, i, 0)).length;
  let n7 = 0;
  for (let d = 0; d < 7; d++) {
    n7 += rooms.filter((_, i) => bookedAt(bookings, i, d)).length;
  }
  const occupancy7 = Math.round((n7 / (7 * rooms.length)) * 100);
  const arrivalsToday = bookings.filter((b) => b.start === 0).length;
  const bookedRevenue = bookings.reduce((s, b) => s + b.total, 0);
  return {
    tonightBooked,
    roomCount: rooms.length,
    occupancy7,
    arrivalsToday,
    bookedRevenue,
  };
}
