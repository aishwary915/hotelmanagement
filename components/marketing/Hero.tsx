"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MoonMark } from "@/components/marketing/MoonMark";
import { Button } from "@/components/demo/ui/Button";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden pb-4 pt-10 md:pt-14">
      <MoonMark className="pointer-events-none absolute -right-8 top-0 w-[min(340px,55vw)] text-brand opacity-[0.07]" />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative"
      >
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-accent-text">
          Hotel and restaurant software · Indore
        </p>
        <h1 className="max-w-[14ch] font-display text-[clamp(2.35rem,5.2vw,4rem)] font-extrabold leading-[1.08] tracking-tight">
          One screen for every room, table and guest.
        </h1>
        <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted">
          A working demo of the property management and POS stack we build for hotels and restaurants
          across India. Book a room, run the front desk, post F&B to a folio — on one connected
          screen.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/demo">
            <Button>Try the booking chart</Button>
          </Link>
          <Link href="#contact">
            <Button variant="ghost">Get this for my hotel</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
