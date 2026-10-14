import { describe, expect, it } from "vitest";
import { calculateRoi } from "@/lib/roi/calculator";

describe("roi", () => {
  it("matches monolith formula shape", () => {
    const r = calculateRoi({ rooms: 40, adr: 3500, occupancy: 62, otaShare: 65 });
    expect(r.totalRecovery).toBe(r.directSavings + r.errorRecovery);
    expect(r.monthlyRevenue).toBeGreaterThan(0);
  });
});
