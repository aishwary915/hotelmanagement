import type { Booking, Room } from "@/data/types";
import { isWeekendSurge } from "@/lib/dates";
import { occupancyRate } from "@/lib/booking/availability";

export function demandFactor(
  bookings: Booking[],
  rooms: Room[],
  dayIndex: number,
  eventOn: boolean,
): number {
  const occ = occupancyRate(bookings, rooms, dayIndex);
  let f = 0.88 + occ * 0.55;
  if (eventOn && isWeekendSurge(dayIndex)) f += 0.12;
  return f;
}

export function rateForNight(
  baseRate: number,
  bookings: Booking[],
  rooms: Room[],
  dayIndex: number,
  eventOn: boolean,
): number {
  const f = demandFactor(bookings, rooms, dayIndex, eventOn);
  return Math.round((baseRate * f) / 50) * 50;
}

export function stayTotalAtRates(
  roomType: string,
  roomTypes: Record<string, number>,
  bookings: Booking[],
  rooms: Room[],
  startDay: number,
  endDay: number,
  eventOn: boolean,
): number {
  const base = roomTypes[roomType] ?? 0;
  let tot = 0;
  for (let d = startDay; d <= endDay; d++) {
    tot += rateForNight(base, bookings, rooms, d, eventOn);
  }
  return tot;
}
