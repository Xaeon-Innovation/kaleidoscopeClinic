"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode[];
};

const CARD_GAP = 20;

function scrollPadding() {
  return typeof window !== "undefined" && window.innerWidth < 640 ? 16 : 32;
}

function canDragCarousel(target: EventTarget | null) {
  if (!(target instanceof Element)) return true;
  return !target.closest("button, a, input, [data-no-carousel-drag]");
}

export function CasesCarousel({ children }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startScroll: 0, pointerId: -1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const count = children.length;

  const getCards = useCallback(() => {
    const row = rowRef.current;
    if (!row) return [];
    return Array.from(
      row.querySelectorAll<HTMLElement>(".cases-scroll-card")
    );
  }, []);

  const maxScrollLeft = useCallback(() => {
    const row = rowRef.current;
    if (!row) return 0;
    return Math.max(0, row.scrollWidth - row.clientWidth);
  }, []);

  const updateDots = useCallback(() => {
    const row = rowRef.current;
    if (!row || count === 0) return;

    const cards = getCards();
    const maxScroll = maxScrollLeft();

    if (maxScroll <= 0 || cards.length === 0) {
      setActiveIndex(0);
      setAtStart(true);
      setAtEnd(true);
      return;
    }

    const left = row.scrollLeft;
    setAtStart(left <= 2);
    setAtEnd(left >= maxScroll - 2);

    if (left >= maxScroll - 2) {
      setActiveIndex(count - 1);
      return;
    }

    const anchor = left + scrollPadding();
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - anchor);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActiveIndex(best);
  }, [count, getCards, maxScrollLeft]);

  const scrollToCard = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const row = rowRef.current;
      if (!row) return;
      const cards = getCards();
      const card = cards[index];
      if (!card) return;

      const padding = scrollPadding();
      const target = Math.min(
        Math.max(0, card.offsetLeft - padding),
        maxScrollLeft()
      );

      row.scrollTo({ left: target, behavior });
    },
    [getCards, maxScrollLeft]
  );

  const scrollByCards = useCallback(
    (delta: number) => {
      scrollToCard(Math.max(0, Math.min(activeIndex + delta, count - 1)));
    },
    [activeIndex, count, scrollToCard]
  );

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    row.addEventListener("scroll", updateDots, { passive: true });
    const observer = new ResizeObserver(() => updateDots());
    observer.observe(row);
    updateDots();
    return () => {
      row.removeEventListener("scroll", updateDots);
      observer.disconnect();
    };
  }, [updateDots, count]);

  function onRowPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || !canDragCarousel(e.target)) return;
    const row = rowRef.current;
    if (!row) return;

    dragRef.current = {
      startX: e.clientX,
      startScroll: row.scrollLeft,
      pointerId: e.pointerId,
    };
    setIsDragging(true);
    row.setPointerCapture(e.pointerId);
  }

  function onRowPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!isDragging || dragRef.current.pointerId !== e.pointerId) return;
    const row = rowRef.current;
    if (!row) return;

    const dx = e.clientX - dragRef.current.startX;
    row.scrollLeft = dragRef.current.startScroll - dx;
  }

  function endDrag(e: PointerEvent<HTMLDivElement>) {
    if (!isDragging || dragRef.current.pointerId !== e.pointerId) return;
    setIsDragging(false);
    rowRef.current?.releasePointerCapture(e.pointerId);
    dragRef.current.pointerId = -1;
    updateDots();
  }

  if (count === 0) return null;

  return (
    <>
      <style>{`
        .cases-row {
          display: flex;
          gap: ${CARD_GAP}px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-padding-left: 32px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 8px 32px 32px;
          cursor: grab;
          touch-action: pan-y;
        }
        .cases-row.is-dragging {
          cursor: grabbing;
          scroll-snap-type: none;
          user-select: none;
        }
        .cases-row::-webkit-scrollbar { display: none; }

        .cases-scroll-card {
          scroll-snap-align: start;
          flex-shrink: 0;
          width: calc((100vw - 64px - 40px) / 3);
          min-width: 300px;
          max-width: 620px;
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
        .arrow-btn:hover:not(:disabled) { color: #1a2624; border-color: #0a6d6b; }
        .arrow-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        @media (max-width: 639px) {
          .cases-row {
            gap: 16px;
            scroll-padding-left: 16px;
            padding: 8px 16px 24px;
          }
          .cases-scroll-card {
            width: min(88vw, 420px);
            min-width: 0;
            max-width: none;
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
                onClick={() => scrollToCard(i)}
              />
            ))}
          </div>
          <div className="cases-arrows">
            <button
              type="button"
              className="arrow-btn"
              aria-label="Previous case"
              disabled={atStart}
              onClick={() => scrollByCards(-1)}
            >
              &#8249;
            </button>
            <button
              type="button"
              className="arrow-btn"
              aria-label="Next case"
              disabled={atEnd}
              onClick={() => scrollByCards(1)}
            >
              &#8250;
            </button>
          </div>
        </div>

        <div
          className={`cases-row${isDragging ? " is-dragging" : ""}`}
          ref={rowRef}
          onPointerDown={onRowPointerDown}
          onPointerMove={onRowPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {children.map((child, i) => (
            <div key={i} className="cases-scroll-card">
              {child}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
