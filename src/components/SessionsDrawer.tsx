"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/lib/useMounted";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  CheckIcon,
  CrossIcon,
  CrossIcon as CloseIcon,
  DumbbellIcon,
  RunIcon,
  TableIcon,
} from "@/components/Icons";
import { formatShort } from "@/lib/date";
import { STATUS_STYLE, TYPE_STYLE } from "@/lib/theme";
import type { Role, SessionStatus, TrainingSession } from "@/lib/types";

type Review = { session: TrainingSession; status: Extract<SessionStatus, "approved" | "declined"> };

export default function SessionsDrawer({
  open,
  onClose,
  sessions,
  role,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  sessions: TrainingSession[];
  role: Role;
  onUpdated: (session: TrainingSession) => void;
}) {
  const mounted = useMounted();
  const [review, setReview] = useState<Review | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  async function applyReview() {
    if (!review || pending) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/sessions/${review.session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: review.status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Couldn't update that session.");
        setPending(false);
        return;
      }
      onUpdated(data.session as TrainingSession);
      setReview(null);
      setPending(false);
    } catch {
      setError("Couldn't reach the server. Try again.");
      setPending(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="glass absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10"
            >
              <header className="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <TableIcon className="size-5 text-white/55" />
                  <h2 className="text-base font-semibold tracking-tight">Sessions</h2>
                  <span className="rounded-full bg-white/8 px-2 py-0.5 font-mono text-xs text-white/50">
                    {sessions.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close sessions"
                  className="flex size-9 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white"
                >
                  <CloseIcon className="size-4" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-3 py-3">
                {sessions.length === 0 ? (
                  <p className="px-2 py-16 text-center text-sm text-white/35">
                    No sessions yet.
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    <AnimatePresence initial={false}>
                      {sessions.map((session, index) => {
                        const typeStyle = TYPE_STYLE[session.type];
                        const statusStyle = STATUS_STYLE[session.status];
                        const Icon =
                          session.type === "strength" ? DumbbellIcon : RunIcon;
                        const reviewable =
                          role === "gm" && session.status === "requested";

                        return (
                          <motion.li
                            key={session.id}
                            layout
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{
                              delay: Math.min(index * 0.025, 0.3),
                              type: "spring",
                              stiffness: 320,
                              damping: 30,
                            }}
                            className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/25 px-3.5 py-3"
                          >
                            <Icon className={`size-5 shrink-0 ${typeStyle.text}`} />

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {formatShort(session.date)}
                              </p>
                              <p className="mt-0.5 text-xs text-white/40">
                                {typeStyle.label}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyle.chip}`}
                            >
                              {statusStyle.label}
                            </span>

                            {reviewable && (
                              <div className="flex shrink-0 gap-1">
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setError(null);
                                    setReview({ session, status: "approved" });
                                  }}
                                  aria-label="Approve session"
                                  className="flex size-8 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-400/10 text-emerald-300 transition hover:bg-emerald-400/20"
                                >
                                  <CheckIcon className="size-4" />
                                </motion.button>
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setError(null);
                                    setReview({ session, status: "declined" });
                                  }}
                                  aria-label="Decline session"
                                  className="flex size-8 items-center justify-center rounded-lg border border-rose-300/25 bg-rose-400/10 text-rose-300 transition hover:bg-rose-400/20"
                                >
                                  <CrossIcon className="size-4" />
                                </motion.button>
                              </div>
                            )}
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={review !== null}
        title={review?.status === "approved" ? "Approve session?" : "Decline session?"}
        body={
          review
            ? `${TYPE_STYLE[review.session.type].label} on ${formatShort(review.session.date)}. This is final — once reviewed, it can't be changed.`
            : ""
        }
        confirmLabel={review?.status === "approved" ? "Approve" : "Decline"}
        tone={review?.status === "approved" ? "positive" : "negative"}
        pending={pending}
        error={error}
        onConfirm={applyReview}
        onCancel={() => {
          if (pending) return;
          setReview(null);
          setError(null);
        }}
      />
    </>,
    document.body
  );
}
