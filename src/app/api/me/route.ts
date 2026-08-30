import { NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ role: await currentRole() });
}
