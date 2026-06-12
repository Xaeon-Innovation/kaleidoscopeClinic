const LOGO_SRC = "/images/logoTransparent2.png";

type BrandLogoProps = {
  size?: number;
  className?: string;
  color?: string;
};

/** Kaleidoscope mark from logoTransparent2.png, tinted via CSS mask. */
export function BrandLogo({
  size = 36,
  className = "",
  color = "var(--gold)",
}: BrandLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={["inline-block shrink-0", className].filter(Boolean).join(" ")}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url(${LOGO_SRC})`,
        maskImage: `url(${LOGO_SRC})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
