"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRightIcon, DumbbellIcon, RunIcon } from "@/components/Icons";
import { TYPE_STYLE } from "@/lib/theme";
import type { SessionType } from "@/lib/types";

interface ProgressEntry {
  type: SessionType;
  label: string;
  done: number;
  target: number;
}

export default function ChallengeCard({
  href,
  title,
  tagline,
  deadline,
  progress,
}: {
  href: string;
  title: string;
  tagline: string;
  deadline: string;
  progress: ProgressEntry[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 190, damping: 24 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={href}
        className="glass bloom group block overflow-hidden rounded-3xl p-6 transition-colors hover:border-white/25 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
                Live
              </span>
              <span className="text-xs text-white/40">Ends {deadline}</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-white/50">{tagline}</p>
          </div>

          <motion.div
            aria-hidden
            className="mt-1 shrink-0 text-white/30 transition-colors group-hover:text-white"
            whileHover={{ x: 3 }}
          >
            <ArrowRightIcon className="size-6" />
          </motion.div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {progress.map((entry, index) => {
            const style = TYPE_STYLE[entry.type];
            const pct = Math.min(100, (entry.done / entry.target) * 100);
            const Icon = entry.type === "strength" ? DumbbellIcon : RunIcon;
            return (
              <div key={entry.type} className="rounded-2xl border border-white/8 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm text-white/65">
                    <Icon className={`size-4 ${style.text}`} />
                    {entry.label}
                  </span>
                  <span className="font-mono text-sm text-white/80">
                    {entry.done}
                    <span className="text-white/35">/{entry.target}</span>
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.35 + index * 0.1, duration: 0.85, ease: "easeOut" }}
                    className={`h-full rounded-full ${style.bar}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Link>
    </motion.div>
  );
}
