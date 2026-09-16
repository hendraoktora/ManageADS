"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import EmbedModal from "@/components/EmbedModal";
import CreateBannerModal from "@/components/CreateBannerModal";
import { Banner } from "@/lib/db";
import { Plus, Code2, Edit3, Trash2, ExternalLink, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedEmbedBanner, setSelectedEmbedBanner] = useState<Banner | null>(null);
  const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (data.success) setBanners(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;
    try {
      await fetch(`/api/banners/${id}`, { method: "DELETE" });
      fetchBanners();
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
      fetchBanners();
    } catch (err) {
      alert("Gagal memperbarui status");
    }
  };

  return (
    <main className="space-y-7 pb-12">
      <Header onOpenCreate={() => setShowCreateModal(true)} />

      <div className="rounded-3xl bg-white p-7 shadow-bento border border-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#8DB81B]/15 flex items-center justify-center text-[#5A7E0D]">
                <ImageIcon size={16} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Manajemen Banner Iklan</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Daftar seluruh slot banner iklan dinamis. Anda bisa mengganti visual gambar kapan saja.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#111827] hover:bg-black text-[#D5F639] text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition-transform active:scale-95 shadow-sm self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Buat Banner Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-3xl border border-gray-100 p-5 bg-gray-50/40 hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{banner.name}</h3>
                  <button
                    onClick={() => handleToggleStatus(banner)}
                    title={banner.isActive ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                      banner.isActive
                        ? "bg-[#D5F639]/50 text-gray-900 border-[#8DB81B]/40"
                        : "bg-gray-200 text-gray-500 border-gray-300"
                    }`}
                  >
                    {banner.isActive ? "Aktif" : "Non-Aktif"}
                  </button>
                </div>

                {/* Banner Visual Preview */}
                <div className="h-32 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.imageUrl}
                    alt={banner.altText}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Ukuran:</span>
                    <span className="font-semibold text-gray-800">{banner.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Backlink SEO:</span>
                    <span className="font-semibold text-[#5A7E0D]">rel=&quot;{banner.backlinkRel}&quot;</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Performa:</span>
                    <span className="font-bold text-gray-900">
                      {banner.clicks.toLocaleString("id-ID")} Klik / {banner.views.toLocaleString("id-ID")} View
                    </span>
                  </div>
                  <div className="truncate text-gray-400 text-[11px] pt-1">
                    <span className="text-gray-500 font-medium">Target:</span> {banner.targetUrl}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200/60">
                <button
                  onClick={() => setSelectedEmbedBanner(banner)}
                  className="flex-1 py-2 px-3 rounded-full bg-[#111827] hover:bg-black text-[#D5F639] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Code2 size={13} />
                  <span>Kode Embed</span>
                </button>
                <button
                  onClick={() => setBannerToEdit(banner)}
                  className="p-2 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors"
                  title="Ganti Visual & Edit"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 rounded-full bg-white hover:bg-rose-50 border border-gray-200 text-rose-500 hover:text-rose-700 transition-colors"
                  title="Hapus Banner"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
            fetchBanners();
          }}
        />
      )}
    </main>
  );
}
