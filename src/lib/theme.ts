import type { SessionStatus, SessionType } from "./types";

/**
 * Full class strings per variant — Tailwind only keeps classes it can see as
 * literals, so these must never be assembled from fragments at runtime.
 */
export const TYPE_STYLE: Record<
  SessionType,
  {
    label: string;
    text: string;
    border: string;
    bar: string;
    halo: string;
    chip: string;
    button: string;
    solid: string;
  }
> = {
  strength: {
    label: "Strength",
    text: "text-amber-300",
    border: "border-amber-300/25",
    bar: "bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500",
    halo: "bg-amber-500/25",
    chip: "border-amber-300/25 bg-amber-400/10 text-amber-200",
    button:
      "border-amber-300/30 bg-amber-400/10 text-amber-100 hover:border-amber-300/60 hover:bg-amber-400/20",
    solid: "bg-amber-300",
  },
  running: {
    label: "Running",
    text: "text-cyan-300",
    border: "border-cyan-300/25",
    bar: "bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-500",
    halo: "bg-cyan-500/25",
    chip: "border-cyan-300/25 bg-cyan-400/10 text-cyan-200",
    button:
      "border-cyan-300/30 bg-cyan-400/10 text-cyan-100 hover:border-cyan-300/60 hover:bg-cyan-400/20",
    solid: "bg-cyan-300",
  },
};

export const STATUS_STYLE: Record<SessionStatus, { label: string; chip: string }> = {
  requested: {
    label: "Requested",
    chip: "border-amber-300/30 bg-amber-400/10 text-amber-200",
  },
  approved: {
    label: "Approved",
    chip: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
  },
  declined: {
    label: "Declined",
    chip: "border-rose-300/30 bg-rose-400/10 text-rose-200",
  },
};
