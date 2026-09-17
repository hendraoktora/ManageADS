import { NextResponse } from "next/server";
import { getCarouselById, updateCarousel, deleteCarousel } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const carousel = await getCarouselById(params.id);
  if (!carousel) {
    return NextResponse.json({ success: false, message: "Carousel tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: carousel });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, size, intervalMs, autoPlay, showDots, showArrows, isActive, slides } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (size !== undefined) updateData.size = size;
    if (intervalMs !== undefined) updateData.intervalMs = Number(intervalMs);
    if (autoPlay !== undefined) updateData.autoPlay = Boolean(autoPlay);
    if (showDots !== undefined) updateData.showDots = Boolean(showDots);
    if (showArrows !== undefined) updateData.showArrows = Boolean(showArrows);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (slides !== undefined) {
      if (!Array.isArray(slides) || slides.length === 0) {
        return NextResponse.json(
          { success: false, message: "Minimal 1 banner harus dipilih" },
          { status: 400 }
        );
      }
      if (slides.length > 6) {
        return NextResponse.json(
          { success: false, message: "Maksimal 6 banner dalam 1 carousel" },
          { status: 400 }
        );
      }
      updateData.slides = slides.map((s: any, idx: number) => ({
        bannerId: s.bannerId,
        order: typeof s.order === "number" ? s.order : idx + 1,
      }));
    }

    const updated = await updateCarousel(params.id, updateData);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Carousel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Gagal memperbarui carousel" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const success = await deleteCarousel(params.id);
  if (!success) {
    return NextResponse.json({ success: false, message: "Carousel tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Carousel berhasil dihapus" });
}
