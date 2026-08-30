"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Calendar from "@/components/Calendar";
import Modal from "@/components/Modal";
import { SpinnerIcon } from "@/components/Icons";
import { formatLong } from "@/lib/date";
import { requirementFor } from "@/lib/challenge";
import { TYPE_STYLE } from "@/lib/theme";
import type { SessionType, TrainingSession } from "@/lib/types";

export default function AddSessionDialog({
  type,
  sessions,
  onClose,
  onCreated,
}: {
  type: SessionType | null;
  sessions: TrainingSession[];
  onClose: () => void;
  onCreated: (session: TrainingSession) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!type) return <Modal open={false} onClose={onClose}>{null}</Modal>;

  const style = TYPE_STYLE[type];
  const requirement = requirementFor(type);

  // A day is taken while it holds a requested or approved session of this
  // type; a declined one releases it.
  const blocked = new Set(
    sessions
      .filter((session) => session.type === type && session.status !== "declined")
      .map((session) => session.date)
  );

  async function submit() {
    if (!selected || pending) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, date: selected }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Couldn't request that session.");
        setPending(false);
        return;
      }
      onCreated(data.session as TrainingSession);
      onClose();
    } catch {
      setError("Couldn't reach the server. Try again.");
      setPending(false);
    }
  }

  return (
    <Modal open onClose={pending ? () => {} : onClose}>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${style.chip}`}
        >
          {style.label}
        </span>
      </div>

      <h2 className="mt-3 text-lg font-semibold tracking-tight">Add a session</h2>
      <p className="mt-1 text-sm text-white/50">{requirement.rule}</p>

      <div className="mt-5">
        <Calendar
          selected={selected}
          onSelect={(date) => {
            setSelected(date);
            setError(null);
          }}
          blocked={blocked}
          accentClass={style.solid}
        />
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.p
            key={selected}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-4 text-center text-sm text-white/65"
          >
            {formatLong(selected)}
          </motion.p>
        )}
      </AnimatePresence>

      {error && <p className="mt-3 text-center text-sm text-rose-300">{error}</p>}

      <div className="mt-5 flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="flex-1 rounded-xl border border-white/12 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:text-white disabled:opacity-40"
        >
          Cancel
        </button>
        <motion.button
          type="button"
          onClick={submit}
          disabled={!selected || pending}
          whileTap={{ scale: 0.97 }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {pending && <SpinnerIcon className="size-4" />}
          {pending ? "Sending" : "Confirm"}
        </motion.button>
      </div>
    </Modal>
  );
}
