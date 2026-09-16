"use client";

import { ArrowRight, Play, Globe, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface HeroBentoProps {
  onOpenCreate: () => void;
  activePublishersCount: number;
}

export default function HeroBento({ onOpenCreate, activePublishersCount }: HeroBentoProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#CADFE5] via-[#DBEBF0] to-[#E5F1F5] p-7 md:p-9 shadow-bento border border-white/80 flex flex-col justify-between min-h-[300px]">
      {/* Background Graphic Accent */}
      <div className="absolute -right-8 -bottom-10 w-72 h-72 rounded-full bg-white/30 blur-2xl pointer-events-none" />
      <div className="absolute right-6 bottom-4 w-60 h-44 opacity-20 pointer-events-none">
        <div className="w-full h-full border-4 border-dashed border-gray-600/30 rounded-2xl flex items-center justify-center font-mono text-xs">
          728x90 Live Banner Slot
        </div>
      </div>

      {/* Top Title */}
      <div className="relative z-10 max-w-lg">

        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Pasang Iklan di Web Mitra, <br />
          <span className="text-[#557F0C]">Update Visual Seketika.</span>
        </h2>
        <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">
          Ubah visual gambar atau link target dari dashboard ini, seluruh website yang memasang widget Anda akan otomatis berubah tanpa perlu mereka edit kode.
        </p>
      </div>

      {/* Bottom Info & CTA */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Publisher Avatars Pill */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              PB
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              BB
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              FK
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
              <span>{activePublishersCount}+ Web Mitra Aktif</span>
              <CheckCircle2 size={12} className="text-[#8DB81B]" />
            </div>
            <div className="text-[11px] text-gray-500">Menerima trafik &amp; dofollow backlink</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/banners"
            className="px-4 py-2.5 rounded-full bg-white/80 hover:bg-white text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Lihat Semua Banner</span>
          </Link>

          <button
            onClick={onOpenCreate}
            className="bg-[#111827] hover:bg-black text-white px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold flex items-center gap-2 transition-all hover:gap-3 shadow-md"
          >
            <span>Buat Banner Baru</span>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
              <ArrowRight size={13} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
