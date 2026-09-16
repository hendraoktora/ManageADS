"use client";

import { useState } from "react";
import { Banner } from "@/lib/db";
import { X, Sparkles, Image as ImageIcon, Link as LinkIcon, Check, Eye } from "lucide-react";

interface CreateBannerModalProps {
  bannerToEdit?: Banner | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_IMAGES = [
  {
    name: "Leaderboard Tech (728x90)",
    url: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=728&h=90&fit=crop&q=80",
    size: "728x90",
  },
  {
    name: "Modern Workspace (728x90)",
    url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=728&h=90&fit=crop&q=80",
    size: "728x90",
  },
  {
    name: "Medium Rectangle Cyber (300x250)",
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=250&fit=crop&q=80",
    size: "300x250",
  },
  {
    name: "Creative Studio (300x250)",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=250&fit=crop&q=80",
    size: "300x250",
  },
];

export default function CreateBannerModal({
  bannerToEdit,
  onClose,
  onSuccess,
}: CreateBannerModalProps) {
  const [name, setName] = useState(bannerToEdit?.name || "");
  const [targetUrl, setTargetUrl] = useState(bannerToEdit?.targetUrl || "https://mywebsite.com/promo");
  const [imageUrl, setImageUrl] = useState(
    bannerToEdit?.imageUrl || PRESET_IMAGES[0].url
  );
  const [altText, setAltText] = useState(bannerToEdit?.altText || "Solusi Bisnis Digital Terbaik");
  const [size, setSize] = useState<"728x90" | "300x250" | "160x600" | "responsive">(
    bannerToEdit?.size || "728x90"
  );
  const [backlinkRel, setBacklinkRel] = useState<"dofollow" | "nofollow" | "sponsored">(
    bannerToEdit?.backlinkRel || "dofollow"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = bannerToEdit ? `/api/banners/${bannerToEdit.id}` : "/api/banners";
      const method = bannerToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          targetUrl,
          imageUrl,
          altText,
          size,
          backlinkRel,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Gagal menyimpan banner");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl border border-white max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D5F639]/40 text-[#4D6D09] text-xs font-bold mb-1">
              <Sparkles size={12} />
              <span>{bannerToEdit ? "Perbarui Visual Iklan" : "Buat Banner Iklan Baru"}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {bannerToEdit ? "Edit Banner & Visual" : "Konfigurasi Banner Baru"}
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
          <div className="p-3 my-3 rounded-2xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Banner Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Nama Kampanye Banner:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Promo Diskon 50% Peluncuran Produk"
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:outline-none text-sm text-gray-900"
            />
          </div>

          {/* Target Website URL */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              URL Website Utama Anda (Redirect Target):
            </label>
            <div className="relative">
              <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://website-anda.com/halaman-tujuan"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:outline-none text-sm text-gray-900"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Ketika pengunjung di website orang lain mengeklik banner, mereka akan dialihkan ke link ini.
            </p>
          </div>

          {/* Image URL & Preset Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              URL Visual Gambar Banner:
            </label>
            <div className="relative">
              <ImageIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://.../gambar-banner.jpg"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:outline-none text-sm text-gray-900"
              />
            </div>

            {/* Quick preset selector */}
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-[11px] text-gray-400 py-1">Pilih Contoh:</span>
              {PRESET_IMAGES.map((preset, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    setImageUrl(preset.url);
                    setSize(preset.size as any);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Visual Live Preview Box */}
            <div className="mt-3 p-3 rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[90px]">
              <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1 font-semibold uppercase">
                <Eye size={11} />
                Pratinjau Visual Gambar
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="max-h-24 max-w-full rounded-md object-contain shadow-xs"
                onError={(e) => {
                  (e.target as any).src =
                    "https://placehold.co/728x90/e2e8f0/64748b?text=Gambar+Tidak+Dapat+Dimuat";
                }}
              />
            </div>
          </div>

          {/* Size & SEO Backlink Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Ukuran Standar Banner:
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                className="w-full px-3 py-2 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:outline-none text-xs text-gray-900 font-medium"
              >
                <option value="728x90">728x90 (Leaderboard Web)</option>
                <option value="300x250">300x250 (Medium Rectangle)</option>
                <option value="160x600">160x600 (Skyscraper)</option>
                <option value="responsive">Responsive (Lebar 100%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Atribut Backlink SEO:
              </label>
              <select
                value={backlinkRel}
                onChange={(e) => setBacklinkRel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:outline-none text-xs text-gray-900 font-medium"
              >
                <option value="dofollow">dofollow (Terbaik untuk SEO)</option>
                <option value="nofollow">nofollow (Standard Web)</option>
                <option value="sponsored">sponsored (Tanda Iklan Resmi)</option>
              </select>
            </div>
          </div>

          {/* Alt text for SEO */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Alt Text Gambar (Anchor SEO):
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Deskripsi singkat untuk nilai SEO Google"
              className="w-full px-4 py-2 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:outline-none text-xs text-gray-900"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-full bg-[#111827] hover:bg-black text-[#D5F639] text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : bannerToEdit ? "Simpan Perubahan Visual" : "Simpan & Buat Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
