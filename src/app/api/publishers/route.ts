import { NextResponse } from "next/server";
import { getPublishers } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const publishers = await getPublishers();
  return NextResponse.json({ success: true, data: publishers });
}
