"use client";

import { useState, useEffect } from "react";
import { Banner, CarouselSlot, CarouselSlide } from "@/lib/db";
import { X, Sparkles, ArrowUp, ArrowDown, Trash2, Plus, Check, Layers, Image as ImageIcon } from "lucide-react";

interface CreateCarouselModalProps {
  carouselToEdit?: CarouselSlot | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCarouselModal({
  carouselToEdit,
  onClose,
  onSuccess,
}: CreateCarouselModalProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [name, setName] = useState(carouselToEdit?.name || "");
  const [size, setSize] = useState<"728x90" | "300x250" | "160x600" | "responsive">(
    carouselToEdit?.size || "728x90"
  );
  const [intervalSec, setIntervalSec] = useState<number>(
    carouselToEdit?.intervalMs ? Math.round(carouselToEdit.intervalMs / 1000) : 5
  );
  const [autoPlay, setAutoPlay] = useState(carouselToEdit?.autoPlay !== false);
  const [showDots, setShowDots] = useState(carouselToEdit?.showDots !== false);
  const [showArrows, setShowArrows] = useState(carouselToEdit?.showArrows !== false);
  const [selectedSlides, setSelectedSlides] = useState<CarouselSlide[]>(
    carouselToEdit?.slides || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setBanners(data.data.filter((b: Banner) => b.isActive));
        }
      })
      .catch((err) => console.error("Gagal mengambil banner:", err));
  }, []);

  const bannerMap = new Map(banners.map((b) => [b.id, b]));

  const handleToggleBanner = (bannerId: string) => {
    const existingIndex = selectedSlides.findIndex((s) => s.bannerId === bannerId);
    if (existingIndex !== -1) {
      // Hapus dari carousel & tata ulang order
      const newSlides = selectedSlides
        .filter((s) => s.bannerId !== bannerId)
        .map((s, idx) => ({ ...s, order: idx + 1 }));
      setSelectedSlides(newSlides);
    } else {
      // Tambah ke carousel (maksimal 6)
      if (selectedSlides.length >= 6) {
        alert("Maksimal 6 banner dalam 1 carousel agar performa loading website mitra tetap cepat.");
        return;
      }
      const newSlides = [
        ...selectedSlides,
        { bannerId, order: selectedSlides.length + 1 },
      ];
      setSelectedSlides(newSlides);
    }
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedSlides.length) return;

    const updated = [...selectedSlides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Tata ulang order urutan
    const reordered = updated.map((s, idx) => ({
      ...s,
      order: idx + 1,
    }));
    setSelectedSlides(reordered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama carousel wajib diisi");
      return;
    }
    if (selectedSlides.length === 0) {
      setError("Pilih minimal 1 banner untuk dimasukkan ke dalam carousel");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      name: name.trim(),
      size,
      intervalMs: intervalSec * 1000,
      autoPlay,
      showDots,
      showArrows,
      slides: selectedSlides,
    };

    try {
      const url = carouselToEdit ? `/api/carousels/${carouselToEdit.id}` : "/api/carousels";
      const method = carouselToEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Terjadi kesalahan saat menyimpan");
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl border border-white relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8DB81B]/20 text-[#4E7008] text-xs font-bold mb-1">
              <Layers size={12} />
              <span>{carouselToEdit ? "Edit Slot Carousel" : "Buat Slot Carousel Baru"}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {carouselToEdit ? carouselToEdit.name : "Slider Iklan Otomatis (Carousel)"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Nama Carousel */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Nama Slot Carousel
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Slider Header Blog Mitra, Carousel Promo Sidebar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white text-xs font-medium text-gray-900 outline-none transition-all"
            />
          </div>

          {/* Grid Ukuran & Durasi Interval */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Ukuran Slot Banner
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white text-xs font-medium text-gray-900 outline-none transition-all"
              >
                <option value="728x90">Leaderboard (728 x 90)</option>
                <option value="300x250">Medium Rectangle (300 x 250)</option>
                <option value="160x600">Skyscraper (160 x 600)</option>
                <option value="responsive">Fluid / Responsive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Durasi Pergantian Slide (Detik)
              </label>
              <div className="flex items-center gap-2">
                {[3, 4, 5, 7, 10].map((sec) => (
                  <button
                    type="button"
                    key={sec}
                    onClick={() => setIntervalSec(sec)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      intervalSec === sec
                        ? "bg-[#111827] text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Opsi Tampilan Navigasi */}
          <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="w-4 h-4 rounded text-[#8DB81B] focus:ring-[#8DB81B]"
              />
              <span>Autoplay Berputar Otomatis</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
              <input
                type="checkbox"
                checked={showDots}
                onChange={(e) => setShowDots(e.target.checked)}
                className="w-4 h-4 rounded text-[#8DB81B] focus:ring-[#8DB81B]"
              />
              <span>Titik Navigasi (Dots)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
              <input
                type="checkbox"
                checked={showArrows}
                onChange={(e) => setShowArrows(e.target.checked)}
                className="w-4 h-4 rounded text-[#8DB81B] focus:ring-[#8DB81B]"
              />
              <span>Panah Geser (Arrows)</span>
            </label>
          </div>

          {/* Pengaturan Sequence & Pemilihan Banner */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-bold text-gray-900">
                  Urutan Tampil Banner (Sequence):
                </label>
                <p className="text-[11px] text-gray-500">
                  Gunakan tombol panah untuk menentukan banner mana yang tampil pertama, kedua, dst.
                </p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                selectedSlides.length === 6
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {selectedSlides.length} / 6 Banner Terpilih
              </span>
            </div>

            {selectedSlides.length === 0 ? (
              <div className="p-4 rounded-2xl border-2 border-dashed border-gray-200 text-center text-xs text-gray-400">
                Pilih banner dari daftar di bawah untuk menyusun urutan slide carousel.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedSlides.map((slide, index) => {
                  const b = bannerMap.get(slide.bannerId);
                  return (
                    <div
                      key={slide.bannerId}
                      className="p-3 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xl bg-[#8DB81B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {slide.order}
                        </div>
                        {b ? (
                          <div className="flex items-center gap-2.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={b.imageUrl}
                              alt={b.name}
                              className="w-12 h-8 rounded-lg object-cover bg-gray-100 border border-gray-100"
                            />
                            <div>
                              <div className="font-bold text-xs text-gray-900">{b.name}</div>
                              <div className="text-[10px] text-gray-400 truncate max-w-xs">{b.targetUrl}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Banner ID: {slide.bannerId}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveSlide(index, "up")}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 transition-colors"
                          title="Geser Urutan ke Atas"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={index === selectedSlides.length - 1}
                          onClick={() => moveSlide(index, "down")}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 transition-colors"
                          title="Geser Urutan ke Bawah"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleBanner(slide.bannerId)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors ml-1"
                          title="Hapus dari Carousel"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Daftar Banner yang Tersedia untuk Dipilih */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Pilih Banner Tersedia (Klik untuk Tambah / Kurang):
            </label>
            {banners.length === 0 ? (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-center text-gray-400">
                Belum ada banner aktif. Buat banner terlebih dahulu di menu Banners.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {banners.map((b) => {
                  const isSelected = selectedSlides.some((s) => s.bannerId === b.id);
                  return (
                    <div
                      key={b.id}
                      onClick={() => handleToggleBanner(b.id)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-[#D5F639]/20 border-[#8DB81B] shadow-xs"
                          : "bg-gray-50/70 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.imageUrl}
                          alt={b.name}
                          className="w-10 h-7 rounded-md object-cover bg-white border border-gray-200 shrink-0"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-gray-900 truncate">{b.name}</div>
                          <div className="text-[10px] text-gray-500">{b.size}</div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-[#8DB81B] text-white" : "border border-gray-300 bg-white"
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : carouselToEdit ? "Simpan Perubahan" : "Buat Slot Carousel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
