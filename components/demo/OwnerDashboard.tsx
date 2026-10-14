"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHANNEL_LABELS, type ChannelId } from "@/data/types";
import { occupancyRate } from "@/lib/booking/availability";
import { DAYS, dayDate } from "@/lib/dates";
import { useDemoStore } from "@/stores/demo-store";

const PIE_COLORS = ["#0f3b40", "#c8963e", "#456ca3", "#7b5e9b"];

export function OwnerDashboard() {
  const hotel = useDemoStore((s) => s.hotel);
  const bookings = useDemoStore((s) => s.bookings);
  const folio = useDemoStore((s) => s.folio);

  const occData = Array.from({ length: DAYS }, (_, d) => ({
    day: dayDate(d).getDate(),
    occ: Math.round(occupancyRate(bookings, hotel.rooms, d) * 100),
  }));

  const channelCounts: Record<ChannelId, number> = { direct: 0, mmt: 0, bkg: 0, walk: 0 };
  bookings.forEach((b) => {
    channelCounts[b.ch] += 1;
  });
  const channelData = (Object.keys(channelCounts) as ChannelId[]).map((ch) => ({
    name: CHANNEL_LABELS[ch],
    value: channelCounts[ch],
  }));

  const fbTotal = Object.values(folio).reduce((a, b) => a + b, 0);
  const revData = Array.from({ length: 7 }, (_, i) => ({
    label: `W${i + 1}`,
    revenue: Math.round(bookings.reduce((s, b) => s + b.total, 0) / 7 + i * 1200),
  }));

  return (
    <>
      <p className="mb-4 text-sm text-muted">Illustrative dashboard from demo bookings and folio charges.</p>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-64">
          <h3 className="mb-2 font-display text-lg">Occupancy next 14 nights</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={occData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis unit="%" fontSize={12} />
              <Tooltip />
              <Bar dataKey="occ" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <h3 className="mb-2 font-display text-lg">Channel mix</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {channelData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64 lg:col-span-2">
          <h3 className="mb-2 font-display text-lg">Room revenue trend (demo)</h3>
          <p className="mb-2 text-sm text-muted">F&B posted to rooms: ₹{fbTotal.toLocaleString("en-IN")}</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
