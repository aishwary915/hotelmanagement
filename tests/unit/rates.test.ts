import { describe, expect, it } from "vitest";
import { rateForNight } from "@/lib/rates/engine";
import type { Booking, Room } from "@/data/types";

const rooms: Room[] = [{ no: 101, type: "Deluxe" }];

describe("rates", () => {
  it("rounds to nearest 50", () => {
    const rate = rateForNight(3200, [], rooms, 0, false);
    expect(rate % 50).toBe(0);
    expect(rate).toBeGreaterThan(0);
  });

  it("increases with occupancy", () => {
    const empty = rateForNight(3200, [], rooms, 0, false);
    const full: Booking[] = [
      {
        id: 1,
        room: 0,
        start: 0,
        nights: 1,
        guest: "X",
        ch: "direct",
        status: "inhouse",
        total: 1,
      },
    ];
    const busy = rateForNight(3200, full, rooms, 0, false);
    expect(busy).toBeGreaterThanOrEqual(empty);
  });
});
