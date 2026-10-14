"use client";

import { useCallback, useRef, useState } from "react";
import { DAYS, dayDate, fmtD } from "@/lib/dates";
import { bookedAt } from "@/lib/booking/availability";
import { CHANNEL_LABELS, type ChannelId } from "@/data/types";
import { useDemoStore } from "@/stores/demo-store";

const channelClass: Record<ChannelId, string> = {
  direct: "bg-c-direct text-white",
  mmt: "bg-c-mmt text-[var(--color-accent-on)]",
  bkg: "bg-c-bkg text-white",
  walk: "bg-c-walk text-white",
};

export function BookingChart() {
  const hotel = useDemoStore((s) => s.hotel);
  const bookings = useDemoStore((s) => s.bookings);
  const selection = useDemoStore((s) => s.selection);
  const viewId = useDemoStore((s) => s.viewId);
  const pickCell = useDemoStore((s) => s.pickCell);
  const openBooking = useDemoStore((s) => s.openBooking);
  const setToast = useDemoStore((s) => s.setToast);
  const moveBookingTo = useDemoStore((s) => s.moveBookingTo);

  const [intro, setIntro] = useState(true);
  const dragRef = useRef<{ room: number; startDay: number } | null>(null);
  const moveRef = useRef<{ id: number; offset: number } | null>(null);
  const [focus, setFocus] = useState({ room: 0, day: 0 });

  const onCell = (room: number, day: number) => {
    const { overlap } = pickCell(room, day);
    if (overlap) setToast("Those nights overlap another booking. Starting again from this night.");
    setFocus({ room, day });
  };

  const paintDrag = (room: number, day: number) => {
    if (!dragRef.current || dragRef.current.room !== room) return false;
    const a = Math.min(dragRef.current.startDay, day);
    const b = Math.max(dragRef.current.startDay, day);
    return selection && selection.room === room && day >= a && day <= b;
  };

  const handlePointerDownCell = (room: number, day: number) => {
    dragRef.current = { room, startDay: day };
  };

  const handlePointerEnterCell = (room: number, day: number) => {
    if (!dragRef.current || dragRef.current.room !== room) return;
    const a = Math.min(dragRef.current.startDay, day);
    const b = Math.max(dragRef.current.startDay, day);
    useDemoStore.setState({ selection: { room, a, b }, viewId: null });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let { room, day } = focus;
    if (e.key === "ArrowRight") day = Math.min(DAYS - 1, day + 1);
    else if (e.key === "ArrowLeft") day = Math.max(0, day - 1);
    else if (e.key === "ArrowDown") room = Math.min(hotel.rooms.length - 1, room + 1);
    else if (e.key === "ArrowUp") room = Math.max(0, room - 1);
    else if (e.key === "Enter") onCell(room, day);
    else if (e.key === "Escape") useDemoStore.getState().clearSelection();
    else return;
    e.preventDefault();
    setFocus({ room, day });
  };

  const startMoveBar = (id: number, start: number) => {
    moveRef.current = { id, offset: start };
  };

  const dropBar = useCallback(
    (room: number, day: number) => {
      const m = moveRef.current;
      if (!m) return;
      const b = bookings.find((x) => x.id === m.id);
      if (!b) return;
      const newStart = day - (b.start - m.offset);
      const res = moveBookingTo(m.id, room, newStart);
      if (!res.ok) setToast("Cannot move booking here — dates conflict.");
      moveRef.current = null;
    },
    [bookings, moveBookingTo, setToast],
  );

  return (
    <div className="overflow-x-auto p-4" onPointerUp={endDrag} onPointerLeave={endDrag}>
      <div
        role="grid"
        aria-label="Room availability for the next 14 nights"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={`grid min-w-[830px] grid-cols-[92px_repeat(14,minmax(52px,1fr))] auto-rows-[minmax(44px,46px)] grid-rows-[52px] touch-manipulation ${intro ? "tape-intro" : ""}`}
        onAnimationEnd={() => setIntro(false)}
      >
        <div className="th corner flex flex-col items-start justify-end border-b border-line pb-1.5 pl-1 text-muted">
          Room
        </div>
        {Array.from({ length: DAYS }, (_, d) => {
          const dt = dayDate(d);
          const w = dt.getDay();
          return (
            <div
              key={d}
              className={`th flex flex-col items-center justify-center border-b border-line text-[0.76rem] text-muted ${w === 0 || w === 6 ? "bg-accent/10" : ""} ${d === 0 ? "shadow-[inset_0_-3px_0_var(--color-accent)]" : ""}`}
              style={{ gridColumn: d + 2, gridRow: 1 }}
            >
              <span>{dt.toLocaleDateString("en-IN", { weekday: "short" })}</span>
              <b className="font-display text-base text-ink">{dt.getDate()}</b>
            </div>
          );
        })}

        {hotel.rooms.map((r, i) => (
          <div
            key={`row-${r.no}`}
            className="pointer-events-none col-span-full border-b border-line"
            style={{ gridRow: i + 2 }}
          />
        ))}

        {hotel.rooms.map((r, i) => (
          <div key={`rl-${r.no}`} className="flex flex-col justify-center pl-1" style={{ gridRow: i + 2 }}>
            <b className="font-display text-base leading-tight">{r.no}</b>
            <span className="text-[0.74rem] text-muted">{r.type}</span>
          </div>
        ))}

        {hotel.rooms.map((r, i) =>
          Array.from({ length: DAYS }, (_, d) => {
            if (bookedAt(bookings, i, d)) return null;
            const selected =
              (selection && selection.room === i && d >= selection.a && d <= selection.b) ||
              paintDrag(i, d);
            const focused = focus.room === i && focus.day === d;
            return (
              <button
                key={`c-${i}-${d}`}
                type="button"
                role="gridcell"
                aria-label={`Room ${r.no}, ${fmtD(d)}, free`}
                className={`cell border-0 border-l border-line bg-transparent p-0 hover:bg-brand/15 ${selected ? "bg-accent/40 shadow-[inset_0_0_0_2px_var(--color-accent)]" : ""} ${focused ? "ring-2 ring-accent ring-inset" : ""}`}
                style={{ gridColumn: d + 2, gridRow: i + 2 }}
                onPointerDown={() => handlePointerDownCell(i, d)}
                onPointerEnter={() => handlePointerEnterCell(i, d)}
                onClick={() => onCell(i, d)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dropBar(i, d)}
              />
            );
          }),
        )}

        {bookings.map((b, n) => {
          if (b.start + b.nights <= 0 || b.start >= DAYS) return null;
          const cs = Math.max(b.start, 0);
          const ce = Math.min(b.start + b.nights, DAYS);
          const first = b.guest.split(" ")[0];
          return (
            <button
              key={b.id}
              type="button"
              draggable
              aria-label={`${b.guest}, room ${hotel.rooms[b.room]?.no}, ${b.nights} nights`}
              className={`bar mx-0.5 flex flex-col justify-center overflow-hidden rounded-[9px] px-2 text-left ${channelClass[b.ch]}  ${b.status === "out" ? "opacity-40" : ""} ${viewId === b.id ? "outline outline-3 outline-ink outline-offset-1" : ""} ${b.start < 0 ? "rounded-l-none" : ""} ${b.start + b.nights > DAYS ? "rounded-r-none" : ""}`}
              style={{
                gridColumn: `${cs + 2} / ${ce + 2}`,
                gridRow: b.room + 2,
                animationDelay: `${n * 45}ms`,
              }}
              onClick={() => openBooking(b.id)}
              onDragStart={() => startMoveBar(b.id, b.start)}
              onDragEnd={() => {
                moveRef.current = null;
              }}
            >
              <b className="truncate text-[0.82rem] leading-tight">{first}</b>
              <small className="text-[0.7rem] opacity-85">{CHANNEL_LABELS[b.ch]}</small>
            </button>
          );
        })}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-x-[18px] gap-y-2 text-[0.82rem] text-muted">
        {(Object.keys(CHANNEL_LABELS) as ChannelId[]).map((ch) => (
          <span key={ch} className="inline-flex items-center gap-1.5">
            <i className={`inline-block h-3 w-3 rounded ${channelClass[ch]}`} />
            {CHANNEL_LABELS[ch]}
          </span>
        ))}
      </div>
    </div>
  );
}
