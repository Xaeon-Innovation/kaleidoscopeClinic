"use client";

import { useMemo, useState } from "react";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

type Props = {
  availableDates: Set<string>; // "YYYY-MM-DD"
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
};

export function CalendarGrid({ availableDates, selectedDate, onDateSelect }: Props) {
  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth()); // 0-indexed

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  // Build the grid (ISO weeks start Monday)
  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    // ISO: Monday = 0
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const total = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    return Array.from({ length: total }, (_, i) => {
      const dayNum = i - startOffset + 1;
      if (dayNum < 1 || dayNum > daysInMonth) return null;
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      return dateStr;
    });
  }, [viewYear, viewMonth]);

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--brand-dark)]/15 text-[var(--brand-dark)] hover:bg-[var(--surface-warm)] transition"
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-[var(--brand-dark)]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--brand-dark)]/15 text-[var(--brand-dark)] hover:bg-[var(--surface-warm)] transition"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-black/35"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((dateStr, i) => {
          if (!dateStr) {
            return <div key={i} />;
          }
          const isPast = dateStr < today;
          const isAvailable = availableDates.has(dateStr);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isPast || !isAvailable}
              onClick={() => isAvailable && !isPast && onDateSelect(dateStr)}
              className={[
                "relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition",
                isSelected
                  ? "bg-[var(--brand-dark)] text-white font-semibold shadow"
                  : isAvailable && !isPast
                  ? "bg-[var(--gold)]/20 text-[var(--brand-dark)] font-medium hover:bg-[var(--gold)] hover:text-[var(--ink-on-gold)] cursor-pointer"
                  : isPast
                  ? "text-black/20 cursor-not-allowed"
                  : "text-black/35 cursor-not-allowed",
              ].join(" ")}
              aria-label={`${dateStr}${isAvailable ? " — slots available" : ""}`}
            >
              {Number(dateStr.split("-")[2])}
              {isToday && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--gold)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-black/50">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[var(--gold)]/30" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[var(--brand-dark)]" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-black/10" />
          Unavailable
        </span>
      </div>
    </div>
  );
}
