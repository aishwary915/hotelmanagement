import type { ReactNode } from "react";

export function Wrap({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1200px] px-5">{children}</div>;
}
