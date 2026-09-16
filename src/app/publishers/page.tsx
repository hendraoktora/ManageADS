"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PublishersTable from "@/components/PublishersTable";
import { Publisher } from "@/lib/db";
import { Globe, ShieldCheck, Info, Search, CheckCircle2 } from "lucide-react";

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const fetchPublishers = async () => {
    try {
      const res = await fetch("/api/publishers");
      const data = await res.json();
      if (data.success) setPublishers(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const filtered = publishers.filter((pub) => {
    const matchesSearch = pub.domain.toLowerCase().includes(search.toLowerCase());
    if (filter === "ACTIVE") return matchesSearch && pub.status === "ACTIVE";
    if (filter === "INACTIVE") return matchesSearch && pub.status === "INACTIVE";
    return matchesSearch;
  });

  return (
    <main className="space-y-7 pb-12">
      <Header />

      {/* Info Card: Cara Kerja Deteksi Otomatis */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50/60 p-6 shadow-sm border border-blue-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <Info size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Bagaimana Website Mitra Terdeteksi Otomatis?
          </h3>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Setiap kali pengunjung membuka website pihak ketiga yang telah memasang kode widget Anda, browser otomatis mengirimkan header <code>Referer</code>. Server ManageADS langsung meregistrasi domain baru tersebut beserta stempel waktu pertama kali pasang (<code>first_seen_at</code>) secara transparan.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === f
                  ? "bg-[#111827] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              {f === "ALL" ? "Semua Domain" : f === "ACTIVE" ? "Aktif" : "Non-Aktif"}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Cari domain website..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 pl-9 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:border-gray-900 focus:outline-none text-xs text-gray-800 shadow-xs"
          />
        </div>
      </div>

      {/* Main Table */}
      <PublishersTable publishers={filtered} />
    </main>
  );
}
