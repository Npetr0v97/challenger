import type { WithId } from "mongodb";
import { CHALLENGE_ID } from "./challenge";
import { sessionsCollection } from "./mongodb";
import type { SessionDoc, SessionType, TrainingSession } from "./types";

/** The key that a sparse unique index uses to hold a day/type slot. */
export function activeKeyFor(type: SessionType, date: string): string {
  return `${CHALLENGE_ID}:${type}:${date}`;
}

export function serialize(doc: WithId<SessionDoc>): TrainingSession {
  return {
    id: doc._id.toString(),
    type: doc.type,
    date: doc.date,
    status: doc.status,
    requestedAt: doc.requestedAt.toISOString(),
    resolvedAt: doc.resolvedAt ? doc.resolvedAt.toISOString() : null,
  };
}

/** All sessions for the challenge, newest training day first. */
export async function listSessions(): Promise<TrainingSession[]> {
  const col = await sessionsCollection();
  const docs = await col
    .find({ challengeId: CHALLENGE_ID })
    .sort({ date: -1, requestedAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export function countApproved(
  sessions: TrainingSession[],
  type: SessionType
): number {
  return sessions.filter((s) => s.type === type && s.status === "approved").length;
}

/**
 * Same as listSessions, but surfaces connection/config failures as a value so
 * pages can render a setup hint instead of a blank 500 on first deploy.
 */
export async function tryListSessions(): Promise<
  { ok: true; sessions: TrainingSession[] } | { ok: false; message: string }
> {
  try {
    return { ok: true, sessions: await listSessions() };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown database error.",
    };
  }
}
