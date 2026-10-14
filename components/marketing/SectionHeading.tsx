export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-accent-text">{eyebrow}</p>
      ) : null}
      <h2
        id={id}
        className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.12] tracking-tight text-ink"
      >
        {title}
      </h2>
      {description ? <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-muted">{description}</p> : null}
    </div>
  );
}
