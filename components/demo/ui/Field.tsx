import type { InputHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-3.5 block ${className}`}>
      <label htmlFor={htmlFor} className="mb-1 block text-[0.82rem] text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input-base" {...props} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="input-base" {...props} />;
}
