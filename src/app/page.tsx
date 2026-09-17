"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import HeroBento from "@/components/HeroBento";
import StatusBento from "@/components/StatusBento";
import StatsCards from "@/components/StatsCards";
import PublishersTable from "@/components/PublishersTable";
import EmbedModal from "@/components/EmbedModal";
import CreateBannerModal from "@/components/CreateBannerModal";
import { Banner, Publisher } from "@/lib/db";
import { Code2, Edit3, ExternalLink, Sparkles, Plus, Image as ImageIcon, Trash2, Video } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalClicks: 0,
    ctr: "0.00",
    activePublishers: 0,
    totalPublishers: 0,
  });

  const [selectedEmbedBanner, setSelectedEmbedBanner] = useState<Banner | null>(null);
  const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = async () => {
    try {
      const [bannersRes, publishersRes, statsRes] = await Promise.all([
        fetch("/api/banners").then((r) => r.json()),
        fetch("/api/publishers").then((r) => r.json()),
        fetch("/api/stats").then((r) => r.json()),
      ]);

      if (bannersRes.success) setBanners(bannersRes.data);
      if (publishersRes.success) setPublishers(publishersRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;
    try {
      await fetch(`/api/banners/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      alert("Gagal menghapus banner");
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      await fetch(`/api/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      fetchData();
    } catch (err) {
      alert("Gagal memperbarui status");
    }
  };

  return (
    <main className="space-y-7 pb-12">
      {/* Top Header */}
      <Header onOpenCreate={() => setShowCreateModal(true)} />

      {/* Row 1: Top Hero Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <HeroBento
            onOpenCreate={() => setShowCreateModal(true)}
            activePublishersCount={stats.activePublishers}
          />
        </div>
        <div className="lg:col-span-4">
          <StatusBento totalViews={stats.totalViews} />
        </div>
      </div>

      {/* Row 2: Stats Cards (Sleep, Calories Bar, Weight Wave Curve) */}
      <StatsCards
        totalViews={stats.totalViews}
        totalClicks={stats.totalClicks}
        ctr={stats.ctr}
      />

      {/* Row 3: Active Banners Showcase */}
      <div className="rounded-3xl bg-white p-7 shadow-bento border border-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <ImageIcon size={16} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Banner Iklan yang Sedang Berjalan</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ganti gambar visual di sini kapan saja, iklan di seluruh website mitra akan otomatis terupdate!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/banners"
              className="text-xs font-bold text-gray-700 hover:text-black px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Lihat Semua Banner ({banners.length})
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#111827] hover:bg-black text-[#D5F639] text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
            >
              <Plus size={14} />
              <span>Tambah Banner</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-10 text-center bg-gray-50/60 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
                <ImageIcon size={20} />
              </div>
              <p className="text-xs font-semibold text-gray-500">Belum ada banner iklan yang dibuat.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-3 px-4 py-2 rounded-full bg-[#111827] text-[#D5F639] text-xs font-bold shadow-xs hover:bg-black transition-all"
              >
                + Buat Banner Pertama Anda
              </button>
            </div>
          ) : (
            banners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-2xl border border-gray-100 p-5 hover:border-gray-300 transition-all bg-gray-50/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-gray-800 line-clamp-1">{banner.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {(banner.mediaType === "video" || /\.(mp4|webm|ogg)(\?.*)?$/i.test(banner.imageUrl)) && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 flex items-center gap-1">
                        <Video size={10} /> Video
                      </span>
                    )}
                    <button
                      onClick={() => handleToggleStatus(banner)}
                      title={banner.isActive ? "Klik untuk Nonaktifkan" : "Klik untuk Aktifkan"}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                        banner.isActive
                          ? "bg-[#D5F639]/50 text-gray-900 border-[#8DB81B]/40"
                          : "bg-gray-200 text-gray-500 border-gray-300"
                      }`}
                    >
                      {banner.isActive ? "Aktif" : "Non-Aktif"}
                    </button>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-gray-600 border border-gray-200">
                      {banner.size}
                    </span>
                  </div>
                </div>

                {/* Banner Media Preview (Image / Video) */}
                <div className="h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center mb-3">
                  {banner.mediaType === "video" || /\.(mp4|webm|ogg)(\?.*)?$/i.test(banner.imageUrl) ? (
                    <video
                      src={banner.imageUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="max-h-full max-w-full object-cover w-full h-full bg-black"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={banner.imageUrl}
                      alt={banner.altText}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="truncate max-w-[180px] flex items-center gap-1">
                    <ExternalLink size={11} />
                    {banner.targetUrl}
                  </span>
                  <span className="font-bold text-gray-800">
                    {banner.clicks.toLocaleString("id-ID")} Klik / {banner.views.toLocaleString("id-ID")} View
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200/60">
                <button
                  onClick={() => setSelectedEmbedBanner(banner)}
                  className="flex-1 py-2 px-3 rounded-full bg-[#111827] hover:bg-black text-[#D5F639] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Code2 size={13} />
                  <span>Ambil Kode Embed</span>
                </button>
                <button
                  onClick={() => setBannerToEdit(banner)}
                  className="py-2 px-3 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1 transition-all"
                  title="Ganti Visual & Link"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 rounded-full bg-white hover:bg-rose-50 border border-gray-200 text-rose-500 hover:text-rose-700 transition-colors"
                  title="Hapus Banner Ini"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* Row 4: Website Mitra yang Memasang Widget */}
      <PublishersTable publishers={publishers} onDeleted={fetchData} />

      {/* Modals */}
      {selectedEmbedBanner && (
        <EmbedModal
          banner={selectedEmbedBanner}
          onClose={() => setSelectedEmbedBanner(null)}
        />
      )}

      {(showCreateModal || bannerToEdit) && (
        <CreateBannerModal
          bannerToEdit={bannerToEdit}
          onClose={() => {
            setShowCreateModal(false);
            setBannerToEdit(null);
          }}
          onSuccess={() => {
            fetchData();
          }}
        />
      )}
    </main>
  );
}
