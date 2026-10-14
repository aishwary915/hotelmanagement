"use client";

import { useEffect, useState } from "react";
import { useDemoStore } from "@/stores/demo-store";
import { Button } from "@/components/demo/ui/Button";
import { trackEvent } from "@/lib/analytics/events";

const STEPS = [
  "Select free nights on the chart and confirm a booking in the side panel.",
  "Open Front desk and check the guest in.",
  "In Restaurant, add dishes and charge to an in-house room.",
  "Check the guest out and open Housekeeping to see the room marked dirty.",
];

export function GuidedTour({ autoStart = false }: { autoStart?: boolean }) {
  const [open, setOpen] = useState(autoStart);
  const [step, setStep] = useState(0);
  const setTab = useDemoStore((s) => s.setTab);

  useEffect(() => {
    if (autoStart) {
      trackEvent("demo_started", { source: "tour" });
      setTab("fd");
    }
  }, [autoStart, setTab]);

  if (!open) {
    return (
      <div className="fixed bottom-24 right-4 z-40 md:right-6">
        <Button
          variant="accent"
          className="shadow-lg"
          onClick={() => {
            setOpen(true);
            trackEvent("demo_started");
          }}
        >
          Start 60s tour
        </Button>
      </div>
    );
  }

  return (
    <div
      className="card-elevated fixed bottom-24 right-4 z-40 max-w-sm p-5 md:right-6"
      data-tour="panel"
      role="dialog"
      aria-label="Guided tour"
    >
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-text">
        Guided tour · {step + 1} / {STEPS.length}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink">{STEPS[step]}</p>
      <div className="mt-4 flex gap-2">
        <Button
          className="!py-2 !text-sm"
          onClick={() => {
            if (step === 1) setTab("fd");
            if (step === 2) setTab("pos");
            if (step === 3) setTab("hk");
            setStep((s) => Math.min(STEPS.length - 1, s + 1));
          }}
        >
          Next
        </Button>
        <Button variant="ghost" className="!py-2 !text-sm" onClick={() => setOpen(false)}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
