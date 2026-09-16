"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, Plus } from "lucide-react";

interface HeaderProps {
  onOpenCreate?: () => void;
}

export default function Header({ onOpenCreate }: HeaderProps) {
  const [username, setUsername] = useState<string>("Admin");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data?.authenticated && data?.user?.username) {
          const u = data.user.username;
          setUsername(u.charAt(0).toUpperCase() + u.slice(1));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Hi, {username}!
          <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Kelola distribusi banner, backlink SEO, dan monitor trafik domain mitra hari ini.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search input pill */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari domain atau banner..."
            className="w-56 md:w-64 pl-10 pr-4 py-2.5 rounded-full bg-white border border-transparent focus:border-gray-200 focus:outline-none shadow-sm text-xs md:text-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Action Button Pill matching reference image */}
        {onOpenCreate ? (
          <button
            onClick={onOpenCreate}
            className="bg-[#111827] hover:bg-black text-[#D5F639] px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
          >
            <Plus size={16} />
            <span>Buat Banner Baru</span>
          </button>
        ) : (
          <button className="bg-[#111827] hover:bg-black text-[#D5F639] px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold flex items-center gap-2 transition-transform active:scale-95 shadow-sm">
            <Sparkles size={16} className="text-[#D5F639]" />
            <span>ManageADS Pro</span>
          </button>
        )}
      </div>
    </header>
  );
}
