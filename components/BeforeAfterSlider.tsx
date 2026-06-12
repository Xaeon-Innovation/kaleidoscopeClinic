"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  beforeSrc?: string;
  afterSrc?: string;
  altBase: string;
  className?: string;
  initial?: number; // 0..1 — divider at 0.5 shows left half before, right half after
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

const imageClass =
  "pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center";

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  altBase,
  className,
  initial = 0.5,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [ratio, setRatio] = useState(() => clamp01(initial));
  const [dragging, setDragging] = useState(false);

  const dividerLeft = useMemo(() => `${ratio * 100}%`, [ratio]);
  const beforeClip = useMemo(
    () => `inset(0 ${(1 - ratio) * 100}% 0 0)`,
    [ratio]
  );
  const afterClip = useMemo(() => `inset(0 0 0 ${ratio * 100}%)`, [ratio]);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging) return;
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setRatio(clamp01(x / rect.width));
    }
    function onUp() {
      setDragging(false);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  return (
    <div
      ref={rootRef}
      className={[
        "relative isolate w-full overflow-hidden bg-black/5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative aspect-[4/3] w-full">
        {beforeSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={beforeSrc}
            alt={`${altBase} before`}
            className={imageClass}
            style={{ clipPath: beforeClip }}
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-black/10" />
        )}

        {afterSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={afterSrc}
            alt={`${altBase} after`}
            className={imageClass}
            style={{ clipPath: afterClip }}
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-black/10" />
        )}

        <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold text-white">
          Before
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold text-white">
          After
        </div>

        <div
          className="absolute inset-y-0 z-20"
          style={{ left: dividerLeft }}
          aria-hidden
        >
          <div className="absolute inset-y-0 -translate-x-1/2 w-[2px] bg-white/90 shadow" />
          <button
            type="button"
            onPointerDown={(e) => {
              (e.currentTarget as HTMLButtonElement).setPointerCapture(
                e.pointerId
              );
              setDragging(true);
            }}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow ring-1 ring-black/10"
            aria-label="Drag to compare before and after"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--gold)] text-[10px] font-black text-[var(--ink-on-gold)]">
              ↔
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
