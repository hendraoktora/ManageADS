"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Publisher } from "@/lib/db";
import { Activity, TrendingUp, Eye, MousePointerClick, Smartphone, Monitor, Tablet, Globe } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.data);
      });

    fetch("/api/publishers")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPublishers(d.data);
      });
  }, []);

  return (
    <main className="space-y-7 pb-12">
      <Header />

      {/* Top 3 Metric Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-white p-6 shadow-bento border border-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Views (Impresi)</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Eye size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mt-3">
            {stats ? stats.totalViews.toLocaleString("id-ID") : "..."}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp size={12} />
            <span>+14.2% dari minggu lalu</span>
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-bento border border-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Clicks (Klik)</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <MousePointerClick size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mt-3">
            {stats ? stats.totalClicks.toLocaleString("id-ID") : "..."}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp size={12} />
            <span>+8.7% konversi klik</span>
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-bento border border-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rata-Rata CTR</span>
            <div className="w-8 h-8 rounded-full bg-[#D5F639]/40 text-[#4E7008] flex items-center justify-center">
              <Activity size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mt-3">
            {stats ? stats.ctr : "..."}%
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Standar industri periklanan banner ~1.5 - 3%
          </p>
        </div>
      </div>

      {/* Chart: Tren Impresi vs Klik Harian */}
      <div className="rounded-3xl bg-white p-7 shadow-bento border border-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Grafik Trafik Views &amp; Clicks Harian</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Pemantauan performa lalu lintas dari seluruh website mitra yang aktif.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          {stats?.chartData && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#e2e8f0" />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderRadius: "16px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                <Bar dataKey="views" name="Views (Impresi)" fill="#88CDF6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="clicks" name="Clicks (Klik)" fill="#8DB81B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Breakdown Domain: Web Mana & Berapa Banyak Trafiknya */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-3xl bg-white p-7 shadow-bento border border-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#8DB81B]/15 flex items-center justify-center text-[#5A7E0D]">
              <Globe size={16} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Trafik Menurut Domain Website Mitra</h3>
          </div>

          <div className="space-y-4">
            {publishers.map((pub) => {
              const maxViews = Math.max(...publishers.map((p) => p.totalViews), 1);
              const percentage = Math.round((pub.totalViews / maxViews) * 100);

              return (
                <div key={pub.id} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <span>{pub.domain}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-gray-200 text-gray-600">
                        {pub.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">
                      <span className="text-gray-900 font-bold">{pub.totalViews.toLocaleString("id-ID")}</span> Views |{" "}
                      <span className="text-blue-600 font-bold">{pub.totalClicks.toLocaleString("id-ID")}</span> Klik
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-gray-200/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#88CDF6] to-[#8DB81B] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="lg:col-span-4 rounded-3xl bg-white p-7 shadow-bento border border-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Distribusi Perangkat</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-700">
                    <Monitor size={16} />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Desktop Web</span>
                </div>
                <span className="text-sm font-black text-gray-900">62%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-700">
                    <Smartphone size={16} />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Mobile Smartphone</span>
                </div>
                <span className="text-sm font-black text-gray-900">33%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-700">
                    <Tablet size={16} />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Tablet iPad</span>
                </div>
                <span className="text-sm font-black text-gray-900">5%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#D5F639]/30 border border-[#8DB81B]/20">
            <div className="text-xs font-bold text-gray-900">💡 Insight Konversi</div>
            <div className="text-[11px] text-gray-600 mt-1">
              Pengunjung dari Desktop menghasilkan rasio konversi klik 1.8x lebih tinggi untuk format 728x90.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
