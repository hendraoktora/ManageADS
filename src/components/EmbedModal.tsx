"use client";

import { useState, useEffect } from "react";
import { Banner } from "@/lib/db";
import { X, Copy, Check, Code2, Link2, Sparkles, ExternalLink } from "lucide-react";

interface EmbedModalProps {
  banner: Banner | null;
  onClose: () => void;
}

export default function EmbedModal({ banner, onClose }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"js" | "html">("js");
  const [host, setHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.origin);
    }
  }, []);

  if (!banner) return null;

  const origin = host || "https://domain-anda.com";

  const jsCode = `<!-- ManageADS Dynamic Smart Widget (Auto-Updates) -->
<div id="mads-${banner.id}" data-mads-banner="${banner.id}" data-mads-host="${origin}"></div>
<script src="${origin}/widget.js" async></script>
<noscript>
  <a href="${origin}/api/c/${banner.id}" target="_blank" rel="${banner.backlinkRel}">
    <img src="${origin}/api/b/${banner.id}/image" alt="${banner.altText}" style="max-width:100%; height:auto;" />
  </a>
</noscript>`;

  const htmlCode = `<!-- ManageADS Pure SEO Backlink HTML (100% Crawlable) -->
<a href="${origin}/api/c/${banner.id}" target="_blank" rel="${banner.backlinkRel}">
  <img src="${origin}/api/b/${banner.id}/image" alt="${banner.altText}" style="max-width:100%; height:auto; border-radius:8px;" />
</a>`;

  const activeCode = tab === "js" ? jsCode : htmlCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl border border-white relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D5F639]/40 text-[#4D6D09] text-xs font-bold mb-1">
              <Sparkles size={12} />
              <span>Kode Embed Widget</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{banner.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={() => setTab("js")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              tab === "js"
                ? "bg-[#111827] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Code2 size={14} />
            <span>Dynamic Script (Rekomendasi)</span>
          </button>
          <button
            onClick={() => setTab("html")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              tab === "html"
                ? "bg-[#111827] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Link2 size={14} />
            <span>Pure SEO HTML Link</span>
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 mt-3">
          {tab === "js"
            ? "Salin kode ini ke website mitra Anda. Saat Anda mengganti visual gambar di dashboard ini, iklan di web mereka akan otomatis berubah seketika tanpa perlu mereka edit kode!"
            : "Format HTML tag standar dengan atribut rel='dofollow'. Sangat disukai robot mesin pencari (Googlebot) untuk mengalirkan ranking backlink berkualitas ke web Anda."}
        </p>

        {/* Code Box */}
        <div className="relative mt-4">
          <pre className="p-4 rounded-2xl bg-gray-900 text-emerald-300 font-mono text-xs overflow-x-auto border border-gray-800 leading-relaxed max-h-48">
            <code>{activeCode}</code>
          </pre>

          <button
            onClick={handleCopy}
            className={`absolute top-3 right-3 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              copied
                ? "bg-[#8DB81B] text-white"
                : "bg-white hover:bg-gray-100 text-gray-900"
            }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Salin Kode</span>
              </>
            )}
          </button>
        </div>

        {/* Live Visual Preview */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Pratinjau Visual Banner Saat Ini:
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.imageUrl}
              alt={banner.altText}
              className="rounded-lg max-h-28 max-w-full object-contain shadow-xs"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
            <span>Ukuran: {banner.size}</span>
            <span>Target: {banner.targetUrl}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
