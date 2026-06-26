import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

type BrandWordmarkVariant = "light" | "dark";

type BrandWordmarkTextScale = "default" | "lg" | "compact";

type BrandWordmarkProps = {
  size?: number;
  variant?: BrandWordmarkVariant;
  textScale?: BrandWordmarkTextScale;
  className?: string;
  href?: string;
  showIcon?: boolean;
  showSubtitle?: boolean;
  align?: "left" | "center";
  iconClassName?: string;
  /** Extra line below subtitle (e.g. ADMIN PORTAL) */
  suffix?: React.ReactNode;
};

const variantStyles: Record<
  BrandWordmarkVariant,
  { main: string; sub: string; icon: string }
> = {
  light: {
    main: "text-[var(--brand-dark)]",
    sub: "text-[var(--brand-dark)]",
    icon: "var(--gold)",
  },
  dark: {
    main: "text-white",
    sub: "text-white/90",
    icon: "var(--gold)",
  },
};

const textScaleStyles: Record<
  BrandWordmarkTextScale,
  { main: string; sub: string }
> = {
  default: {
    main: "text-[1.45rem] sm:text-[1.625rem]",
    sub: "text-[0.5rem] sm:text-[0.5625rem] tracking-[0.22em] sm:tracking-[0.24em]",
  },
  lg: {
    main: "text-[1.65rem] sm:text-[1.875rem]",
    sub: "text-[0.5rem] sm:text-[0.5625rem] tracking-[0.22em] sm:tracking-[0.24em]",
  },
  compact: {
    main: "text-[1.125rem]",
    sub: "text-[0.4375rem] tracking-[0.2em]",
  },
};

export function BrandWordmark({
  size = 36,
  variant = "light",
  textScale = "default",
  className = "",
  href,
  showIcon = true,
  showSubtitle = true,
  align = "left",
  iconClassName = "",
  suffix,
}: BrandWordmarkProps) {
  const colors = variantStyles[variant];
  const typography = textScaleStyles[textScale];

  const content = (
    <>
      {showIcon ? (
        <BrandLogo
          size={size}
          color={colors.icon}
          className={[
            "shrink-0 transition group-hover:opacity-85",
            iconClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        />
      ) : null}
      <div
        className={[
          "min-w-0 leading-none",
          align === "center" ? "text-center" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            "truncate font-brand-wordmark font-normal lowercase tracking-normal",
            typography.main,
            colors.main,
          ].join(" ")}
        >
          kaleidoscope
        </div>
        {showSubtitle ? (
          <div
            className={[
              "mt-[0.35em] truncate font-sans font-medium uppercase",
              typography.sub,
              colors.sub,
            ].join(" ")}
          >
            DENTAL SPECIALISTS
          </div>
        ) : null}
        {suffix ? <div className="mt-1">{suffix}</div> : null}
      </div>
    </>
  );

  const rootClass = [
    "group flex min-w-0 gap-3",
    align === "center" ? "flex-col items-center" : "flex-row items-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={rootClass}>
        {content}
      </Link>
    );
  }

  return <div className={rootClass}>{content}</div>;
}
