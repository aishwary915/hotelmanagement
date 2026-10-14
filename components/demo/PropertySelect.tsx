"use client";

import { useRouter } from "next/navigation";
import { listHotels } from "@/data/hotels";
import { useDemoStore } from "@/stores/demo-store";

export function PropertySelect() {
  const router = useRouter();
  const slug = useDemoStore((s) => s.hotel.slug);
  const hotels = listHotels();

  return (
    <div className="prop">
      <label htmlFor="prop" className="block text-[0.78rem] opacity-75">
        Property
      </label>
      <select
        id="prop"
        value={slug}
        className="max-w-full cursor-pointer border-0 border-b border-white/40 bg-transparent py-0.5 font-display text-xl font-bold text-white outline-none"
        onChange={(e) => {
          const next = e.target.value;
          router.push(`/demo?hotel=${encodeURIComponent(next)}`);
        }}
      >
        {hotels.map((h) => (
          <option key={h.slug} value={h.slug} className="text-ink">
            {h.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}
