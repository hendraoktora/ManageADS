import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "mads_auth_session";

// Daftar path publik yang tidak memerlukan autentikasi
const PUBLIC_PATHS = [
  "/login",
  "/api/auth",
  "/api/b/",      // Endpoint widget & direct image
  "/api/c/",      // Endpoint click tracking redirect
  "/api/c-slot/", // Endpoint carousel widget & mobile
  "/widget.js",   // Script widget klien
  "/favicon.ico",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati static assets internal Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Cek apakah request menuju ke path publik
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic) {
    return NextResponse.next();
  }

  // Cek Cookie sesi
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    // Jika API request, return 401 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // Jika Web page request, redirect ke halaman login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verifikasi sederhana format token (base64.signature)
  const parts = token.split(".");
  if (parts.length !== 2) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = atob(parts[0]);
    const [, expiresAtStr] = payload.split(":");
    const expiresAt = parseInt(expiresAtStr, 10);

    if (Date.now() > expiresAt) {
      // Sesi kadaluarsa
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("expired", "1");
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
