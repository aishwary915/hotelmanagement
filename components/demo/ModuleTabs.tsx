"use client";

import dynamic from "next/dynamic";
import { useDemoStore, type DemoTab } from "@/stores/demo-store";
import { FrontDesk } from "@/components/demo/FrontDesk";
import { Housekeeping } from "@/components/demo/Housekeeping";
import { RestaurantPOS } from "@/components/demo/RestaurantPOS";
import { RateEngine } from "@/components/demo/RateEngine";
import { GuestAssistant } from "@/components/demo/GuestAssistant";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const BanquetEvents = dynamic(() => import("@/components/demo/BanquetEvents").then((m) => m.BanquetEvents), {
  ssr: false,
});
const OwnerDashboard = dynamic(
  () => import("@/components/demo/OwnerDashboard").then((m) => m.OwnerDashboard),
  { ssr: false },
);

const TABS: { id: DemoTab; label: string }[] = [
  { id: "fd", label: "Front desk" },
  { id: "hk", label: "Housekeeping" },
  { id: "pos", label: "Restaurant" },
  { id: "rate", label: "Rates" },
  { id: "ai", label: "Guest assistant" },
  { id: "banquet", label: "Banquet and events" },
  { id: "dashboard", label: "Owner dashboard" },
];

export function ModuleTabs() {
  const tab = useDemoStore((s) => s.tab);
  const setTab = useDemoStore((s) => s.setTab);

  return (
    <section className="section-block" id="modules" aria-labelledby="modules-heading">
      <SectionHeading
        id="modules-heading"
        eyebrow="Connected modules"
        title="The rest of the hotel runs from the same data."
        description="Check a guest out at the front desk and the room lands in housekeeping. Charge dinner to a room in the restaurant tab and it shows on that guest's booking."
      />
      <div className="module-shell mt-8">
        <div
          role="tablist"
          aria-label="Modules"
          className="flex gap-0.5 overflow-x-auto border-b border-line bg-[color-mix(in_srgb,var(--color-bg)_40%,var(--color-surface))] px-2 pt-2"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="module-panel"
              tabIndex={tab === t.id ? 0 : -1}
              className={`whitespace-nowrap rounded-t-lg px-3.5 py-2.5 text-sm font-bold transition-colors md:px-4 ${
                tab === t.id
                  ? "bg-surface text-ink shadow-[0_-1px_0_var(--color-surface)] ring-1 ring-line"
                  : "text-muted hover:bg-surface/60 hover:text-ink"
              }`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div
          id="module-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="min-h-[400px] p-6 md:p-7"
        >
          {tab === "fd" ? <FrontDesk /> : null}
          {tab === "hk" ? <Housekeeping /> : null}
          {tab === "pos" ? <RestaurantPOS /> : null}
          {tab === "rate" ? <RateEngine /> : null}
          {tab === "ai" ? <GuestAssistant /> : null}
          {tab === "banquet" ? <BanquetEvents /> : null}
          {tab === "dashboard" ? <OwnerDashboard /> : null}
        </div>
      </div>
    </section>
  );
}
