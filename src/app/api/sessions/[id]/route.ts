import { ObjectId, type UpdateFilter } from "mongodb";
import { NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import { CHALLENGE_ID } from "@/lib/challenge";
import { sessionsCollection } from "@/lib/mongodb";
import { serialize } from "@/lib/sessions";
import type { SessionDoc } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/sessions/[id]">
) {
  const role = await currentRole();
  if (!role) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (role !== "gm") {
    return NextResponse.json(
      { error: "Only the general manager can review sessions." },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Unknown session." }, { status: 404 });
  }

  let body: { status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const { status } = body;
  if (status !== "approved" && status !== "declined") {
    return NextResponse.json(
      { error: "Status must be approved or declined." },
      { status: 400 }
    );
  }

  const update: UpdateFilter<SessionDoc> = {
    $set: { status, resolvedAt: new Date() },
  };
  // Declining releases the day/type slot so it can be requested again.
  if (status === "declined") update.$unset = { activeKey: "" };

  const col = await sessionsCollection();
  // Filtering on "requested" makes the transition atomic: a session that has
  // already been resolved cannot be flipped, even under a concurrent click.
  const updated = await col.findOneAndUpdate(
    { _id: new ObjectId(id), challengeId: CHALLENGE_ID, status: "requested" },
    update,
    { returnDocument: "after" }
  );

  if (!updated) {
    const exists = await col.findOne({ _id: new ObjectId(id) });
    return exists
      ? NextResponse.json(
          { error: "That session has already been reviewed." },
          { status: 409 }
        )
      : NextResponse.json({ error: "Unknown session." }, { status: 404 });
  }

  return NextResponse.json({ session: serialize(updated) });
}
