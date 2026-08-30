"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";
import { toDateKey } from "@/lib/date";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface Cell {
  key: string;
  day: number;
}

/** Month grid starting on Monday, padded with nulls to whole weeks. */
function buildMonth(year: number, month: number): (Cell | null)[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay() is Sunday-first; shift so Monday is index 0.
  const lead = (first.getDay() + 6) % 7;

  const cells: (Cell | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ key: toDateKey(new Date(year, month, day)), day });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function Calendar({
  selected,
  onSelect,
  blocked,
  accentClass,
}: {
  selected: string | null;
  onSelect: (date: string) => void;
  blocked: Set<string>;
  accentClass: string;
}) {
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toDateKey(today), [today]);
  const [cursor, setCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));
  // Drives the slide direction when stepping between months.
  const [direction, setDirection] = useState(1);

  const cells = useMemo(
    () => buildMonth(cursor.year, cursor.month),
    [cursor.year, cursor.month]
  );

  function step(delta: number) {
    setDirection(delta);
    setCursor((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(
    undefined,
    { month: "long", year: "numeric" }
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={monthLabel}
              initial={{ opacity: 0, y: direction * 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction * -10 }}
              transition={{ duration: 0.16 }}
              className="block text-sm font-medium"
            >
              {monthLabel}
            </motion.span>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((label) => (
          <div
            key={label}
            className="pb-1 text-center text-[11px] font-medium uppercase tracking-wide text-white/30"
          >
            {label}
          </div>
        ))}

        {cells.map((cell, index) => {
          if (!cell) return <div key={`pad-${index}`} />;

          const isBlocked = blocked.has(cell.key);
          const isSelected = selected === cell.key;
          const isToday = cell.key === todayKey;

          return (
            <motion.button
              key={cell.key}
              type="button"
              disabled={isBlocked}
              onClick={() => onSelect(cell.key)}
              whileTap={isBlocked ? undefined : { scale: 0.9 }}
              title={isBlocked ? "Already has a session of this type" : undefined}
              className={[
                "relative flex aspect-square items-center justify-center rounded-lg text-sm transition",
                isBlocked
                  ? "cursor-not-allowed text-white/15 line-through"
                  : isSelected
                    ? `font-semibold text-black ${accentClass}`
                    : "text-white/75 hover:bg-white/10",
              ].join(" ")}
            >
              {cell.day}
              {isToday && !isSelected && (
                <span className="absolute bottom-1 size-1 rounded-full bg-white/45" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
