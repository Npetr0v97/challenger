import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { Role } from "./types";

export const AUTH_COOKIE = "challenger_auth";

function constantTimeEquals(a: string, b: string): boolean {
  // Hashing first keeps the comparison constant-time even when the two
  // strings differ in length, which timingSafeEqual itself rejects.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Maps a submitted password onto a role, or null if it matches neither. */
export function roleForPassword(password: string): Role | null {
  const challenger = process.env.CHALLENGER_PASSWORD;
  const gm = process.env.GM_PASSWORD;
  if (challenger && constantTimeEquals(password, challenger)) return "challenger";
  if (gm && constantTimeEquals(password, gm)) return "gm";
  return null;
}

/**
 * Reads the role off the httpOnly cookie. The cookie holds the password
 * itself and is re-checked against the environment on every request, so a
 * forged cookie is worth nothing without the password.
 */
export async function currentRole(): Promise<Role | null> {
  const value = (await cookies()).get(AUTH_COOKIE)?.value;
  return value ? roleForPassword(value) : null;
}
