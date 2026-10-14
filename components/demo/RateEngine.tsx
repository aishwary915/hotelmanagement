"use client";

import { DAYS, dayDate } from "@/lib/dates";
import { occupancyRate } from "@/lib/booking/availability";
import { rateForNight } from "@/lib/rates/engine";
import { inr } from "@/lib/format/inr";
import { useDemoStore } from "@/stores/demo-store";

export function RateEngine() {
  const hotel = useDemoStore((s) => s.hotel);
  const bookings = useDemoStore((s) => s.bookings);
  const eventOn = useDemoStore((s) => s.eventOn);
  const autoSync = useDemoStore((s) => s.autoSync);
  const rateType = useDemoStore((s) => s.rateType);
  const setEventOn = useDemoStore((s) => s.setEventOn);
  const setAutoSync = useDemoStore((s) => s.setAutoSync);
  const setRateType = useDemoStore((s) => s.setRateType);
  const setToast = useDemoStore((s) => s.setToast);

  const base = hotel.roomTypes[rateType] ?? 3200;
  let sum = 0;
  const cols = Array.from({ length: DAYS }, (_, d) => {
    const r = rateForNight(base, bookings, hotel.rooms, d, eventOn);
    sum += r;
    const dt = dayDate(d);
    const w = dt.getDay();
    const o = Math.round(occupancyRate(bookings, hotel.rooms, d) * 100);
    return { d, r, w, o, dt };
  });
  const avg = sum / DAYS;
  const delta = Math.round((avg / base - 1) * 100);

  return (
    <>
      <p className="mb-4 max-w-[62ch] text-muted">
        Bar height shows how full the hotel is each night. The label above it is the suggested room rate.
        Make a booking above and watch the rates move.
      </p>
      <div className="mb-2 flex flex-wrap items-end gap-x-7 gap-y-2">
        <label className="text-sm">
          <span className="mb-1 block text-muted">Room type</span>
          <select
            className="rounded-[10px] border border-line bg-surface px-3 py-2"
            value={rateType}
            onChange={(e) => setRateType(e.target.value)}
          >
            {Object.keys(hotel.roomTypes).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={eventOn}
          className="flex items-center gap-2.5 font-semibold"
          onClick={() => setEventOn(!eventOn)}
        >
          <i className={`relative h-6 w-10 rounded-full ${eventOn ? "bg-brand" : "bg-line"}`}>
            <span className={`absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-white transition-transform ${eventOn ? "translate-x-[18px]" : ""}`} />
          </i>
          Wedding season surcharge on Fri to Sun
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={autoSync}
          className="flex items-center gap-2.5 font-semibold"
          onClick={() => {
            setAutoSync(!autoSync);
            setToast(autoSync ? "Automatic rate sync is off" : "Rates will sync to OTAs automatically");
          }}
        >
          <i className={`relative h-6 w-10 rounded-full ${autoSync ? "bg-brand" : "bg-line"}`}>
            <span className={`absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-white transition-transform ${autoSync ? "translate-x-[18px]" : ""}`} />
          </i>
          Push rates to OTAs automatically
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[580px] grid-cols-[repeat(14,minmax(38px,1fr))] gap-1.5">
          {cols.map(({ d, r, w, o, dt }) => (
            <div key={d} className={`flex flex-col items-center gap-1 text-[0.72rem] text-muted ${w === 5 || w === 6 || w === 0 ? "" : ""}`}>
              <b className={`text-[0.76rem] ${d === 0 ? "text-accent-text" : "text-ink"}`}>₹{(r / 1000).toFixed(1)}k</b>
              <div className="flex h-[130px] w-full items-end">
                <div
                  className={`min-h-[5px] w-full rounded-t-md ${w === 5 || w === 6 || w === 0 ? "bg-accent" : "bg-brand/55"}`}
                  style={{ height: `${Math.max(4, o)}%` }}
                  title={`${o}% booked`}
                />
              </div>
              <span>
                {dt.toLocaleDateString("en-IN", { weekday: "narrow" })} {dt.getDate()}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2.5 text-[0.85rem] text-muted">
        Average {inr(avg)} a night, {delta >= 0 ? "+" : ""}
        {delta}% against your flat rate of {inr(base)}.{" "}
        {autoSync
          ? "Changes go to MakeMyTrip, Booking.com and Goibibo as they happen."
          : "Automatic sync is off. OTAs keep the last rates you pushed."}
      </p>
    </>
  );
}
