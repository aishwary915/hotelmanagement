"use client";

import { hkTileStatus } from "@/lib/housekeeping/state";
import { useDemoStore } from "@/stores/demo-store";

const labels = {
  occupied: "Guest in room",
  dirty: "Needs cleaning. Tap to start.",
  cleaning: "Being cleaned. Tap when done.",
  ready: "Ready to sell",
} as const;

export function Housekeeping() {
  const hotel = useDemoStore((s) => s.hotel);
  const bookings = useDemoStore((s) => s.bookings);
  const hk = useDemoStore((s) => s.hk);
  const hkTap = useDemoStore((s) => s.hkTap);

  const tiles = hotel.rooms.map((r, i) => hkTileStatus(i, r.no, bookings, hk));
  const ready = tiles.filter((s) => s === "ready").length;
  const need = tiles.filter((s) => s === "dirty" || s === "cleaning").length;

  return (
    <>
      <p className="mb-4 max-w-[62ch] text-muted">
        {ready} rooms ready to sell, {need} waiting on housekeeping. Tap a room to move it along.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
        {hotel.rooms.map((r, i) => {
          const st = tiles[i];
          const disabled = st === "occupied" || st === "ready";
          return (
            <button
              key={r.no}
              type="button"
              disabled={disabled}
              onClick={() => hkTap(i)}
              className={`flex flex-col gap-0.5 rounded-xl border p-3.5 text-left ${
                st === "dirty"
                  ? "border-danger bg-danger/10"
                  : st === "cleaning"
                    ? "border-accent bg-accent/15"
                    : st === "ready"
                      ? "border-ok"
                      : "border-brand/30 bg-brand/10"
              }`}
            >
              <b className="font-display text-2xl">{r.no}</b>
              <span className="text-[0.82rem] text-muted">{r.type}</span>
              <em className="mt-1.5 text-[0.85rem] font-bold not-italic">{labels[st]}</em>
            </button>
          );
        })}
      </div>
    </>
  );
}
