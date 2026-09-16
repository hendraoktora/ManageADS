import { NextResponse } from "next/server";
import { getBannerById, recordEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const banner = await getBannerById(params.id);

  if (!banner || !banner.isActive) {
    return NextResponse.json(
      { success: false, message: "Banner tidak aktif atau tidak ditemukan" },
      { status: 404, headers: corsHeaders }
    );
  }

  // Rekam impression secara otomatis saat widget meminta data
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

  return NextResponse.json(
    {
      success: true,
      banner: {
        id: banner.id,
        imageUrl: banner.imageUrl,
        targetUrl: banner.targetUrl,
        altText: banner.altText,
        size: banner.size,
        backlinkRel: banner.backlinkRel,
      },
    },
    { headers: corsHeaders }
  );
}
