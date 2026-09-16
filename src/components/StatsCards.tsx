"use client";

import { Eye, MousePointerClick, Link as LinkIcon, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { useState } from "react";

interface StatsCardsProps {
  totalViews: number;
  totalClicks: number;
  ctr: string;
}

export default function StatsCards({ totalViews, totalClicks, ctr }: StatsCardsProps) {
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    {
      title: "Optimasi Link Juicing & SEO Authority",
      badge: "Dofollow Active",
      text: "Banner iklan di web mitra otomatis menyertakan tag rel='dofollow' dan anchor deskriptif untuk meningkatkan ranking Google Anda.",
    },
    {
      title: "Pembaruan Visual Instan Tanpa Delay",
      badge: "Auto Sync",
      text: "Setiap perubahan gambar banner di dashboard ini langsung aktif di seluruh website tanpa perlu pemilik web mengganti script.",
    },
    {
      title: "Anti-Spam & Impression Filtering",
      badge: "Bot Filter",
      text: "Sistem otomatis memfilter request dari crawler mencurigakan agar data views dan klik Anda tetap akurat dan bersih.",
    },
  ];

  // Baris bar vertikal hijau menyerupai "Calories" di gambar referensi
  const barCount = 28;
  const activeBars = Math.min(barCount, Math.round((totalViews / 25000) * barCount));

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* 1. Card Kiri: Tips / Backlink Authority (mirip card Sleep di referensi) */}
      <div className="md:col-span-4 rounded-3xl bg-white p-7 shadow-bento border border-white flex flex-col justify-between min-h-[290px]">
        <div>
          {/* 3 Circle avatars */}
          <div className="flex items-center -space-x-2 mb-4">
            <div className="w-9 h-9 rounded-full ring-2 ring-white overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80"
                alt="Avatar 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-9 h-9 rounded-full ring-2 ring-white overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80"
                alt="Avatar 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-9 h-9 rounded-full ring-2 ring-white overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80"
                alt="Avatar 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 leading-snug">
            {tips[tipIndex].title}
          </h3>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111827] text-white text-xs font-medium">
              <LinkIcon size={12} className="text-[#D5F639]" />
              {tips[tipIndex].badge}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            {tips[tipIndex].text}
          </p>
        </div>

        {/* Bottom index & nav buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs font-bold text-gray-900">
            {tipIndex + 1}
            <span className="text-gray-400 font-normal"> / {tips.length}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTipIndex((prev) => (prev > 0 ? prev - 1 : tips.length - 1))}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setTipIndex((prev) => (prev < tips.length - 1 ? prev + 1 : 0))}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Card Tengah: Total Views dengan Baris Bar Hijau Vertikal (mirip Calories di referensi) */}
      <div className="md:col-span-4 rounded-3xl bg-white p-7 shadow-bento border border-white flex flex-col justify-between min-h-[290px]">
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Eye size={15} />
              </div>
              <span className="text-sm font-bold text-gray-900">Trafik Views</span>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-gray-900">25.000</div>
              <div className="text-[10px] text-gray-400">Target Bulanan</div>
            </div>
          </div>

          {/* Big number */}
          <div className="mt-4">
            <div className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              {totalViews.toLocaleString("id-ID")}
              <span className="text-xs font-semibold text-gray-400 ml-1">/Views</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Impresi organik dari website mitra terdaftar
            </div>
          </div>

          {/* Segmented vertical bars (exact replicate of the green bar row) */}
          <div className="mt-5">
            <div className="flex items-center gap-1 justify-between h-10 px-1">
              {Array.from({ length: barCount }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    idx < activeBars
                      ? "bg-[#8DB81B] h-9 shadow-xs"
                      : "bg-gray-100 h-6"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown statistik perangkat di bagian bawah */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center">
          <div>
            <div className="text-xs font-bold text-gray-900">62%</div>
            <div className="text-[10px] text-gray-400">Desktop</div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">33%</div>
            <div className="text-[10px] text-gray-400">Mobile</div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">5%</div>
            <div className="text-[10px] text-gray-400">Tablet</div>
          </div>
        </div>
      </div>

      {/* 3. Card Kanan: Total Clicks & Double Wave Curves (mirip Weight di referensi) */}
      <div className="md:col-span-4 rounded-3xl bg-white p-7 shadow-bento border border-white flex flex-col justify-between min-h-[290px]">
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <MousePointerClick size={15} />
              </div>
              <span className="text-sm font-bold text-gray-900">Klik &amp; Konversi</span>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp size={12} />
                <span>{ctr}% CTR</span>
              </div>
              <div className="text-[10px] text-gray-400">Rasio Klik / View</div>
            </div>
          </div>

          {/* Double wavy curve SVG (exact replicate of the wavy graph) */}
          <div className="my-3 py-1 flex items-center justify-center">
            <svg viewBox="0 0 280 60" className="w-full h-14 overflow-visible">
              <defs>
                <linearGradient id="wave1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#88CDF6" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#88CDF6" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="wave2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D5F639" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8DB81B" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {/* Curve 1 (Sky Blue) */}
              <path
                d="M 5 35 Q 40 5, 80 32 T 160 25 T 230 40 T 275 20"
                fill="none"
                stroke="url(#wave1)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Curve 2 (Lime) */}
              <path
                d="M 5 45 Q 50 20, 100 45 T 180 35 T 240 18 T 275 35"
                fill="none"
                stroke="url(#wave2)"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Marker dot */}
              <circle cx="80" cy="32" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Big number */}
          <div className="mt-2">
            <div className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              {totalClicks.toLocaleString("id-ID")}
              <span className="text-xs font-semibold text-gray-400 ml-1">Klik Terarah</span>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-[11px] text-gray-400">Target tercapai 100%</div>
          <div className="text-xs font-bold text-gray-900">Keep it up! 🚀</div>
        </div>
      </div>
    </div>
  );
}
