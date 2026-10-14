import type { Booking, HkStatus } from "@/data/types";

export type TileStatus = HkStatus | "occupied";

export function hkTileStatus(
  roomIndex: number,
  roomNo: number,
  bookings: Booking[],
  hk: Record<number, HkStatus>,
): TileStatus {
  if (bookings.some((b) => b.room === roomIndex && b.status === "inhouse")) {
    return "occupied";
  }
  return hk[roomNo] ?? "ready";
}
