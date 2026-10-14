import type { Booking, BookingStatus, ChannelId, Room } from "@/data/types";
import { stayTotalAtRates } from "@/lib/rates/engine";

export interface CreateBookingInput {
  room: number;
  start: number;
  nights: number;
  guest: string;
  ch: ChannelId;
  roomTypes: Record<string, number>;
  rooms: Room[];
  eventOn: boolean;
}

export function createBooking(
  bookings: Booking[],
  nextId: number,
  input: CreateBookingInput,
): { bookings: Booking[]; booking: Booking } {
  const { room, start, nights, guest, ch, roomTypes, rooms, eventOn } = input;
  const end = start + nights - 1;
  const type = rooms[room]?.type ?? "Deluxe";
  const total = stayTotalAtRates(type, roomTypes, bookings, rooms, start, end, eventOn);
  const status: BookingStatus =
    ch === "walk" && start === 0 ? "inhouse" : "expected";
  const booking: Booking = {
    id: nextId,
    room,
    start,
    nights,
    guest,
    ch,
    status,
    total,
  };
  return { bookings: [...bookings, booking], booking };
}

export function moveBooking(
  bookings: Booking[],
  bookingId: number,
  newRoom: number,
  newStart: number,
): Booking[] {
  return bookings.map((b) => {
    if (b.id !== bookingId) return b;
    return { ...b, room: newRoom, start: newStart };
  });
}

export function setBookingStatus(
  bookings: Booking[],
  bookingId: number,
  status: BookingStatus,
): Booking[] {
  return bookings.map((b) => (b.id === bookingId ? { ...b, status } : b));
}

export function removeBooking(bookings: Booking[], bookingId: number): Booking[] {
  return bookings.filter((b) => b.id !== bookingId);
}
