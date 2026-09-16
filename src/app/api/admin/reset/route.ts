import { NextResponse } from "next/server";
import { clearDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    clearDatabase();
    return NextResponse.json({ success: true, message: "Seluruh data dummy dan log berhasil dibersihkan." });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Gagal membersihkan database", error: String(err) }, { status: 500 });
  }
}
