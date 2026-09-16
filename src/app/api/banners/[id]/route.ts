import { NextResponse } from "next/server";
import { getBannerById, updateBanner, deleteBanner } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const banner = getBannerById(params.id);
  if (!banner) {
    return NextResponse.json({ success: false, message: "Banner tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: banner });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = updateBanner(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Banner tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Gagal memperbarui banner", error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const deleted = deleteBanner(params.id);
  if (!deleted) {
    return NextResponse.json({ success: false, message: "Banner tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Banner berhasil dihapus" });
}
