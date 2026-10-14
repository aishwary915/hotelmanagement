"use client";

import { CHANNEL_LABELS } from "@/data/types";
import { inr } from "@/lib/format/inr";
import { useDemoStore } from "@/stores/demo-store";
import { Button } from "@/components/demo/ui/Button";

export function FrontDesk() {
  const hotel = useDemoStore((s) => s.hotel);
  const bookings = useDemoStore((s) => s.bookings);
  const folio = useDemoStore((s) => s.folio);
  const checkIn = useDemoStore((s) => s.checkIn);
  const checkOut = useDemoStore((s) => s.checkOut);

  const arr = bookings.filter((b) => b.start === 0);
  const dep = bookings.filter((b) => b.start + b.nights === 0);

  return (
    <>
      <p className="mb-4 max-w-[62ch] text-muted">
        Today&apos;s arrivals and departures come straight from the booking chart. Checking a guest out
        sends the room to housekeeping.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-display text-xl">Arriving today</h3>
          {arr.length ? (
            arr.map((b) => {
              const r = hotel.rooms[b.room];
              return (
                <div key={b.id} className="flex items-center justify-between gap-3 border-b border-line py-3">
                  <div>
                    <b>{b.guest}</b>
                    <small className="block text-muted">
                      Room {r?.no}, {CHANNEL_LABELS[b.ch]}
                    </small>
                  </div>
                  {b.status === "expected" ? (
                    <Button className="!px-3 !py-1.5 !text-sm" onClick={() => checkIn(b.id)}>
                      Check in
                    </Button>
                  ) : (
                    <span className="rounded-full bg-ok/10 px-2.5 py-0.5 text-xs font-bold text-ok">
                      In house
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <p className="py-3 text-muted">No arrivals today.</p>
          )}
        </div>
        <div>
          <h3 className="font-display text-xl">Leaving today</h3>
          {dep.length ? (
            dep.map((b) => {
              const r = hotel.rooms[b.room];
              const food = r ? folio[r.no] ?? 0 : 0;
              return (
                <div key={b.id} className="flex items-center justify-between gap-3 border-b border-line py-3">
                  <div>
                    <b>{b.guest}</b>
                    <small className="block text-muted">
                      Room {r?.no}, bill {inr(b.total + food)}
                    </small>
                  </div>
                  {b.status === "inhouse" ? (
                    <Button className="!px-3 !py-1.5 !text-sm" onClick={() => checkOut(b.id)}>
                      Check out
                    </Button>
                  ) : (
                    <span className="rounded-full bg-ink/10 px-2.5 py-0.5 text-xs font-bold">Checked out</span>
                  )}
                </div>
              );
            })
          ) : (
            <p className="py-3 text-muted">No departures today.</p>
          )}
        </div>
      </div>
    </>
  );
}
