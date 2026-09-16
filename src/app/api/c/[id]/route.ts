import { NextResponse } from "next/server";
import { getBannerById, recordEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return handleTracking(req, params.id);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  return handleTracking(req, params.id);
}

async function handleTracking(req: Request, bannerId: string) {
  const banner = await getBannerById(bannerId);
  const url = new URL(req.url);

  // Ambil referrer dari header atau query param ?ref=
  const referrer = url.searchParams.get("ref") || req.headers.get("referer") || req.headers.get("origin") || "";
  const userAgent = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";

  // Rekam event klik jika banner ditemukan
  if (banner) {
    await recordEvent({
      bannerId: banner.id,
      type: "CLICK",
      referrer,
      userAgent,
      ip,
    });
  }

  // Jika dipanggil sebagai Beacon background tracker (karena link langsung mengarah ke target)
  const isBeacon = url.searchParams.get("beacon") === "1" || req.method === "POST";
  if (isBeacon) {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Fallback pengalihan langsung jika dibuka manual
  if (!banner) {
    return NextResponse.redirect("https://google.com", { status: 302 });
  }

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
  } catch {}

  return NextResponse.redirect(destination, {
    status: 302,
    headers: corsHeaders,
  });
}
