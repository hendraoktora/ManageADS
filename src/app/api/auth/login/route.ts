import { NextResponse } from "next/server";
import {
  verifyCredentials,
  createSessionToken,
  checkBruteForce,
  recordFailedAttempt,
  resetFailedAttempts,
  getSessionCookieName,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Ambil IP klien untuk proteksi rate limiting / anti brute-force
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

    // 1. Cek apakah IP sedang diblokir karena brute-force
    const bruteStatus = checkBruteForce(ip);
    if (bruteStatus.isLocked) {
      const minutes = Math.ceil(bruteStatus.remainingSeconds / 60);
      return NextResponse.json(
        {
          success: false,
          isLocked: true,
          message: `Terlalu banyak percobaan gagal. Akun Anda dikunci sementara selama ${minutes} menit untuk keamanan.`,
          remainingSeconds: bruteStatus.remainingSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    // 2. Verifikasi Kredensial dengan timing-safe check
    const isValid = verifyCredentials(username, password);

    if (!isValid) {
      // Catat kegagalan dan kurangi sisa percobaan
      const attemptResult = recordFailedAttempt(ip);

      if (attemptResult.isLocked) {
        return NextResponse.json(
          {
            success: false,
            isLocked: true,
            message: "Anda telah 5 kali salah memasukkan password. Sistem mengunci akses selama 15 menit.",
            remainingSeconds: attemptResult.remainingSeconds,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: `Username atau password salah. Sisa percobaan: ${attemptResult.remainingAttempts} kali.`,
          remainingAttempts: attemptResult.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 3. Login Berhasil: Reset catatan gagal brute-force untuk IP ini
    resetFailedAttempts(ip);

    // Buat token sesi aman HMAC SHA-256
    const token = createSessionToken(username);

    // Buat respon dengan Secure HTTP-Only Cookie
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil!",
      user: { username },
    });

    response.cookies.set({
      name: getSessionCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 hari
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server.", error: String(err) },
      { status: 500 }
    );
  }
}
