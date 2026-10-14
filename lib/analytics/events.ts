declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function trackEvent(name: string, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  window.plausible?.(name, props ? { props } : undefined);
}
