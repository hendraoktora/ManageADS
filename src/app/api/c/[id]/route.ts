import { NextResponse } from "next/server";
import { getBannerById, recordEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const banner = await getBannerById(params.id);
  const url = new URL(req.url);

  // Jika banner tidak ditemukan, redirect ke fallback
  if (!banner) {
    return NextResponse.redirect("https://google.com", { status: 302 });
  }

  // Ambil referrer dari header atau query param ?ref=
  const referrer = url.searchParams.get("ref") || req.headers.get("referer") || "";
  const userAgent = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";

  // Rekam klik
  await recordEvent({
    bannerId: banner.id,
    type: "CLICK",
    referrer,
    userAgent,
    ip,
  });

  // Susun URL tujuan (dengan UTM tag otomatis jika belum ada)
  let destination = banner.targetUrl;
  try {
    const destUrl = new URL(destination);
    if (!destUrl.searchParams.has("utm_source")) {
      destUrl.searchParams.set("utm_source", "manageads");
      destUrl.searchParams.set("utm_medium", "banner");
      destUrl.searchParams.set("utm_campaign", banner.id);
      if (referrer) {
        try {
          const refHost = new URL(referrer).hostname;
          destUrl.searchParams.set("utm_content", refHost);
        } catch {
          destUrl.searchParams.set("utm_content", "external");
        }
      }
    }
    destination = destUrl.toString();
  } catch {
    // Jika format URL bukan absolute, gunakan as-is
  }

  return NextResponse.redirect(destination, {
    status: 302,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
