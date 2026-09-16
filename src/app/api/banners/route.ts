import { NextResponse } from "next/server";
import { getBanners, createBanner } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const banners = getBanners();
  return NextResponse.json({ success: true, data: banners });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, targetUrl, imageUrl, altText, size, backlinkRel, isActive } = body;

    if (!name || !targetUrl || !imageUrl) {
      return NextResponse.json(
        { success: false, message: "Nama, target URL, dan gambar banner wajib diisi." },
        { status: 400 }
      );
    }

    const banner = createBanner({
      name,
      targetUrl,
      imageUrl,
      altText: altText || name,
      size: size || "responsive",
      backlinkRel: backlinkRel || "dofollow",
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat membuat banner", error: String(err) },
      { status: 500 }
    );
  }
}
