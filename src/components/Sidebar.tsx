"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Activity,
  Globe,
  Image as ImageIcon,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Overview" },
    { href: "/banners", icon: ImageIcon, label: "Banners" },
    { href: "/publishers", icon: Globe, label: "Publishers" },
    { href: "/analytics", icon: Activity, label: "Analytics" },
  ];

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-20 bg-white rounded-4xl shadow-bento flex flex-col items-center py-7 justify-between z-50 border border-white/60">
      {/* Brand Logo Grid Icon */}
      <div className="flex flex-col items-center gap-6">
        <Link href="/" className="w-11 h-11 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform">
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
        </Link>

        {/* Navigation items */}
        <nav className="flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-[#8DB81B] text-white shadow-md shadow-[#8DB81B]/30 scale-105"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100/60"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom utilities & User avatar */}
      <div className="flex flex-col items-center gap-4">
        <button
          title="Notifikasi"
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100/60 transition-colors"
        >
          <Bell size={18} />
        </button>
        <button
          onClick={async () => {
            if (confirm("Apakah Anda yakin ingin keluar (logout)?")) {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }
          }}
          title="Keluar (Logout)"
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut size={18} />
        </button>

        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#8DB81B]/40 shadow-sm mt-1" title="Super Administrator">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </aside>
  );
}
