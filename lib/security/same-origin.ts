function hostFromUrl(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

function allowedHosts(): Set<string> {
  const hosts = new Set<string>();
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    const h = hostFromUrl(site);
    if (h) hosts.add(h);
  }
  if (process.env.NODE_ENV === "development") {
    hosts.add("localhost:3000");
    hosts.add("127.0.0.1:3000");
  }
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    const vercel = process.env.VERCEL_URL;
    if (vercel) hosts.add(vercel);
    hosts.add("localhost:3000");
  }
  return hosts;
}

function hostAllowed(host: string): boolean {
  const allowed = allowedHosts();
  if (allowed.has(host)) return true;
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    if (host.endsWith(".vercel.app")) return true;
  }
  return false;
}

/** Speed bump only — not a security boundary. */
export function isSameOriginRequest(req: Request): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const candidate = origin ?? referer;
  if (!candidate) {
    return process.env.NODE_ENV === "development";
  }
  const host = hostFromUrl(candidate);
  if (!host) return false;
  return hostAllowed(host);
}
