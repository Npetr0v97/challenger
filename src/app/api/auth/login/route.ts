import { NextResponse } from "next/server";
import { AUTH_COOKIE, roleForPassword } from "@/lib/auth";

export async function POST(request: Request) {
  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Enter a password." }, { status: 400 });
  }

  const role = roleForPassword(password);
  if (!role) {
    return NextResponse.json({ error: "That password doesn't work." }, { status: 401 });
  }

  const response = NextResponse.json({ role });
  response.cookies.set(AUTH_COOKIE, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
