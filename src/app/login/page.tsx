"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, ShieldAlert, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Efek countdown jika terkunci brute force
  useEffect(() => {
    if (countdown <= 0) {
      if (isLocked) setIsLocked(false);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, isLocked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.status === 429 || data.isLocked) {
        setIsLocked(true);
        setCountdown(data.remainingSeconds || 900);
        setError(data.message);
        return;
      }

      if (data.success) {
        // Berhasil login -> redirect ke dashboard
        router.push(redirectPath);
        router.refresh();
      } else {
        setError(data.message || "Username atau password salah.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF3F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-4xl bg-white p-8 md:p-10 shadow-2xl border border-white/80 relative overflow-hidden">
          {/* Top Logo & Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-3xl bg-[#D5F639]/30 border border-[#8DB81B]/30 flex items-center justify-center mb-4 shadow-sm">
              <div className="grid grid-cols-3 gap-1 p-1">
                <span className="w-2 h-2 rounded-full bg-[#8DB81B]"></span>
                <span className="w-2 h-2 rounded-full bg-[#8DB81B]"></span>
                <span className="w-2 h-2 rounded-full bg-[#8DB81B]"></span>
                <span className="w-2 h-2 rounded-full bg-[#8DB81B]"></span>
                <span className="w-2 h-2 rounded-full bg-[#399AF2]"></span>
                <span className="w-2 h-2 rounded-full bg-[#8DB81B]"></span>
                <span className="w-2 h-2 rounded-full bg-[#8DB81B]"></span>
                <span className="w-2 h-2 rounded-full bg-[#8DB81B]"></span>
                <span className="w-2 h-2 rounded-full bg-[#8DB81B]"></span>
              </div>
            </div>

            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              ManageADS Portal
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Masuk untuk mengelola banner iklan &amp; data analitik
            </p>
          </div>

          {/* Security / Error Alert Box */}
          {error && (
            <div
              className={`p-4 rounded-2xl mb-6 text-xs flex items-start gap-2.5 border animate-fadeIn ${
                isLocked
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">
                  {isLocked ? "Sistem Keamanan Aktif (Brute-Force Lock)" : "Autentikasi Gagal"}
                </div>
                <div className="mt-0.5 leading-relaxed">{error}</div>
                {isLocked && countdown > 0 && (
                  <div className="font-mono font-bold mt-1 text-rose-700">
                    Sisa waktu buka kunci: {Math.floor(countdown / 60)}m {countdown % 60}s
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 pl-1">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  disabled={isLocked || loading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white focus:outline-none text-sm text-gray-900 transition-all disabled:opacity-50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 pl-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLocked || loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white focus:outline-none text-sm text-gray-900 transition-all disabled:opacity-50 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLocked || loading}
              className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#111827] hover:bg-black text-[#D5F639] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : isLocked ? (
                <span>Terkunci Sementara</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Security note only */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck size={14} className="text-[#8DB81B]" />
            <span>Dilindungi oleh sistem Anti-Brute Force &amp; Enkripsi Sesi</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EAF3F5] flex items-center justify-center text-xs font-semibold text-gray-400">
          Memuat halaman login...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
