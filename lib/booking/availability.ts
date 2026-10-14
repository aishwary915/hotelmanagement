import type { Booking, Room } from "@/data/types";

export function bookedAt(
  bookings: Booking[],
  roomIndex: number,
  dayIndex: number,
): Booking | undefined {
  return bookings.find(
    (b) => b.room === roomIndex && dayIndex >= b.start && dayIndex < b.start + b.nights,
  );
}

export function rangeFree(
  bookings: Booking[],
  roomIndex: number,
  startDay: number,
  endDay: number,
  excludeBookingId?: number,
): boolean {
  for (let d = startDay; d <= endDay; d++) {
    const hit = bookedAt(bookings, roomIndex, d);
    if (hit && hit.id !== excludeBookingId) return false;
  }
  return true;
}

export function occupancyRate(bookings: Booking[], rooms: Room[], dayIndex: number): number {
  const booked = rooms.filter((_, i) => bookedAt(bookings, i, dayIndex)).length;
  return rooms.length === 0 ? 0 : booked / rooms.length;
}
