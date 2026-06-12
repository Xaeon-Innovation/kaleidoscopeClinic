"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode[];
};

const SCROLL_PADDING = 32;
const CARD_GAP = 20;

export function CasesCarousel({ children }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = children.length;

  const updateDots = useCallback(() => {
    const row = rowRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!row || cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + CARD_GAP;
    const index = Math.round(row.scrollLeft / cardWidth);
    setActiveIndex(Math.max(0, Math.min(index, cards.length - 1)));
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const row = rowRef.current;
    const card = cardRefs.current[index];
    if (!row || !card) return;
    row.scrollTo({
      left: card.offsetLeft - SCROLL_PADDING,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    row.addEventListener("scroll", updateDots, { passive: true });
    return () => row.removeEventListener("scroll", updateDots);
  }, [updateDots, count]);

  if (count === 0) return null;

  return (
    <>
      <style>{`
        .cases-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-padding-left: 32px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 8px 32px 32px;
        }
        .cases-row::-webkit-scrollbar { display: none; }

        .cases-scroll-card {
          scroll-snap-align: start;
          flex-shrink: 0;
          width: min(420px, 80vw);
        }

        .cases-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px 16px;
        }
        .cases-dots { display: flex; gap: 8px; }
        .dot {
          width: 8px; height: 8px;
          border-radius: 9999px;
          background: #ddd;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          padding: 0;
        }
        .dot.active { width: 24px; background: #0a6d6b; }

        .cases-arrows { display: flex; gap: 8px; }
        .arrow-btn {
          width: 38px; height: 38px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 10px;
          font-size: 20px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #6b7c79;
          transition: all 0.18s ease;
        }
        .arrow-btn:hover { color: #1a2624; border-color: #0a6d6b; }

        @media (max-width: 639px) {
          .cases-row {
            gap: 16px;
            scroll-padding-left: 16px;
            padding: 8px 16px 24px;
          }
          .cases-scroll-card {
            width: min(420px, 88vw);
          }
          .cases-nav {
            padding: 0 16px 12px;
          }
          .arrow-btn {
            width: 44px;
            height: 44px;
          }
        }
      `}</style>

      <div className="cases-section">
        <div className="cases-nav">
          <div className="cases-dots">
            {children.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`dot${i === activeIndex ? " active" : ""}`}
                aria-label={`Go to case ${i + 1}`}
                aria-current={i === activeIndex ? "true" : undefined}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>
          <div className="cases-arrows">
            <button
              type="button"
              className="arrow-btn"
              aria-label="Previous case"
              onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
            >
              &#8249;
            </button>
            <button
              type="button"
              className="arrow-btn"
              aria-label="Next case"
              onClick={() =>
                scrollToIndex(Math.min(activeIndex + 1, count - 1))
              }
            >
              &#8250;
            </button>
          </div>
        </div>

        <div className="cases-row" ref={rowRef}>
          {children.map((child, i) => (
            <div
              key={i}
              className="cases-scroll-card"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
