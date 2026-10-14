import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Wrap } from "@/components/layout/Wrap";
import { ContactForm } from "@/components/demo/ContactForm";
import { SavingsCalculator } from "@/components/demo/SavingsCalculator";
import { DemoPreviewCard } from "@/components/marketing/DemoPreviewCard";
import { Hero } from "@/components/marketing/Hero";
import { ServicesAccordion } from "@/components/marketing/ServicesAccordion";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { JsonLd } from "@/components/marketing/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <SiteHeader />
      <Wrap>
        <Hero />
        <section className="section-block" id="modules">
          <SectionHeading
            eyebrow="Interactive demo"
            title="Try the live booking chart."
            description="The full console lives on its own page so you can share a link with your property name and room types before a sales call."
          />
          <DemoPreviewCard />
        </section>
        <ServicesAccordion />
        <SavingsCalculator />
        <section className="section-block pb-20" id="contact">
          <div className="card-elevated grid gap-8 p-7 md:grid-cols-2 md:gap-12 md:p-10">
            <SectionHeading
              title="See it with your hotel's name and rooms."
              description="Tell us about the property. We set up this demo with your room types, rates and menu before the call."
            />
            <ContactForm />
          </div>
        </section>
        <SiteFooter />
      </Wrap>
    </>
  );
}
