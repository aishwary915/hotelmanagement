import { describe, expect, it } from "vitest";
import { bookedAt, rangeFree } from "@/lib/booking/availability";
import type { Booking } from "@/data/types";

const bookings: Booking[] = [
  {
    id: 1,
    room: 0,
    start: 1,
    nights: 2,
    guest: "A",
    ch: "direct",
    status: "expected",
    total: 1000,
  },
];

describe("availability", () => {
  it("finds booking on night", () => {
    expect(bookedAt(bookings, 0, 1)?.guest).toBe("A");
    expect(bookedAt(bookings, 0, 0)).toBeUndefined();
  });

  it("checks range free", () => {
    expect(rangeFree(bookings, 0, 3, 5)).toBe(true);
    expect(rangeFree(bookings, 0, 1, 2)).toBe(false);
    expect(rangeFree(bookings, 0, 1, 2, 1)).toBe(true);
  });
});
