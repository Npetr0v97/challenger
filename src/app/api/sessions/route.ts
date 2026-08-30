import { NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import { CHALLENGE_ID } from "@/lib/challenge";
import { sessionsCollection } from "@/lib/mongodb";
import { activeKeyFor, listSessions, serialize } from "@/lib/sessions";
import { isSessionType, isValidDate, type SessionDoc } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const role = await currentRole();
  if (!role) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  return NextResponse.json({ sessions: await listSessions() });
}

export async function POST(request: Request) {
  const role = await currentRole();
  if (!role) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (role !== "challenger") {
    return NextResponse.json(
      { error: "Only the challenger can request sessions." },
      { status: 403 }
    );
  }

  let body: { type?: unknown; date?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const { type, date } = body;
  if (!isSessionType(type)) {
    return NextResponse.json({ error: "Unknown session type." }, { status: 400 });
  }
  if (!isValidDate(date)) {
    return NextResponse.json({ error: "Pick a valid date." }, { status: 400 });
  }

  const col = await sessionsCollection();
  const doc: SessionDoc = {
    challengeId: CHALLENGE_ID,
    type,
    date,
    status: "requested",
    activeKey: activeKeyFor(type, date),
    requestedAt: new Date(),
    resolvedAt: null,
  };

  try {
    const { insertedId } = await col.insertOne(doc);
    return NextResponse.json(
      { session: serialize({ ...doc, _id: insertedId }) },
      { status: 201 }
    );
  } catch (error) {
    // Duplicate key means the sparse unique index already holds this
    // type/day slot with a requested or approved session.
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { error: "That day already has a session of this type." },
        { status: 409 }
      );
    }
    throw error;
  }
}
