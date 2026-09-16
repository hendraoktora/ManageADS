"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-24 md:ml-28 p-6 md:p-8 w-[calc(100%-6rem)] md:w-[calc(100%-7rem)] min-h-screen">
        {children}
      </main>
    </>
  );
}
