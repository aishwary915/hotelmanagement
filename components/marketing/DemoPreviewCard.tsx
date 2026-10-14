import Link from "next/link";
import { Button } from "@/components/demo/ui/Button";

export function DemoPreviewCard() {
  return (
    <div className="card-elevated group mt-8 overflow-hidden">
      <div className="grid md:grid-cols-[1fr_auto] md:items-center">
        <div className="border-b border-line p-6 md:border-b-0 md:border-r md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Live interactive demo</p>
          <p className="mt-2 font-display text-xl font-bold text-ink">Booking chart, front desk, POS and rates</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Switch property skins from the header dropdown and share a link with your prospect before the call.
          </p>
        </div>
        <div className="flex flex-col gap-2 p-6 md:min-w-[220px] md:p-8">
          <Link href="/demo">
            <Button className="w-full">Open demo</Button>
          </Link>
          <Link href="/demo?hotel=trivana">
            <Button variant="ghost" className="w-full">
              Preview Trivana skin
            </Button>
          </Link>
        </div>
      </div>
      <div
        className="hidden h-1 md:block"
        style={{
          background: `linear-gradient(90deg, var(--color-brand), var(--color-accent), var(--color-c-bkg))`,
        }}
        aria-hidden
      />
    </div>
  );
}
