import { NextResponse } from "next/server";
import { getBannerById, recordEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const banner = await getBannerById(params.id);

  if (!banner || !banner.isActive) {
    // 1x1 transparent GIF jika tidak ditemukan atau non-aktif
    const transparentGif = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64"
    );
    return new NextResponse(transparentGif, {
      status: 404,
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  }

  // Rekam impression dari direct image request
  const url = new URL(req.url);
  const referrer = url.searchParams.get("ref") || req.headers.get("referer") || req.headers.get("origin") || "";
  const userAgent = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";

  await recordEvent({
    bannerId: banner.id,
    type: "VIEW",
    referrer,
    userAgent,
    ip,
  });

  // Redirect 307 ke gambar aktual dengan no-cache agar perubahan visual langsung tampil
  return NextResponse.redirect(banner.imageUrl, {
    status: 307,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
