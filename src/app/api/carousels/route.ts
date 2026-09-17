import { NextResponse } from "next/server";
import { getCarousels, createCarousel, CarouselSlot } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const carousels = await getCarousels();
  return NextResponse.json({ success: true, data: carousels });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, size, intervalMs, autoPlay, showDots, showArrows, isActive, slides } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: "Nama carousel wajib diisi" }, { status: 400 });
    }

    if (!Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json(
        { success: false, message: "Pilih minimal 1 banner untuk dimasukkan ke dalam carousel" },
        { status: 400 }
      );
    }

    if (slides.length > 6) {
      return NextResponse.json(
        { success: false, message: "Maksimal 6 banner yang dapat dimasukkan ke dalam 1 carousel" },
        { status: 400 }
      );
    }

    // Pastikan urutan (sequence) tersusun rapi
    const formattedSlides = slides.map((s: any, idx: number) => ({
      bannerId: s.bannerId,
      order: typeof s.order === "number" ? s.order : idx + 1,
    }));

    const newCarousel = await createCarousel({
      name: name.trim(),
      size: size || "728x90",
      intervalMs: intervalMs ? Number(intervalMs) : 5000,
      autoPlay: autoPlay !== false,
      showDots: showDots !== false,
      showArrows: showArrows !== false,
      isActive: isActive !== false,
      slides: formattedSlides,
    });

    return NextResponse.json({ success: true, data: newCarousel }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Gagal membuat carousel" },
      { status: 500 }
    );
  }
}
