"use client";

import { useDemoStore } from "@/stores/demo-store";
import { Button } from "@/components/demo/ui/Button";
import { trackEvent } from "@/lib/analytics/events";

export function DemoToolbar() {
  const slug = useDemoStore((s) => s.hotel.slug);
  const hotelName = useDemoStore((s) => s.hotel.displayName);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const setToast = useDemoStore((s) => s.setToast);

  const copyLink = async () => {
    const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const url = `${base.replace(/\/$/, "")}/demo?hotel=${encodeURIComponent(slug)}`;
    try {
      await navigator.clipboard.writeText(url);
      setToast("Share link copied.");
    } catch {
      setToast(url);
    }
  };

  return (
    <div className="toolbar-bar">
      <span className="hidden px-2 text-xs font-semibold text-muted sm:inline">
        {hotelName}
      </span>
      <span className="flex-1" />
      <Button variant="ghost" className="!py-2 !text-sm" onClick={resetDemo}>
        Reset demo
      </Button>
      <Button
        variant="ghost"
        className="!py-2 !text-sm"
        onClick={() => {
          trackEvent("demo_started", { source: "toolbar" });
          void copyLink();
        }}
      >
        Copy share link
      </Button>
    </div>
  );
}
