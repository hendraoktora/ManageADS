import crypto from "crypto";
import { cookies } from "next/headers";

// Konfigurasi Kredensial (Wajib diset via Environment Variables, TIDAK PERNAH di-hardcode)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "mads-default-dev-secret-change-in-production";
const COOKIE_NAME = "mads_auth_session";

// In-Memory Brute-Force Rate Limiter
// Menyimpan record percobaan login gagal per IP
interface LoginAttemptRecord {
  attempts: number;
  lockedUntil: number; // timestamp ms
  lastAttempt: number;
}

const loginAttempts = new Map<string, LoginAttemptRecord>();

// Pengaturan Anti-Brute-Force
const MAX_ATTEMPTS = 5; // Maksimal 5 kali salah
const LOCKOUT_TIME = 15 * 60 * 1000; // Dikunci selama 15 menit jika gagal 5 kali
const ATTEMPT_WINDOW = 15 * 60 * 1000; // Reset hitungan setelah 15 menit

export function checkBruteForce(ip: string): { isLocked: boolean; remainingSeconds: number; remainingAttempts: number } {
  const record = loginAttempts.get(ip);
  const now = Date.now();

  if (!record) {
    return { isLocked: false, remainingSeconds: 0, remainingAttempts: MAX_ATTEMPTS };
  }

  // Cek apakah masih dalam masa penguncian (lockout)
  if (record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds, remainingAttempts: 0 };
  }

  // Cek apakah sudah melewati window waktu percobaan
  if (now - record.lastAttempt > ATTEMPT_WINDOW) {
    loginAttempts.delete(ip);
    return { isLocked: false, remainingSeconds: 0, remainingAttempts: MAX_ATTEMPTS };
  }

  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - record.attempts);
  return { isLocked: false, remainingSeconds: 0, remainingAttempts };
}

export function recordFailedAttempt(ip: string): { isLocked: boolean; remainingSeconds: number; remainingAttempts: number } {
  const now = Date.now();
  let record = loginAttempts.get(ip);

  if (!record || now - record.lastAttempt > ATTEMPT_WINDOW) {
    record = { attempts: 1, lockedUntil: 0, lastAttempt: now };
  } else {
    record.attempts += 1;
    record.lastAttempt = now;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_TIME;
    loginAttempts.set(ip, record);
    return { isLocked: true, remainingSeconds: Math.ceil(LOCKOUT_TIME / 1000), remainingAttempts: 0 };
  }

  loginAttempts.set(ip, record);
  return { isLocked: false, remainingSeconds: 0, remainingAttempts: MAX_ATTEMPTS - record.attempts };
}

export function resetFailedAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// Timing-safe password verification menggunakan SHA-256 hash comparison
export function verifyCredentials(username: string, pass: string): boolean {
  // Ambil langsung dari process.env agar selalu dinamis di serverless Vercel
  const envUser = (process.env.ADMIN_USERNAME || "").trim();
  const envPass = (process.env.ADMIN_PASSWORD || "").trim();

  if (!envUser || !envPass) {
    console.error(
      "[ManageADS Security Warning] ADMIN_USERNAME atau ADMIN_PASSWORD belum terbaca di Environment Variables Vercel!"
    );
    return false;
  }

  if (typeof username !== "string" || typeof pass !== "string") return false;

  const cleanUser = username.trim();
  const cleanPass = pass.trim();

  // Bandingkan username (case-insensitive) menggunakan SHA-256 buffer (selalu tepat 32 bytes)
  const userHash = crypto.createHash("sha256").update(cleanUser.toLowerCase()).digest();
  const expectedUserHash = crypto.createHash("sha256").update(envUser.toLowerCase()).digest();
  const userMatch = crypto.timingSafeEqual(userHash, expectedUserHash);

  // Bandingkan password (case-sensitive) menggunakan SHA-256 buffer
  const passHash = crypto.createHash("sha256").update(cleanPass).digest();
  const expectedPassHash = crypto.createHash("sha256").update(envPass).digest();
  const passMatch = crypto.timingSafeEqual(passHash, expectedPassHash);

  return userMatch && passMatch;
}

// Membuat signed session token menggunakan HMAC SHA-256
export function createSessionToken(username: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 hari
  const payload = `${username}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${signature}`;
}

// Memverifikasi session token
export function verifySessionToken(token: string): { valid: boolean; username?: string } {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return { valid: false };

    const payload = Buffer.from(parts[0], "base64").toString("utf-8");
    const signature = parts[1];

    const expectedSignature = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    if (signature !== expectedSignature) return { valid: false };

    const [username, expiresAtStr] = payload.split(":");
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return { valid: false };

    return { valid: true, username };
  } catch {
    return { valid: false };
  }
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
