"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type Props = {
  src: string;
  alt: string;
};

export function HeroFlipCard({ src, alt }: Props) {
  const [flipped, setFlipped] = useState(false);

  const toggle = useCallback(() => setFlipped((v) => !v), []);
  const reset = useCallback(() => setFlipped(false), []);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={toggle}
      onMouseLeave={reset}
      className={[
        "card relative aspect-[4/3] w-full overflow-hidden rounded-[24px] text-left",
        flipped ? "is-flipped" : "",
      ].join(" ")}
    >
      <div className="card-inner">
        <div className="card-front overflow-hidden rounded-[24px] border-0 bg-transparent">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="card-back overflow-hidden rounded-[24px] border-0 bg-[var(--surface-warm)]">
          <Image
            src="/images/hero-card-back.png"
            alt="Kaleidoscope Dental Specialists logo"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </button>
  );
}

