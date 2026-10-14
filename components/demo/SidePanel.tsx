"use client";

import { useState } from "react";
import { CHANNEL_LABELS, STATUS_LABELS, type ChannelId } from "@/data/types";
import { fmtD } from "@/lib/dates";
import { inr } from "@/lib/format/inr";
import { useDemoStore } from "@/stores/demo-store";
import { Button } from "@/components/demo/ui/Button";
import { Field, SelectInput, TextInput } from "@/components/demo/ui/Field";
import { trackEvent } from "@/lib/analytics/events";

export function SidePanel() {
  const hotel = useDemoStore((s) => s.hotel);
  const viewId = useDemoStore((s) => s.viewId);
  const bookings = useDemoStore((s) => s.bookings);
  const folio = useDemoStore((s) => s.folio);
  const selection = useDemoStore((s) => s.selection);
  const cancelArm = useDemoStore((s) => s.cancelArm);
  const selectionTotal = useDemoStore((s) => s.selectionTotal);
  const confirmBooking = useDemoStore((s) => s.confirmBooking);
  const checkIn = useDemoStore((s) => s.checkIn);
  const checkOut = useDemoStore((s) => s.checkOut);
  const cancelBooking = useDemoStore((s) => s.cancelBooking);
  const armCancel = useDemoStore((s) => s.armCancel);
  const clearSelection = useDemoStore((s) => s.clearSelection);
  const closeView = useDemoStore((s) => s.closeView);

  const [guest, setGuest] = useState("");
  const [ch, setCh] = useState<ChannelId>("direct");
  const [err, setErr] = useState("");

  const b = viewId ? bookings.find((x) => x.id === viewId) : null;

  if (b) {
    const r = hotel.rooms[b.room];
    const dep = b.start + b.nights;
    const food = r ? folio[r.no] : 0;
    return (
      <aside className="side-panel border-t border-line bg-[color-mix(in_srgb,var(--color-bg)_50%,var(--color-surface))] p-6 lg:border-t-0 lg:border-l" aria-live="polite">
        <h3 className="font-display text-xl font-bold tracking-tight">{b.guest}</h3>
        <p className="text-muted">
          Room {r?.no}, {r?.type}
        </p>
        <dl className="mt-3.5 space-y-2 text-[0.92rem]">
          <div className="flex justify-between gap-3 border-b border-line py-2">
            <dt className="text-muted">Stay</dt>
            <dd className="font-bold">{fmtD(b.start)} to {fmtD(dep)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-line py-2">
            <dt className="text-muted">Nights</dt>
            <dd className="font-bold">{b.nights}</dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-line py-2">
            <dt className="text-muted">Booked through</dt>
            <dd className="font-bold">{CHANNEL_LABELS[b.ch]}</dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-line py-2">
            <dt className="text-muted">Status</dt>
            <dd className="font-bold">{STATUS_LABELS[b.status]}</dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-line py-2">
            <dt className="text-muted">Room charges</dt>
            <dd className="font-bold">{inr(b.total)}</dd>
          </div>
          {food ? (
            <div className="flex justify-between gap-3 border-b border-line py-2">
              <dt className="text-muted">Restaurant charges</dt>
              <dd className="font-bold">{inr(food)}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-4 grid gap-2">
          {b.status === "expected" && b.start <= 0 ? (
            <Button onClick={() => checkIn(b.id)}>Check in</Button>
          ) : null}
          {b.status === "inhouse" ? <Button onClick={() => checkOut(b.id)}>Check out</Button> : null}
          <Button
            variant="ghost"
            onClick={() => {
              if (cancelArm !== b.id) armCancel(b.id);
              else cancelBooking(b.id);
            }}
          >
            {cancelArm === b.id ? "Tap again to cancel booking" : "Cancel booking"}
          </Button>
          <Button variant="ghost" onClick={closeView}>
            Close
          </Button>
        </div>
      </aside>
    );
  }

  if (selection) {
    const r = hotel.rooms[selection.room];
    const n = selection.b - selection.a + 1;
    return (
      <aside className="side-panel border-t border-line bg-[color-mix(in_srgb,var(--color-bg)_50%,var(--color-surface))] p-6 lg:border-t-0 lg:border-l" aria-live="polite">
        <h3 className="font-display text-xl font-bold tracking-tight">New booking</h3>
        <p>
          <b>Room {r?.no}</b>, {r?.type}
        </p>
        <p className="text-muted">
          {fmtD(selection.a)} to {fmtD(selection.b + 1)}, {n} night{n > 1 ? "s" : ""}
        </p>
        <Field label="Guest name" htmlFor="gname">
          <TextInput id="gname" value={guest} onChange={(e) => setGuest(e.target.value)} autoComplete="off" />
        </Field>
        <Field label="Booked through">
          <SelectInput value={ch} onChange={(e) => setCh(e.target.value as ChannelId)}>
            <option value="direct">Direct</option>
            <option value="mmt">MakeMyTrip</option>
            <option value="bkg">Booking.com</option>
            <option value="walk">Walk-in</option>
          </SelectInput>
        </Field>
        {err ? (
          <p className="mt-2 min-h-[1.3em] text-[0.85rem] text-danger" role="alert">
            {err}
          </p>
        ) : null}
        <div className="mt-4 flex items-baseline justify-between text-muted">
          <span className="text-sm">Total at today&apos;s rates</span>
          <b className="font-display text-2xl tabular-nums text-ink">{inr(selectionTotal())}</b>
        </div>
        <div className="mt-4 grid gap-2">
          <Button
            variant="accent"
            onClick={() => {
              const res = confirmBooking(guest, ch);
              if (res.error) setErr(res.error);
              else {
                setErr("");
                trackEvent("booking_made", { hotel: hotel.slug });
              }
            }}
          >
            Confirm booking
          </Button>
          <Button variant="ghost" onClick={clearSelection}>
            Clear selection
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="side-panel border-t border-line bg-[color-mix(in_srgb,var(--color-bg)_50%,var(--color-surface))] p-6 lg:border-t-0 lg:border-l" aria-live="polite">
      <h3 className="font-display text-xl font-bold tracking-tight">Pick a night to book</h3>
      <p className="mt-2 text-[0.92rem] text-muted">
        Click or drag across free squares on the chart. Click a coloured bar to open the booking, check
        the guest in or out, or cancel it.
      </p>
      <p className="text-[0.92rem] text-muted">
        Rates follow demand. A fuller night costs more, and weekends carry a surcharge.
      </p>
    </aside>
  );
}
