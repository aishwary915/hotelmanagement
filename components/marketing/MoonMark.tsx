export function MoonMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M21 4a12 12 0 1 0 0 24 14 14 0 0 1 0-24z"
        fill="currentColor"
        className="text-accent"
      />
    </svg>
  );
}
