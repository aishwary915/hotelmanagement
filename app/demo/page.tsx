import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Wrap } from "@/components/layout/Wrap";
import { DemoPageClient } from "@/components/demo/DemoPageClient";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export const metadata: Metadata = {
  title: "Interactive hotel demo",
  description: "Booking chart, front desk, housekeeping, restaurant POS and rates — demo data only.",
};

export default function DemoPage() {
  return (
    <>
      <SiteHeader demo />
      <Wrap>
        <div className="pb-4 pt-8 md:pt-10">
          <SectionHeading
            eyebrow="Demo workspace"
            title="Your property on one screen."
            description="All numbers and guest names are fictional. Use the property menu to switch skins, or reset anytime you want a clean chart."
          />
        </div>
        <Suspense fallback={<p className="py-12 text-center text-muted">Loading demo…</p>}>
          <DemoPageClient />
        </Suspense>
        <SiteFooter />
      </Wrap>
    </>
  );
}
