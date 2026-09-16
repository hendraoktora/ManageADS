import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const { valid, username } = verifySessionToken(token);
  if (!valid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: { username, role: "Super Administrator" },
  });
}
