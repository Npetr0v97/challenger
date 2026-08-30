"use client";

import { motion } from "motion/react";
import { DumbbellIcon, PlusIcon, RunIcon } from "@/components/Icons";
import type { RequirementSpec } from "@/lib/challenge";
import { TYPE_STYLE } from "@/lib/theme";

export default function RequirementCard({
  requirement,
  approved,
  requested,
  canAdd,
  onAdd,
  index,
}: {
  requirement: RequirementSpec;
  approved: number;
  requested: number;
  canAdd: boolean;
  onAdd: () => void;
  index: number;
}) {
  const style = TYPE_STYLE[requirement.type];
  const Icon = requirement.type === "strength" ? DumbbellIcon : RunIcon;
  const remaining = Math.max(0, requirement.target - approved);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.08, type: "spring", stiffness: 200, damping: 24 }}
      className="flex flex-col"
    >
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className={`glass bloom relative flex-1 overflow-hidden rounded-2xl p-6 ${style.border}`}
      >
        {/* Soft colour wash keyed to the discipline. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full blur-3xl ${style.halo}`}
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Icon className={`size-4.5 ${style.text}`} />
              </span>
              <h3 className="text-base font-semibold tracking-tight">
                {requirement.label}
              </h3>
            </div>
            <span className="font-mono text-sm text-white/45">
              {approved}
              <span className="text-white/25">/{requirement.target}</span>
            </span>
          </div>

          <p className="mt-4 text-2xl font-semibold tracking-tight">
            {requirement.target}{" "}
            <span className="text-white/45">{requirement.unitPlural}</span>
          </p>
          <p className="mt-1 text-sm text-white/45">by the end of the year</p>

          <p className="mt-4 border-t border-white/8 pt-4 text-sm leading-relaxed text-white/55">
            {requirement.rule}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-emerald-200">
              {approved} approved
            </span>
            {requested > 0 && (
              <span className="rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-amber-200">
                {requested} pending
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/50">
              {remaining} to go
            </span>
          </div>
        </div>
      </motion.div>

      {canAdd && (
        <motion.button
          type="button"
          onClick={onAdd}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className={`mt-3 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${style.button}`}
        >
          <PlusIcon className="size-4" />
          Add session
        </motion.button>
      )}
    </motion.div>
  );
}
