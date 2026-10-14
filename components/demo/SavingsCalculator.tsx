"use client";

import { useMemo, useState } from "react";
import { calculateRoi } from "@/lib/roi/calculator";
import { inr } from "@/lib/format/inr";

export function SavingsCalculator() {
  const [rooms, setRooms] = useState(40);
  const [adr, setAdr] = useState(3500);
  const [occ, setOcc] = useState(62);
  const [ota, setOta] = useState(65);

  const roi = useMemo(
    () => calculateRoi({ rooms, adr, occupancy: occ, otaShare: ota }),
    [rooms, adr, occ, ota],
  );

  return (
    <section className="section-block" id="roi">
      <div className="overflow-hidden rounded-2xl bg-deep text-white shadow-[0_28px_60px_-34px_rgba(15,59,64,0.55)]">
        <div className="grid gap-8 p-7 md:grid-cols-2 md:gap-14 md:p-11">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Savings estimate</p>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-tight tracking-tight">
            What it could be worth to your hotel.
          </h2>
          <p className="mt-3 max-w-[44ch] text-white/85 leading-relaxed">
            Move the sliders to match your property. The estimate shows what a month could recover from OTA
            commission and booking errors.
          </p>
          {[
            { label: "Rooms", min: 10, max: 150, step: 1, value: rooms, set: setRooms, fmt: String(rooms) },
            {
              label: "Average room rate per night",
              min: 1500,
              max: 10000,
              step: 100,
              value: adr,
              set: setAdr,
              fmt: inr(adr),
            },
            {
              label: "Occupancy",
              min: 30,
              max: 95,
              step: 1,
              value: occ,
              set: setOcc,
              fmt: `${occ}%`,
            },
            {
              label: "Share of bookings from OTAs",
              min: 10,
              max: 90,
              step: 1,
              value: ota,
              set: setOta,
              fmt: `${ota}%`,
            },
          ].map((sl) => (
            <div key={sl.label} className="my-[18px]">
              <div className="mb-1 flex justify-between text-[0.92rem]">
                <label htmlFor={sl.label}>{sl.label}</label>
                <output className="font-extrabold tabular-nums">{sl.fmt}</output>
              </div>
              <input
                id={sl.label}
                type="range"
                min={sl.min}
                max={sl.max}
                step={sl.step}
                value={sl.value}
                onChange={(e) => sl.set(+e.target.value)}
                className="w-full accent-accent"
              />
            </div>
          ))}
        </div>
        <div aria-live="polite">
          <span>Estimated recovery each month</span>
          <big className="mt-1 block font-display text-[clamp(2.4rem,5.4vw,3.6rem)] font-extrabold tabular-nums leading-none">
            {inr(roi.totalRecovery)}
          </big>
          <ul className="mt-4 list-none space-y-0 p-0">
            {[
              ["Room revenue each month", roi.monthlyRevenue],
              ["Paid to OTAs each month", roi.otaCommission],
              ["Saved by moving bookings to direct", roi.directSavings],
              ["Recovered from no-shows and double-bookings", roi.errorRecovery],
            ].map(([label, val]) => (
              <li
                key={label as string}
                className="flex justify-between gap-3 border-t border-white/20 py-2.5 text-[0.95rem] tabular-nums"
              >
                <span>{label}</span>
                <b>{inr(val as number)}</b>
              </li>
            ))}
          </ul>
          <p className="mt-3.5 text-[0.8rem] opacity-78">
            Illustrative only. We assume an 18% average OTA commission, 15 percentage points of bookings
            moving to direct, and 1.5% of room revenue lost to booking errors.
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
