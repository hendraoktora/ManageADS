import fs from "fs";
import path from "path";

export interface Banner {
  id: string;
  name: string;
  targetUrl: string;
  imageUrl: string;
  altText: string;
  size: "728x90" | "300x250" | "160x600" | "responsive";
  backlinkRel: "dofollow" | "nofollow" | "sponsored";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
  clicks: number;
}

export interface Publisher {
  id: string;
  domain: string;
  firstSeenAt: string;
  lastActiveAt: string;
  status: "ACTIVE" | "INACTIVE";
  totalViews: number;
  totalClicks: number;
  installedBanners: string[];
}

export interface EventLog {
  id: string;
  bannerId: string;
  type: "VIEW" | "CLICK";
  domain: string;
  ipHash: string;
  device: "desktop" | "mobile" | "tablet";
  timestamp: string;
}

interface DatabaseSchema {
  banners: Banner[];
  publishers: Publisher[];
  events: EventLog[];
}

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "manageads-data")
  : path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const SEED_DATA: DatabaseSchema = {
  banners: [],
  publishers: [],
  events: [],
};

// Pastikan direktori data ada
function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2), "utf-8");
    return SEED_DATA;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error("Gagal membaca db.json, mengembalikan data default:", err);
    return SEED_DATA;
  }
}

function saveDb(data: DatabaseSchema): void {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getBanners(): Banner[] {
  const db = ensureDb();
  return db.banners;
}

export function getBannerById(id: string): Banner | undefined {
  const db = ensureDb();
  return db.banners.find((b) => b.id === id);
}

export function createBanner(data: Omit<Banner, "id" | "createdAt" | "updatedAt" | "views" | "clicks">): Banner {
  const db = ensureDb();
  const id = `ban-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const newBanner: Banner = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
    views: 0,
    clicks: 0,
  };
  db.banners.unshift(newBanner);
  saveDb(db);
  return newBanner;
}

export function updateBanner(id: string, updates: Partial<Banner>): Banner | null {
  const db = ensureDb();
  const index = db.banners.findIndex((b) => b.id === id);
  if (index === -1) return null;

  db.banners[index] = {
    ...db.banners[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDb(db);
  return db.banners[index];
}

export function deleteBanner(id: string): boolean {
  const db = ensureDb();
  const initialLength = db.banners.length;
  db.banners = db.banners.filter((b) => b.id !== id);
  if (db.banners.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

export function getPublishers(): Publisher[] {
  const db = ensureDb();
  return db.publishers;
}

export function recordEvent(params: {
  bannerId: string;
  type: "VIEW" | "CLICK";
  referrer: string;
  userAgent?: string;
  ip?: string;
}) {
  const db = ensureDb();
  const banner = db.banners.find((b) => b.id === params.bannerId);
  if (!banner) return;

  // 1. Ekstrak hostname domain
  let domain = "Direct / Unknown";
  if (params.referrer) {
    try {
      const url = new URL(params.referrer);
      domain = url.hostname.replace(/^www\./, "");
    } catch {
      domain = params.referrer.split("/")[0] || "Unknown";
    }
  }

  // 2. Tentukan tipe device
  let device: "desktop" | "mobile" | "tablet" = "desktop";
  const ua = (params.userAgent || "").toLowerCase();
  if (/mobile|iphone|android|phone/i.test(ua)) device = "mobile";
  else if (/ipad|tablet/i.test(ua)) device = "tablet";

  // 3. Catat di Publisher Registry (Deteksi web yang memasang)
  if (domain && domain !== "Direct / Unknown" && !domain.includes("localhost") && !domain.includes("127.0.0.1")) {
    let pub = db.publishers.find((p) => p.domain.toLowerCase() === domain.toLowerCase());
    const now = new Date().toISOString();

    if (!pub) {
      pub = {
        id: `pub-${Date.now().toString(36)}`,
        domain: domain.toLowerCase(),
        firstSeenAt: now,
        lastActiveAt: now,
        status: "ACTIVE",
        totalViews: 0,
        totalClicks: 0,
        installedBanners: [params.bannerId],
      };
      db.publishers.unshift(pub);
    } else {
      pub.lastActiveAt = now;
      pub.status = "ACTIVE";
      if (!pub.installedBanners.includes(params.bannerId)) {
        pub.installedBanners.push(params.bannerId);
      }
    }

    if (params.type === "VIEW") pub.totalViews += 1;
    if (params.type === "CLICK") pub.totalClicks += 1;
  }

  // 4. Update counter banner
  if (params.type === "VIEW") banner.views += 1;
  if (params.type === "CLICK") banner.clicks += 1;

  // 5. Simpan event log (batasi maksimal 2000 log terbaru agar tidak membesar)
  const event: EventLog = {
    id: `ev-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
    bannerId: params.bannerId,
    type: params.type,
    domain,
    ipHash: params.ip ? Buffer.from(params.ip).toString("base64").substring(0, 10) : "anon",
    device,
    timestamp: new Date().toISOString(),
  };

  db.events.unshift(event);
  if (db.events.length > 2000) {
    db.events = db.events.slice(0, 2000);
  }

  saveDb(db);
}

export function getStats() {
  const db = ensureDb();
  const totalViews = db.banners.reduce((sum, b) => sum + b.views, 0);
  const totalClicks = db.banners.reduce((sum, b) => sum + b.clicks, 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0.00";
  const activePublishers = db.publishers.filter((p) => p.status === "ACTIVE").length;
  const totalPublishers = db.publishers.length;

  // Generate chart timeline 7 hari terakhir
  const days: { [key: string]: { date: string; views: number; clicks: number } } = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
    days[key] = { date: key, views: 0, clicks: 0 };
  }

  // Hitung jumlah view dan click harian secara akurat dari event log riil
  db.events.forEach((ev) => {
    const d = new Date(ev.timestamp);
    const key = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
    if (days[key]) {
      if (ev.type === "VIEW") days[key].views += 1;
      if (ev.type === "CLICK") days[key].clicks += 1;
    }
  });

  return {
    totalViews,
    totalClicks,
    ctr,
    activePublishers,
    totalPublishers,
    activeBanners: db.banners.filter((b) => b.isActive).length,
    chartData: Object.values(days),
  };
}

export function clearDatabase(): void {
  const emptyDb: DatabaseSchema = {
    banners: [],
    publishers: [],
    events: [],
  };
  saveDb(emptyDb);
}
