import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <section className="container-x pt-20 md:pt-28 pb-12">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display-xl mt-5 max-w-5xl">{title}</h1>
      {lead && <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">{lead}</p>}
    </section>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`container-x py-20 md:py-28 ${className}`}>{children}</section>;
}

export function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="border-t border-border pt-6">
      <p className="mono-num text-5xl md:text-6xl text-foreground">{value}</p>
      <p className="mt-3 text-sm font-medium">{label}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
