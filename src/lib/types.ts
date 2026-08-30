export type Role = "challenger" | "gm";

export type SessionType = "strength" | "running";

export type SessionStatus = "requested" | "approved" | "declined";

/** A training session as sent to the client. */
export interface TrainingSession {
  id: string;
  type: SessionType;
  date: string; // YYYY-MM-DD, local calendar day
  status: SessionStatus;
  requestedAt: string;
  resolvedAt: string | null;
}

/** Shape stored in MongoDB. */
export interface SessionDoc {
  challengeId: string;
  type: SessionType;
  date: string;
  status: SessionStatus;
  /**
   * Present only while the session is requested or approved, so a sparse
   * unique index enforces "one live session per type per day" at the DB
   * level. Unset on decline, which frees the slot again.
   */
  activeKey?: string;
  requestedAt: Date;
  resolvedAt: Date | null;
}

export const SESSION_TYPES: SessionType[] = ["strength", "running"];

export function isSessionType(v: unknown): v is SessionType {
  return v === "strength" || v === "running";
}

/** Accepts only a real YYYY-MM-DD calendar day. */
export function isValidDate(v: unknown): v is string {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = v.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}
