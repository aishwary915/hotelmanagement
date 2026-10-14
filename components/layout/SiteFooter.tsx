import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-4 flex flex-col gap-4 border-t border-line pt-10 pb-14 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display font-bold text-ink">Crescent Code</p>
        <p className="mt-1">Indore · Hotel and restaurant software</p>
        <p className="mt-1 text-xs">Demo data only. Not a live property system.</p>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href="/demo" className="nav-link">
          Live demo
        </Link>
        <Link href="/#contact" className="nav-link">
          Contact
        </Link>
      </div>
    </footer>
  );
}
