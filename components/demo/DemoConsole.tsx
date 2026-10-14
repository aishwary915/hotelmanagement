"use client";

import { computeStats } from "@/lib/booking/stats";
import { inr } from "@/lib/format/inr";
import { useDemoStore } from "@/stores/demo-store";
import { BookingChart } from "@/components/demo/BookingChart";
import { PropertySelect } from "@/components/demo/PropertySelect";
import { SidePanel } from "@/components/demo/SidePanel";

const KPI = [
  { key: "tonight", label: "Rooms booked tonight" },
  { key: "occ7", label: "Occupancy, next 7 nights" },
  { key: "arr", label: "Arrivals today" },
  { key: "rev", label: "Booked revenue" },
] as const;

export function DemoConsole() {
  const hotel = useDemoStore((s) => s.hotel);
  const bookings = useDemoStore((s) => s.bookings);
  const stats = computeStats(bookings, hotel.rooms);

  const values: Record<(typeof KPI)[number]["key"], string> = {
    tonight: `${stats.tonightBooked} of ${stats.roomCount}`,
    occ7: `${stats.occupancy7}%`,
    arr: String(stats.arrivalsToday),
    rev: inr(stats.bookedRevenue),
  };

  return (
    <div className="card-elevated overflow-hidden">
      <div className="bg-deep px-5 py-5 text-white md:px-6 md:py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <PropertySelect />
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6"
            aria-live="polite"
          >
            {KPI.map((k) => (
              <div key={k.key} className="border-l border-white/15 pl-4 first:border-l-0 first:pl-0">
                <b className="kpi-value">{values[k.key]}</b>
                <span className="kpi-label">{k.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid bg-surface lg:grid-cols-[minmax(0,1fr)_340px]">
        <BookingChart />
        <SidePanel />
      </div>
    </div>
  );
}
