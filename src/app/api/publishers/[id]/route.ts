import { NextResponse } from "next/server";
import { deletePublisher } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const success = await deletePublisher(params.id);
  if (!success) {
    return NextResponse.json(
      { success: false, message: "Publisher tidak ditemukan" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, message: "Publisher berhasil dihapus" });
}
