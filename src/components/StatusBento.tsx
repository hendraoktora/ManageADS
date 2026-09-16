"use client";

import { useState } from "react";
import { Zap, ShieldCheck } from "lucide-react";

interface StatusBentoProps {
  totalViews: number;
}

export default function StatusBento({ totalViews }: StatusBentoProps) {
  const [period, setPeriod] = useState<"D" | "W" | "M">("D");

  // Grid capsules matching the visual in reference image
  const capsules = Array.from({ length: 24 });

  const dailyDisplay =
    period === "D"
      ? (totalViews / 14).toFixed(1)
      : period === "W"
      ? (totalViews / 2).toFixed(1)
      : totalViews.toFixed(0);

  return (
    <div className="rounded-3xl bg-[#88CDF6] p-7 shadow-bento text-white flex flex-col justify-between min-h-[300px] relative overflow-hidden">
      {/* Decorative radial highlight */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-white/20 rounded-full blur-xl pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-blue-900/80 tracking-wide uppercase">
            Distribution Status:
          </span>
          <span className="bg-[#D5F639] text-gray-900 font-bold text-xs px-3.5 py-1 rounded-full shadow-sm">
            Well Done 👍
          </span>
        </div>
        <p className="text-xs text-blue-950/70 mt-1 max-w-[200px]">
          Edge API &amp; cache-bypass aktif. Perubahan banner tersinkron 100% instan.
        </p>
      </div>

      {/* Center Grid Capsules Visualization */}
      <div className="my-4 py-2">
        <div className="grid grid-cols-8 gap-1.5 opacity-90">
          {capsules.map((_, i) => (
            <div
              key={i}
              className={`h-7 rounded-lg transition-all ${
                i < 18
                  ? "bg-white/90 shadow-sm"
                  : "bg-white/40 border border-white/30"
              }`}
              title={`Server Node ${i + 1}: Healthy`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Period Selector & Big Stat */}
      <div className="flex items-end justify-between pt-2">
        <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-md p-1 rounded-full">
          {(["D", "W", "M"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                period === p
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="text-right">
          <div className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
            {dailyDisplay}
            <span className="text-xl font-bold">K</span>
          </div>
          <div className="text-xs text-blue-950/70 font-semibold mt-0.5">
            Impresi / {period === "D" ? "Hari" : period === "W" ? "Minggu" : "Bulan"}
          </div>
        </div>
      </div>
    </div>
  );
}
