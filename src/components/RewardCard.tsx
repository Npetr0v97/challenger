"use client";

import { motion } from "motion/react";
import { TrophyIcon } from "@/components/Icons";
import { TYPE_STYLE } from "@/lib/theme";
import type { SessionType } from "@/lib/types";

interface Bar {
  type: SessionType;
  label: string;
  done: number;
  target: number;
}

export default function RewardCard({
  title,
  description,
  bars,
}: {
  title: string;
  description: string;
  bars: Bar[];
}) {
  const complete = bars.every((bar) => bar.done >= bar.target);

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 24 }}
      className="glass bloom relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 size-56 rounded-full bg-amber-500/15 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center gap-3">
          <motion.span
            animate={complete ? { rotate: [0, -9, 9, -5, 0] } : undefined}
            transition={{ repeat: complete ? Infinity : 0, repeatDelay: 2.4, duration: 0.7 }}
            className="flex size-11 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-400/10"
          >
            <TrophyIcon className="size-5.5 text-amber-300" />
          </motion.span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/70">
              {title}
            </p>
            <p className="mt-1 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-7 space-y-5">
          {bars.map((bar, index) => {
            const style = TYPE_STYLE[bar.type];
            const pct = Math.min(100, (bar.done / bar.target) * 100);
            return (
              <div key={bar.type}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-white/70">{bar.label}</span>
                  <span className="font-mono text-sm">
                    <span className={style.text}>{bar.done}</span>
                    <span className="text-white/30">/{bar.target}</span>
                    <span className="ml-2 text-white/35">{Math.round(pct)}%</span>
                  </span>
                </div>
                <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      delay: 0.45 + index * 0.12,
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`h-full rounded-full ${style.bar}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {complete && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-200"
          >
            Challenge complete. Time to collect.
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
