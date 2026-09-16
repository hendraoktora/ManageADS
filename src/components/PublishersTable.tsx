"use client";

import { Publisher } from "@/lib/db";
import { Globe, ExternalLink, Calendar, Eye, MousePointerClick, ShieldCheck, Trash2 } from "lucide-react";

interface PublishersTableProps {
  publishers: Publisher[];
  onDeleted?: () => void;
}

export default function PublishersTable({ publishers, onDeleted }: PublishersTableProps) {
  return (
    <div className="rounded-3xl bg-white p-7 shadow-bento border border-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8DB81B]/15 flex items-center justify-center text-[#5A7E0D]">
              <Globe size={16} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Website Mitra yang Memasang Widget</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Terdeteksi otomatis via HTTP Referer saat script widget dimuat di website mereka.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 text-xs font-semibold text-gray-700 border border-gray-100">
          <span className="w-2 h-2 rounded-full bg-[#8DB81B]"></span>
          <span>{publishers.filter((p) => p.status === "ACTIVE").length} Aktif / {publishers.length} Total Domain</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Domain Website</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Pertama Kali Pasang</th>
              <th className="pb-3">Aktivitas Terakhir</th>
              <th className="pb-3 text-right">Total Views</th>
              <th className="pb-3 text-right">Total Clicks</th>
              <th className="pb-3 text-right pr-2">CTR</th>
              <th className="pb-3 text-center pr-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {publishers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">
                  Belum ada website mitra yang memasang widget iklan Anda.
                </td>
              </tr>
            ) : (
              publishers.map((pub) => {
                const ctr = pub.totalViews > 0 ? ((pub.totalClicks / pub.totalViews) * 100).toFixed(1) : "0.0";
                const firstDate = new Date(pub.firstSeenAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const lastDate = new Date(pub.lastActiveAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={pub.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 pl-2 font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-[10px] font-mono">
                        {pub.domain.substring(0, 2).toUpperCase()}
                      </div>
                      <a
                        href={`https://${pub.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[#5A7E0D] hover:underline flex items-center gap-1"
                      >
                        {pub.domain}
                        <ExternalLink size={11} className="text-gray-400" />
                      </a>
                    </td>

                    <td className="py-3.5">
                      {pub.status === "ACTIVE" ? (
                        <span 
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D5F639]/50 text-gray-900 border border-[#8DB81B]/30"
                          title="Aktif (Terdeteksi ada tayangan/klik dalam 48 jam terakhir)"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8DB81B] animate-pulse"></span>
                          Aktif
                        </span>
                      ) : (
                        <span 
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200"
                          title="Tidak ada impresi dalam 48 jam terakhir (otomatis aktif kembali jika ada view/klik baru)"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Non-Aktif (&gt;48 jam)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-gray-600 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} className="text-gray-400" />
                        {firstDate}
                      </span>
                    </td>

                    <td className="py-3.5 text-gray-500">
                      {lastDate}
                    </td>

                    <td className="py-3.5 text-right font-bold text-gray-900">
                      {pub.totalViews.toLocaleString("id-ID")}
                    </td>

                    <td className="py-3.5 text-right font-bold text-blue-600">
                      {pub.totalClicks.toLocaleString("id-ID")}
                    </td>

                    <td className="py-3.5 text-right pr-2 font-bold text-[#5A7E0D]">
                      {ctr}%
                    </td>

                    <td className="py-3.5 text-center pr-2">
                      <button
                        onClick={async () => {
                          if (!confirm(`Apakah Anda yakin ingin menghapus domain ${pub.domain} dari daftar mitra?`)) return;
                          try {
                            const res = await fetch(`/api/publishers/${pub.id}`, { method: "DELETE" });
                            if (res.ok) {
                              if (onDeleted) onDeleted();
                              else window.location.reload();
                            } else {
                              alert("Gagal menghapus domain mitra");
                            }
                          } catch (e) {
                            alert("Terjadi kesalahan saat menghapus");
                          }
                        }}
                        title="Hapus domain dari daftar mitra"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
