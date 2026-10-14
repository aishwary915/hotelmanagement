import Link from "next/link";
import { MoonMark } from "@/components/marketing/MoonMark";
import { Button } from "@/components/demo/ui/Button";

export function SiteHeader({ demo = false }: { demo?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-ink no-underline md:text-xl"
        >
          <MoonMark className="h-7 w-7 shrink-0" />
          <span>Crescent Code</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {!demo ? (
            <>
              <Link href="/demo" className="nav-link">
                Booking chart
              </Link>
              <Link href="/#services" className="nav-link">
                Services
              </Link>
              <Link href="/#roi" className="nav-link">
                Savings
              </Link>
              <Link href="/#contact" className="nav-link">
                Contact
              </Link>
            </>
          ) : (
            <Link href="/" className="nav-link">
              Back to pitch
            </Link>
          )}
        </nav>
        <Link href="/#contact" className="shrink-0">
          <Button variant="accent" className="!px-3.5 !py-2 !text-sm md:!px-4 md:!py-2.5">
            Book a demo
          </Button>
        </Link>
      </div>
    </header>
  );
}
