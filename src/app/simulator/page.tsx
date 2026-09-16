"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Banner } from "@/lib/db";
import { ExternalLink, RefreshCw, Eye, MousePointerClick, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function SimulatorPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedBannerId, setSelectedBannerId] = useState<string>("");
  const [key, setKey] = useState(0); // for remounting simulator
  const [recentEvent, setRecentEvent] = useState<string>("");

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setBanners(data.data);
          setSelectedBannerId(data.data[0].id);
        }
      });
  }, []);

  const activeBanner = banners.find((b) => b.id === selectedBannerId);

  const handleSimulateView = async () => {
    if (!selectedBannerId) return;
    try {
      await fetch(`/api/b/${selectedBannerId}`, {
        headers: {
          Referer: "https://simulasi-portalberita.com/artikel-gadget-terbaru",
        },
      });
      setRecentEvent("View terkirim dari https://simulasi-portalberita.com");
      setTimeout(() => setRecentEvent(""), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="space-y-7 pb-12">
      <Header />

      {/* Intro card */}
      <div className="rounded-3xl bg-white p-7 shadow-bento border border-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D5F639]/40 text-[#4E7008] text-xs font-bold mb-2">
              <Sparkles size={12} />
              <span>Simulator Live External Web</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Uji Coba Widget di Website Pihak Ketiga
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xl">
              Simulasi halaman web mitra (misal: <code>portalberita.com</code>) yang memasang script widget iklan Anda. Klik banner untuk menguji tracking dan pengalihan ke web Anda!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedBannerId}
              onChange={(e) => {
                setSelectedBannerId(e.target.value);
                setKey((k) => k + 1);
              }}
              className="px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none"
            >
              {banners.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.size})
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setKey((k) => k + 1);
                handleSimulateView();
              }}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Muat Ulang Widget</span>
            </button>
          </div>
        </div>

        {recentEvent && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200 animate-fadeIn">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>{recentEvent}</span>
          </div>
        )}
      </div>

      {/* Mock 3rd Party Website Browser Window */}
      <div className="rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        {/* Browser Top Navigation Bar */}
        <div className="bg-gray-100 px-5 py-3 border-b border-gray-200 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
          </div>

          <div className="flex-1 max-w-lg mx-auto bg-white rounded-full px-4 py-1.5 text-xs text-gray-600 border border-gray-200 flex items-center justify-between">
            <span className="font-mono text-[11px] text-gray-500">
              https://portalberita-terkini.com/tren-digital-marketing-2026
            </span>
            <ShieldCheck size={13} className="text-emerald-500" />
          </div>
        </div>

        {/* Mock Article Content */}
        <div className="p-8 md:p-12 max-w-4xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-3">
            Teknologi &amp; Bisnis
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
            Mengapa Banner Backlink Masih Menjadi Strategi Pertumbuhan Trafik Paling Efektif
          </h1>

          <div className="flex items-center gap-3 text-xs text-gray-400 pb-6 border-b border-gray-100 mb-6">
            <span>Ditulis oleh Redaksi Portal Berita</span>
            <span>•</span>
            <span>16 September 2026</span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Dalam lanskap digital saat ini, membangun jaringan backlink dofollow yang terintegrasi langsung dengan visual promosi dinamis terbukti memberikan rasio klik 400% lebih tinggi dibanding tautan teks biasa. Pemilik website dapat memperbarui pesan penawaran mereka kapan saja tanpa perlu merepotkan mitra penerbit iklan...
          </p>

          {/* THE ACTUAL EMBEDDED BANNER WIDGET CONTAINER */}
          <div className="my-8 p-6 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>Slot Iklan Terpasang (ManageADS Dynamic Widget)</span>
              <span className="w-2 h-2 rounded-full bg-[#8DB81B] animate-pulse"></span>
            </div>

            {activeBanner && (
              <div key={key} className="text-center">
                <a
                  href={activeBanner.targetUrl}
                  target="_blank"
                  rel={activeBanner.backlinkRel}
                  title={activeBanner.altText}
                  onClick={() => {
                    fetch(`/api/c/${activeBanner.id}?beacon=1&ref=https://portalberita-terkini.com`, { mode: "no-cors" });
                    setRecentEvent("Klik terdeteksi & terkirim ke server via background beacon!");
                    setTimeout(() => setRecentEvent(""), 4000);
                  }}
                  className="inline-block transition-transform hover:scale-[1.01] active:scale-95 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeBanner.imageUrl}
                    alt={activeBanner.altText}
                    className="rounded-2xl shadow-lg border border-white max-w-full h-auto object-contain"
                    style={{
                      maxHeight: activeBanner.size === "728x90" ? "90px" : "250px",
                    }}
                  />
                </a>

                <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 mt-3 font-medium">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 size={12} />
                    Backlink rel=&quot;{activeBanner.backlinkRel}&quot;
                  </span>
                  <span>•</span>
                  <span>Klik banner di atas untuk menguji pelacakan redirect</span>
                </div>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mt-6">
            Ketika visual banner diperbarui di server pusat, script widget secara otomatis mengunduh visual versi terbaru di sesi pengunjung berikutnya. Hal ini menghemat ribuan jam koordinasi manual antara pengiklan dan pemilik situs web.
          </p>
        </div>
      </div>
    </main>
  );
}
