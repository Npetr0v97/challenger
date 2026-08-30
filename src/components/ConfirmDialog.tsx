"use client";

import { motion } from "motion/react";
import Modal from "@/components/Modal";
import { SpinnerIcon } from "@/components/Icons";

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  tone = "neutral",
  pending = false,
  error,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  tone?: "neutral" | "positive" | "negative";
  pending?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmClass =
    tone === "positive"
      ? "bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
      : tone === "negative"
        ? "bg-rose-400 text-rose-950 hover:bg-rose-300"
        : "bg-white text-black hover:bg-white/90";

  return (
    <Modal open={open} onClose={pending ? () => {} : onCancel}>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>

      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

      <div className="mt-6 flex gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="flex-1 rounded-xl border border-white/12 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:text-white disabled:opacity-40"
        >
          Cancel
        </button>
        <motion.button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          whileTap={{ scale: 0.97 }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${confirmClass}`}
        >
          {pending && <SpinnerIcon className="size-4" />}
          {confirmLabel}
        </motion.button>
      </div>
    </Modal>
  );
}
