"use client";

import { useState, useEffect } from "react";
import { Banner } from "@/lib/db";
import { X, Copy, Check, Code2, Link2, Sparkles, Smartphone, Layers } from "lucide-react";

interface EmbedModalProps {
  banner: Banner | null;
  onClose: () => void;
}

export default function EmbedModal({ banner, onClose }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"js" | "html" | "mobile">("js");
  const [mobileType, setMobileType] = useState<"webview" | "api">("webview");
  const [host, setHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.origin);
    }
  }, []);

  if (!banner) return null;

  const origin = host || "https://domain-anda.com";

  const jsCode = `<!-- ManageADS Dynamic Smart Widget (Auto-Updates & Direct Backlink) -->
<div id="mads-${banner.id}" data-mads-banner="${banner.id}" data-mads-host="${origin}"></div>
<script src="${origin}/widget.js" async></script>
<noscript>
  <a href="${banner.targetUrl}" target="_blank" rel="${banner.backlinkRel}">
    <img src="${origin}/api/b/${banner.id}/image" alt="${banner.altText}" style="max-width:100%; height:auto;" />
  </a>
</noscript>`;

  const htmlCode = `<!-- ManageADS Pure SEO Direct Backlink HTML (100% Crawlable to Target) -->
<a href="${banner.targetUrl}" target="_blank" rel="${banner.backlinkRel}" onclick="if(navigator.sendBeacon){navigator.sendBeacon('${origin}/api/c/${banner.id}?beacon=1&ref='+encodeURIComponent(location.href))}else{new Image().src='${origin}/api/c/${banner.id}?beacon=1&ref='+encodeURIComponent(location.href)}">
  <img src="${origin}/api/b/${banner.id}/image" alt="${banner.altText}" style="max-width:100%; height:auto; border-radius:8px;" />
</a>`;

  const mobileWebViewCode = `<!-- ManageADS Mobile WebView Widget (Android / iOS / Flutter / React Native) -->
<div style="width:100%; text-align:center; padding:4px;">
  <a href="${banner.targetUrl}" target="_blank" onclick="if(navigator.sendBeacon){navigator.sendBeacon('${origin}/api/c/${banner.id}?beacon=1&ref=app.nama-mitra.com')}">
    <img src="${origin}/api/b/${banner.id}/image?ref=app.nama-mitra.com" alt="${banner.altText}" style="max-width:100%; height:auto; border-radius:8px;" />
  </a>
</div>`;

  const mobileApiCode = `// 1. AMBIL DATA IKLAN & CATAT IMPRESI VIEW (GET HTTP):
// GET ${origin}/api/b/${banner.id}?ref=app.nama-mitra.com
//
// CONTOH RESPONSE JSON:
// {
//   "success": true,
//   "banner": {
//     "id": "${banner.id}",
//     "imageUrl": "${banner.imageUrl}",
//     "targetUrl": "${banner.targetUrl}",
//     "altText": "${banner.altText}",
//     "size": "${banner.size}"
//   }
// }

// 2. CATAT KLIK SAAT BANNER DI-TAP DI APLIKASI (POST HTTP BACKGROUND):
// POST ${origin}/api/c/${banner.id}?beacon=1&ref=app.nama-mitra.com`;

  let activeCode = jsCode;
  if (tab === "html") activeCode = htmlCode;
  else if (tab === "mobile") {
    activeCode = mobileType === "webview" ? mobileWebViewCode : mobileApiCode;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl border border-white relative max-h-[90vh] overflow-y-auto">
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
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <button
            onClick={() => setTab("js")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              tab === "js"
                ? "bg-[#111827] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Code2 size={14} />
            <span>Dynamic Script (Web)</span>
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
            <span>Pure SEO HTML</span>
          </button>
          <button
            onClick={() => setTab("mobile")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              tab === "mobile"
                ? "bg-[#111827] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Smartphone size={14} />
            <span>Mobile App (Android / iOS)</span>
          </button>
        </div>

        {/* Sub-tabs for Mobile */}
        {tab === "mobile" && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed border-gray-200">
            <span className="text-xs font-bold text-gray-400 mr-1">Metode Integrasi:</span>
            <button
              onClick={() => setMobileType("webview")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mobileType === "webview"
                  ? "bg-[#8DB81B]/20 text-[#5A7E0D] border border-[#8DB81B]/40 font-bold"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              WebView (Flutter / React Native / Native)
            </button>
            <button
              onClick={() => setMobileType("api")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mobileType === "api"
                  ? "bg-[#8DB81B]/20 text-[#5A7E0D] border border-[#8DB81B]/40 font-bold"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              REST API (Native JSON)
            </button>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-gray-500 mt-3">
          {tab === "js" &&
            "Salin kode ini ke website mitra Anda. Saat Anda mengganti visual gambar di dashboard ini, iklan di web mereka akan otomatis berubah seketika tanpa perlu mereka edit kode!"}
          {tab === "html" &&
            "Format HTML tag standar dengan atribut rel='dofollow'. Sangat disukai robot mesin pencari (Googlebot) untuk mengalirkan ranking backlink berkualitas langsung ke web Anda."}
          {tab === "mobile" && mobileType === "webview" &&
            "Salin kode HTML ini langsung ke komponen WebView di aplikasi Android, iOS, Flutter, atau React Native mitra. Ganti 'app.nama-mitra.com' sesuai nama bundle app mitra."}
          {tab === "mobile" && mobileType === "api" &&
            "Endpoint JSON REST API untuk aplikasi mobile native. Aplikasi mengambil gambar secara native, super cepat, hemat memori, dan tetap otomatis terlacak di dashboard!"}
        </p>

        {/* Code Box */}
        <div className="relative mt-4">
          <pre className="p-4 rounded-2xl bg-gray-900 text-emerald-300 font-mono text-xs overflow-x-auto border border-gray-800 leading-relaxed max-h-52">
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
