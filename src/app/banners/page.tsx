"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import EmbedModal from "@/components/EmbedModal";
import CreateBannerModal from "@/components/CreateBannerModal";
import CreateCarouselModal from "@/components/CreateCarouselModal";
import { Banner, CarouselSlot } from "@/lib/db";
import {
  Plus,
  Code2,
  Edit3,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Layers,
  Sparkles,
  Play,
  RotateCw,
} from "lucide-react";

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [carousels, setCarousels] = useState<CarouselSlot[]>([]);
  const [activeTab, setActiveTab] = useState<"banners" | "carousels">("banners");

  const [selectedEmbedBanner, setSelectedEmbedBanner] = useState<Banner | null>(null);
  const [selectedEmbedCarousel, setSelectedEmbedCarousel] = useState<CarouselSlot | null>(null);

  const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);
  const [carouselToEdit, setCarouselToEdit] = useState<CarouselSlot | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateCarouselModal, setShowCreateCarouselModal] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (data.success) setBanners(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCarousels = async () => {
    try {
      const res = await fetch("/api/carousels");
      const data = await res.json();
      if (data.success) setCarousels(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchCarousels();
  }, []);

  const bannerMap = new Map(banners.map((b) => [b.id, b]));

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;
    try {
      await fetch(`/api/banners/${id}`, { method: "DELETE" });
      fetchBanners();
    } catch (err) {
      alert("Gagal menghapus banner");
    }
  };

  const handleToggleBannerStatus = async (banner: Banner) => {
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

  const handleDeleteCarousel = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus slot carousel ini?")) return;
    try {
      await fetch(`/api/carousels/${id}`, { method: "DELETE" });
      fetchCarousels();
    } catch (err) {
      alert("Gagal menghapus carousel");
    }
  };

  const handleToggleCarouselStatus = async (carousel: CarouselSlot) => {
    try {
      await fetch(`/api/carousels/${carousel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !carousel.isActive }),
      });
      fetchCarousels();
    } catch (err) {
      alert("Gagal memperbarui status");
    }
  };

  return (
    <main className="space-y-7 pb-12">
      <Header onOpenCreate={() => (activeTab === "banners" ? setShowCreateModal(true) : setShowCreateCarouselModal(true))} />

      <div className="rounded-3xl bg-white p-7 shadow-bento border border-white">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#8DB81B]/15 flex items-center justify-center text-[#5A7E0D]">
                {activeTab === "banners" ? <ImageIcon size={16} /> : <Layers size={16} />}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === "banners" ? "Manajemen Banner Iklan" : "Manajemen Slot Carousel (Slider)"}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {activeTab === "banners"
                ? "Daftar seluruh slot banner iklan mandiri. Anda bisa mengganti visual gambar kapan saja."
                : "Slot iklan slider multi-banner. 1 script widget memuat banyak iklan yang berganti secara otomatis."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {activeTab === "banners" ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#111827] hover:bg-black text-[#D5F639] text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
              >
                <Plus size={16} />
                <span>Buat Banner Baru</span>
              </button>
            ) : (
              <button
                onClick={() => setShowCreateCarouselModal(true)}
                className="bg-[#111827] hover:bg-black text-[#D5F639] text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
              >
                <Plus size={16} />
                <span>Buat Slot Carousel</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <button
            onClick={() => setActiveTab("banners")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "banners"
                ? "bg-[#111827] text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ImageIcon size={14} />
            <span>Banner Tunggal ({banners.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("carousels")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "carousels"
                ? "bg-[#111827] text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Layers size={14} />
            <span>Slot Carousel / Slider ({carousels.length})</span>
          </button>
        </div>

        {/* TAB 1: Banner Tunggal */}
        {activeTab === "banners" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-400">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                  <ImageIcon size={24} />
                </div>
                <p className="text-sm font-semibold">Belum ada banner iklan.</p>
                <p className="text-xs mt-1">Klik tombol &quot;Buat Banner Baru&quot; untuk menambahkan banner pertama Anda.</p>
              </div>
            ) : (
              banners.map((banner) => (
                <div
                  key={banner.id}
                  className="rounded-2xl border border-gray-200/80 bg-gray-50/50 p-4 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
                >
                  <div>
                    {/* Header Card: Nama & Toggle Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-sm text-gray-900 truncate" title={banner.name}>
                          {banner.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                            {banner.size}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            rel=&quot;{banner.backlinkRel}&quot;
                          </span>
                        </div>
                      </div>

                      {/* Tombol Saklar Status Aktif/Nonaktif */}
                      <button
                        onClick={() => handleToggleBannerStatus(banner)}
                        title={banner.isActive ? "Klik untuk Nonaktifkan" : "Klik untuk Aktifkan"}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          banner.isActive
                            ? "bg-[#D5F639]/50 text-gray-900 border border-[#8DB81B]/40 hover:bg-rose-100 hover:text-rose-700"
                            : "bg-gray-200 text-gray-500 hover:bg-emerald-100 hover:text-emerald-700"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${banner.isActive ? "bg-[#8DB81B] animate-pulse" : "bg-gray-400"}`}></span>
                        <span>{banner.isActive ? "Aktif" : "Non-Aktif"}</span>
                      </button>
                    </div>

                    {/* Preview Gambar */}
                    <div className="w-full h-36 bg-gray-200/60 rounded-xl overflow-hidden mb-3 border border-gray-200 flex items-center justify-center relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={banner.imageUrl}
                        alt={banner.altText}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as any).src = "https://placehold.co/600x400/e2e8f0/64748b?text=Gambar+Rusak";
                        }}
                      />
                    </div>

                    {/* Info Target URL */}
                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Target Link:</div>
                      <a
                        href={banner.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 truncate mt-0.5"
                      >
                        <span className="truncate">{banner.targetUrl}</span>
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                      <div className="p-2 rounded-xl bg-white border border-gray-100">
                        <div className="text-[10px] font-medium text-gray-400">Views</div>
                        <div className="text-xs font-bold text-gray-900">{banner.views.toLocaleString("id-ID")}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-gray-100">
                        <div className="text-[10px] font-medium text-gray-400">Clicks</div>
                        <div className="text-xs font-bold text-blue-600">{banner.clicks.toLocaleString("id-ID")}</div>
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
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-2 rounded-full bg-white hover:bg-rose-50 border border-gray-200 text-rose-500 hover:text-rose-700 transition-colors"
                      title="Hapus Banner"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Slot Carousel / Slider */}
        {activeTab === "carousels" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carousels.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-400">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                  <Layers size={24} />
                </div>
                <p className="text-sm font-semibold">Belum ada slot carousel.</p>
                <p className="text-xs mt-1">Buat slot carousel untuk menggabungkan banyak banner dalam 1 widget rotasi otomatis.</p>
                <button
                  onClick={() => setShowCreateCarouselModal(true)}
                  className="mt-4 px-5 py-2 rounded-full bg-[#111827] hover:bg-black text-[#D5F639] text-xs font-bold inline-flex items-center gap-2 shadow-sm"
                >
                  <Plus size={14} />
                  <span>Buat Slot Carousel Pertama</span>
                </button>
              </div>
            ) : (
              carousels.map((carousel) => {
                const sortedSlides = [...carousel.slides].sort((a, b) => a.order - b.order);
                return (
                  <div
                    key={carousel.id}
                    className="rounded-2xl border border-gray-200/80 bg-gray-50/50 p-4 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
                  >
                    <div>
                      {/* Header Carousel Card */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-sm text-gray-900 truncate" title={carousel.name}>
                            {carousel.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                              {carousel.size}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8DB81B]/20 text-[#4E7008]">
                              {carousel.slides.length} Banner
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                              {Math.round(carousel.intervalMs / 1000)}s Slider
                            </span>
                          </div>
                        </div>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleCarouselStatus(carousel)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            carousel.isActive
                              ? "bg-[#D5F639]/50 text-gray-900 border border-[#8DB81B]/40 hover:bg-rose-100 hover:text-rose-700"
                              : "bg-gray-200 text-gray-500 hover:bg-emerald-100 hover:text-emerald-700"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${carousel.isActive ? "bg-[#8DB81B] animate-pulse" : "bg-gray-400"}`}></span>
                          <span>{carousel.isActive ? "Aktif" : "Non-Aktif"}</span>
                        </button>
                      </div>

                      {/* Sequence / Urutan Preview Slides */}
                      <div className="mb-4">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Urutan Slide ({carousel.slides.length} Banner):
                        </div>
                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {sortedSlides.map((slide) => {
                            const b = bannerMap.get(slide.bannerId);
                            return (
                              <div
                                key={slide.bannerId}
                                className="p-2 rounded-xl bg-white border border-gray-100 flex items-center gap-2.5 shadow-xs"
                              >
                                <span className="w-5 h-5 rounded-md bg-[#8DB81B] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {slide.order}
                                </span>
                                {b ? (
                                  <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={b.imageUrl}
                                      alt={b.name}
                                      className="w-9 h-6 rounded object-cover bg-gray-100 border border-gray-100 shrink-0"
                                    />
                                    <div className="truncate">
                                      <div className="text-xs font-semibold text-gray-800 truncate">{b.name}</div>
                                      <div className="text-[9px] text-gray-400 truncate">{b.targetUrl}</div>
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-400">ID: {slide.bannerId}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200/60">
                      <button
                        onClick={() => setSelectedEmbedCarousel(carousel)}
                        className="flex-1 py-2 px-3 rounded-full bg-[#111827] hover:bg-black text-[#D5F639] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <Code2 size={13} />
                        <span>Kode Embed</span>
                      </button>
                      <button
                        onClick={() => setCarouselToEdit(carousel)}
                        className="p-2 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors"
                        title="Atur Urutan & Banner"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteCarousel(carousel.id)}
                        className="p-2 rounded-full bg-white hover:bg-rose-50 border border-gray-200 text-rose-500 hover:text-rose-700 transition-colors"
                        title="Hapus Carousel"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Embed Modal for Single Banner */}
      {selectedEmbedBanner && (
        <EmbedModal
          banner={selectedEmbedBanner}
          onClose={() => setSelectedEmbedBanner(null)}
        />
      )}

      {/* Embed Modal for Carousel Slot */}
      {selectedEmbedCarousel && (
        <EmbedModal
          carousel={selectedEmbedCarousel}
          onClose={() => setSelectedEmbedCarousel(null)}
        />
      )}

      {/* Create / Edit Single Banner Modal */}
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

      {/* Create / Edit Carousel Slot Modal */}
      {(showCreateCarouselModal || carouselToEdit) && (
        <CreateCarouselModal
          carouselToEdit={carouselToEdit}
          onClose={() => {
            setShowCreateCarouselModal(false);
            setCarouselToEdit(null);
          }}
          onSuccess={() => {
            fetchCarousels();
          }}
        />
      )}
    </main>
  );
}
