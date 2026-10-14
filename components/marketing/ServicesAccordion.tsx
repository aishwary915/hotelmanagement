import { SectionHeading } from "@/components/marketing/SectionHeading";

const SERVICES = [
  {
    title: "Guest CRM",
    body: [
      "Every guest gets one profile with past stays, preferences, spend and WhatsApp history. Birthday wishes, repeat-guest offers and review requests send themselves.",
      "In this demo: open any booking on the chart to see the guest's stay and charges.",
    ],
  },
  {
    title: "Booking engine",
    body: [
      "A booking page on your own domain with live availability and UPI or card payments. Direct bookings skip OTA commission and land on the chart instantly.",
      "In this demo: bookings you make on the chart are marked Direct, Walk-in or by channel.",
    ],
  },
  {
    title: "AI agents",
    body: [
      "An assistant on WhatsApp and your website answers questions on rates, availability and policies, takes bookings, and hands over to your staff when a guest needs a person.",
      "In this demo: try the guest assistant tab.",
    ],
  },
  {
    title: "Workflow automation",
    body: [
      "Check-out sends the room to housekeeping. Low stock raises a purchase request. A pending payment sends a reminder. Your team sets the rules without code.",
      "In this demo: check a guest out in the front desk tab and watch housekeeping.",
    ],
  },
  {
    title: "Custom business software",
    body: [
      "Banquet and event booking, multi-property reports, GST and Tally exports, staff rosters or anything specific to your property. Built and supported from Indore.",
    ],
  },
];

export function ServicesAccordion() {
  return (
    <section className="section-block" id="services">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <SectionHeading
          eyebrow="Services"
          title="What we build around the system."
          description="Crescent Code is a software studio in Indore. These five services power the demo above, and we offer them separately or together."
        />
        <div className="card overflow-hidden px-1">
          {SERVICES.map((s, i) => (
            <details key={s.title} className="svc-item border-t border-line px-5 first:border-t-0" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg font-bold text-ink [&::-webkit-details-marker]:hidden md:text-xl">
                {s.title}
                <span className="svc-icon text-2xl leading-none text-accent-text" aria-hidden>
                  +
                </span>
              </summary>
              <div className="max-w-[60ch] pb-5 text-[0.95rem] leading-relaxed text-muted">
                {s.body.map((p) => (
                  <p key={p} className="mb-2.5 last:mb-0">
                    {p.startsWith("In this demo") ? (
                      <>
                        <strong className="font-semibold text-ink">In this demo:</strong>{" "}
                        {p.replace(/^In this demo:\s*/, "")}
                      </>
                    ) : (
                      p
                    )}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
