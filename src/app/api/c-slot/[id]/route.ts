import { NextResponse } from "next/server";
import { getCarouselById, getBanners, recordEvent } from "@/lib/db";

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
  const carousel = await getCarouselById(params.id);

  if (!carousel || !carousel.isActive) {
    return NextResponse.json(
      { success: false, message: "Slot carousel tidak aktif atau tidak ditemukan" },
      { status: 404, headers: corsHeaders }
    );
  }

  const allBanners = await getBanners();
  const bannerMap = new Map(allBanners.map((b) => [b.id, b]));

  // Urutkan slide berdasarkan sequence 'order' ascending
  const sortedSlides = [...carousel.slides].sort((a, b) => a.order - b.order);

  // Ambil data banner lengkap yang masih aktif
  const resolvedSlides = sortedSlides
    .map((slide) => {
      const banner = bannerMap.get(slide.bannerId);
      if (!banner || !banner.isActive) return null;
      return {
        id: banner.id,
        order: slide.order,
        name: banner.name,
        imageUrl: banner.imageUrl,
        targetUrl: banner.targetUrl,
        altText: banner.altText,
        backlinkRel: banner.backlinkRel,
        size: banner.size,
      };
    })
    .filter(Boolean);

  if (resolvedSlides.length === 0) {
    return NextResponse.json(
      { success: false, message: "Tidak ada banner aktif dalam carousel ini" },
      { status: 404, headers: corsHeaders }
    );
  }

  // Rekam impression untuk banner pertama yang langsung dilihat pengunjung saat load
  const url = new URL(req.url);
  const referrer = url.searchParams.get("ref") || req.headers.get("referer") || req.headers.get("origin") || "";
  const userAgent = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";

  if (resolvedSlides[0]) {
    await recordEvent({
      bannerId: (resolvedSlides[0] as any).id,
      type: "VIEW",
      referrer,
      userAgent,
      ip,
    });
  }

  return NextResponse.json(
    {
      success: true,
      carousel: {
        id: carousel.id,
        name: carousel.name,
        size: carousel.size,
        intervalMs: carousel.intervalMs || 5000,
        autoPlay: carousel.autoPlay !== false,
        showDots: carousel.showDots !== false,
        showArrows: carousel.showArrows !== false,
        slides: resolvedSlides,
      },
    },
    { headers: corsHeaders }
  );
}
