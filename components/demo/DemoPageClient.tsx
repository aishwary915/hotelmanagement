"use client";

import { useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";
import { normalizeHotelSlug } from "@/data/hotels";
import { useDemoStore } from "@/stores/demo-store";
import { DemoConsole } from "@/components/demo/DemoConsole";
import { DemoToolbar } from "@/components/demo/DemoToolbar";
import { ModuleTabs } from "@/components/demo/ModuleTabs";
import { ToastHost } from "@/components/demo/ToastHost";
import dynamic from "next/dynamic";

const GuidedTour = dynamic(() => import("@/components/demo/GuidedTour").then((m) => m.GuidedTour), {
  ssr: false,
});

export function DemoPageClient() {
  const params = useSearchParams();
  const hotelParam = params.get("hotel");
  const tour = params.get("tour") === "1";
  const initFromHotel = useDemoStore((s) => s.initFromHotel);
  const slug = useDemoStore((s) => s.hotel.slug);

  useLayoutEffect(() => {
    initFromHotel(normalizeHotelSlug(hotelParam));
  }, [hotelParam, initFromHotel]);

  return (
    <>
      <DemoToolbar />
      <section id="console" aria-label="Booking chart demo">
        <DemoConsole key={slug} />
      </section>
      <ModuleTabs />
      {tour ? <GuidedTour autoStart /> : <GuidedTour />}
      <ToastHost />
    </>
  );
}
