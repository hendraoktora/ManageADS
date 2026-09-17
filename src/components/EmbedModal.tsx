"use client";

import { useState, useEffect } from "react";
import { Banner, CarouselSlot } from "@/lib/db";
import { X, Copy, Check, Code2, Link2, Sparkles, Smartphone, Layers } from "lucide-react";

interface EmbedModalProps {
  banner?: Banner | null;
  carousel?: CarouselSlot | null;
  onClose: () => void;
}

export default function EmbedModal({ banner, carousel, onClose }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"js" | "html" | "mobile">("js");
  const [mobileType, setMobileType] = useState<"webview" | "api">("webview");
  const [apiLang, setApiLang] = useState<"fetch" | "flutter" | "kotlin" | "swift" | "curl">("fetch");
  const [host, setHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.origin);
    }
  }, []);

  if (!banner && !carousel) return null;

  const isCarousel = Boolean(carousel);
  const origin = host || "https://domain-anda.com";

  // Konfigurasi kode untuk Single Banner
  const singleJsCode = banner
    ? `<!-- ManageADS Dynamic Smart Widget (${banner.name}) -->
<div id="mads-${banner.id}" data-mads-banner="${banner.id}" data-mads-host="${origin}"></div>
<script src="${origin}/widget.js" async></script>
<noscript>
  <a href="${banner.targetUrl}" target="_blank" rel="${banner.backlinkRel}">
    <img src="${origin}/api/b/${banner.id}/image" alt="${banner.altText}" style="max-width:100%; height:auto;" />
  </a>
</noscript>`
    : "";

  const singleHtmlCode = banner
    ? `<!-- ManageADS Pure SEO Direct Backlink HTML (${banner.name}) -->
<a href="${banner.targetUrl}" target="_blank" rel="${banner.backlinkRel}" onclick="if(navigator.sendBeacon){navigator.sendBeacon('${origin}/api/c/${banner.id}?beacon=1&ref='+encodeURIComponent(location.href))}else{new Image().src='${origin}/api/c/${banner.id}?beacon=1&ref='+encodeURIComponent(location.href)}">
  <img src="${origin}/api/b/${banner.id}/image" alt="${banner.altText}" style="max-width:100%; height:auto; border-radius:8px;" />
</a>`
    : "";

  const singleMobileWebViewCode = banner
    ? `<!-- ManageADS Mobile WebView Widget (${banner.name}) -->
<div style="width:100%; text-align:center; padding:4px;">
  <a href="${banner.targetUrl}" target="_blank" onclick="if(navigator.sendBeacon){navigator.sendBeacon('${origin}/api/c/${banner.id}?beacon=1&ref=app.nama-mitra.com')}">
    <img src="${origin}/api/b/${banner.id}/image?ref=app.nama-mitra.com" alt="${banner.altText}" style="max-width:100%; height:auto; border-radius:8px;" />
  </a>
</div>`
    : "";

  // Konfigurasi kode untuk Carousel Slot
  const carouselJsCode = carousel
    ? `<!-- ManageADS Dynamic Carousel Slider (${carousel.name} - ${carousel.slides.length} Banner) -->
<div id="mads-${carousel.id}" data-mads-carousel="${carousel.id}" data-mads-host="${origin}"></div>
<script src="${origin}/widget.js" async></script>`
    : "";

  const carouselHtmlCode = carousel
    ? `<!-- ManageADS Dynamic Carousel Slider (${carousel.name}) -->
<div id="mads-${carousel.id}" data-mads-carousel="${carousel.id}" data-mads-host="${origin}"></div>
<script src="${origin}/widget.js" async></script>`
    : "";

  const carouselMobileWebViewCode = carousel
    ? `<!-- ManageADS Carousel Mobile WebView Widget (${carousel.name}) -->
<div id="mads-${carousel.id}" data-mads-carousel="${carousel.id}" data-mads-host="${origin}"></div>
<script src="${origin}/widget.js" async></script>`
    : "";

  // REST API Snippets (Single Banner vs Carousel Slot)
  const apiSnippets = isCarousel
    ? {
        fetch: `// [React Native / JavaScript]
// 1. Ambil seluruh slide carousel yang terurut (sequence) & aktif:
const res = await fetch('${origin}/api/c-slot/${carousel!.id}?ref=app.nama-mitra.com');
const { carousel } = await res.json();
// carousel.slides -> Array banner: [{ id, imageUrl, targetUrl, altText, order }, ...]
// carousel.intervalMs -> Durasi pergantian slide (${carousel!.intervalMs}ms)

// 2. Saat salah satu slide banner di-tap:
const onSlidePress = (slide) => {
  Linking.openURL(slide.targetUrl);
  fetch('${origin}/api/c/' + slide.id + '?beacon=1&ref=app.nama-mitra.com', { method: 'POST' });
};`,
        flutter: `// [Flutter / Dart]
// 1. Ambil data carousel terurut (sequence):
final res = await http.get(Uri.parse('${origin}/api/c-slot/${carousel!.id}?ref=app.nama-mitra.com'));
final data = jsonDecode(res.body);
final List slides = data['carousel']['slides'];

// 2. Saat slide di-tap:
void onSlideTap(Map slide) {
  launchUrl(Uri.parse(slide['targetUrl']));
  http.post(Uri.parse('${origin}/api/c/' + slide['id'] + '?beacon=1&ref=app.nama-mitra.com'));
}`,
        kotlin: `// [Android Kotlin]
// 1. Fetch seluruh banner carousel terurut:
val request = Request.Builder()
    .url("${origin}/api/c-slot/${carousel!.id}?ref=app.nama-mitra.com")
    .build()
client.newCall(request).enqueue(...) // Response JSON berisi carousel.slides

// 2. Saat banner di-klik (Buka URL target & kirim beacon klik):
val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(selectedSlide.targetUrl))
context.startActivity(browserIntent)
client.newCall(Request.Builder().url("${origin}/api/c/" + selectedSlide.id + "?beacon=1&ref=app.nama-mitra.com").post(RequestBody.create(null, ByteArray(0))).build()).enqueue(...)`,
        swift: `// [iOS Swift]
// 1. Ambil data carousel terurut:
let url = URL(string: "${origin}/api/c-slot/${carousel!.id}?ref=app.nama-mitra.com")!
URLSession.shared.dataTask(with: url) { data, _, _ in
    // Parse JSON: data.carousel.slides (Array banner berurutan)
}.resume()`,
        curl: `# [cURL Carousel Slot]
# Ambil data carousel berserta seluruh banner terurut:
curl -X GET "${origin}/api/c-slot/${carousel!.id}?ref=app.nama-mitra.com"`,
      }
    : {
        fetch: `// [React Native / JavaScript]
// 1. Ambil data banner (otomatis mencatat +1 View di dashboard):
const res = await fetch('${origin}/api/b/${banner!.id}?ref=app.nama-mitra.com');
const { banner } = await res.json();

// 2. Saat user mengetuk/klik banner di aplikasi:
const onBannerPress = () => {
  Linking.openURL(banner.targetUrl);
  fetch('${origin}/api/c/${banner!.id}?beacon=1&ref=app.nama-mitra.com', { method: 'POST' });
};`,
        flutter: `// [Flutter / Dart]
// 1. Ambil data banner:
final res = await http.get(Uri.parse('${origin}/api/b/${banner!.id}?ref=app.nama-mitra.com'));
final data = jsonDecode(res.body);
final b = data['banner'];

// 2. Saat banner di-tap:
void onBannerTap() {
  launchUrl(Uri.parse(b['targetUrl']));
  http.post(Uri.parse('${origin}/api/c/${banner!.id}?beacon=1&ref=app.nama-mitra.com'));
}`,
        kotlin: `// [Android Native - Kotlin]
val request = Request.Builder()
    .url("${origin}/api/b/${banner!.id}?ref=app.nama-mitra.com")
    .build()
client.newCall(request).enqueue(...)`,
        swift: `// [iOS Native - Swift]
let url = URL(string: "${origin}/api/b/${banner!.id}?ref=app.nama-mitra.com")!
URLSession.shared.dataTask(with: url) { ... }.resume()`,
        curl: `# [cURL / HTTP Request Raw]
curl -X GET "${origin}/api/b/${banner!.id}?ref=app.nama-mitra.com"
curl -X POST "${origin}/api/c/${banner!.id}?beacon=1&ref=app.nama-mitra.com"`,
      };

  let activeCode = isCarousel ? carouselJsCode : singleJsCode;
  if (tab === "html") {
    activeCode = isCarousel ? carouselHtmlCode : singleHtmlCode;
  } else if (tab === "mobile") {
    activeCode = mobileType === "webview"
      ? (isCarousel ? carouselMobileWebViewCode : singleMobileWebViewCode)
      : apiSnippets[apiLang];
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const titleName = isCarousel ? carousel!.name : banner!.name;
  const itemSize = isCarousel ? carousel!.size : banner!.size;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl border border-white relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D5F639]/40 text-[#4D6D09] text-xs font-bold mb-1">
              {isCarousel ? <Layers size={12} /> : <Sparkles size={12} />}
              <span>{isCarousel ? "Kode Embed Slot Carousel" : "Kode Embed Banner"}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{titleName}</h3>
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
            <span>Dynamic Script ({isCarousel ? "Carousel Slider" : "Web"})</span>
          </button>
          {!isCarousel && (
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
          )}
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

        {/* Language selector for REST API */}
        {tab === "mobile" && mobileType === "api" && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[11px] font-bold text-gray-400 mr-1">Bahasa / Framework:</span>
            {[
              { id: "fetch", label: "React Native (JS)" },
              { id: "flutter", label: "Flutter (Dart)" },
              { id: "kotlin", label: "Android (Kotlin)" },
              { id: "swift", label: "iOS (Swift)" },
              { id: "curl", label: "cURL / Raw" },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setApiLang(lang.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  apiLang === lang.id
                    ? "bg-gray-900 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-gray-500 mt-3">
          {isCarousel
            ? "Pasang kode widget ini di website mitra. Widget otomatis memuat seluruh banner di dalam slot carousel ini secara berputar (slider), lengkap dengan transisi halus, dots, dan panah navigasi."
            : tab === "js"
            ? "Salin kode ini ke website mitra Anda. Saat Anda mengganti visual gambar di dashboard ini, iklan di web mereka akan otomatis berubah seketika tanpa perlu mereka edit kode!"
            : tab === "html"
            ? "Format HTML tag standar dengan atribut rel='dofollow'. Sangat disukai robot mesin pencari (Googlebot) untuk mengalirkan ranking backlink berkualitas langsung ke web Anda."
            : mobileType === "webview"
            ? "Salin kode HTML ini langsung ke komponen WebView di aplikasi Android, iOS, Flutter, atau React Native mitra."
            : "Endpoint JSON REST API untuk aplikasi mobile native. Aplikasi mengambil banner secara native, super cepat, dan hemat memori!"}
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
            {isCarousel ? "Informasi Slot Carousel:" : "Pratinjau Visual Banner Saat Ini:"}
          </div>

          {isCarousel ? (
            <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-gray-900">{carousel!.slides.length} Banner Terurut</span>
                <span className="text-gray-400 mx-2">•</span>
                <span>Durasi: {Math.round((carousel!.intervalMs || 5000) / 1000)} detik/slide</span>
                <span className="text-gray-400 mx-2">•</span>
                <span>Ukuran: {carousel!.size}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D5F639]/30 text-[#4D6D09] text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DB81B]"></span>
                <span>Autoplay Aktif</span>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner!.imageUrl}
                  alt={banner!.altText}
                  className="rounded-lg max-h-28 max-w-full object-contain shadow-xs"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
                <span>Ukuran: {banner!.size}</span>
                <span>Target: {banner!.targetUrl}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
