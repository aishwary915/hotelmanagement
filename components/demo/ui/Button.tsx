import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "brand" | "accent" | "ghost";

const variants: Record<Variant, string> = {
  brand:
    "bg-brand text-brand-on shadow-[0_1px_2px_rgba(15,59,64,0.2)] hover:brightness-110 active:scale-[0.98]",
  accent:
    "bg-accent text-accent-on shadow-[0_1px_2px_rgba(42,28,3,0.15)] hover:brightness-110 active:scale-[0.98]",
  ghost:
    "border border-line bg-surface/60 text-ink shadow-sm hover:border-ink/30 hover:bg-surface active:scale-[0.98]",
};

export function Button({
  variant = "brand",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-bold transition-[transform,filter,background-color,border-color] duration-150 disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
