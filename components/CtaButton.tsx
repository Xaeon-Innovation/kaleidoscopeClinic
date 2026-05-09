import Link from "next/link";
import { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--gold)] text-[var(--ink-on-gold)] hover:bg-[var(--gold-2)]",
  secondary:
    "bg-transparent text-[var(--gold)] ring-1 ring-[var(--gold)] hover:bg-white/10",
  ghost:
    "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15",
};

export function CtaButton({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      {...props}
      className={[base, variants[variant], className].filter(Boolean).join(" ")}
    />
  );
}

