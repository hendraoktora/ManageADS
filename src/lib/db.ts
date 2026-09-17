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

export interface CarouselSlide {
  bannerId: string;
  order: number;
}

export interface CarouselSlot {
  id: string;
  name: string;
  size: "728x90" | "300x250" | "160x600" | "responsive";
  intervalMs: number;
  autoPlay: boolean;
  showDots: boolean;
  showArrows: boolean;
  isActive: boolean;
  slides: CarouselSlide[];
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  banners: Banner[];
  publishers: Publisher[];
  events: EventLog[];
  carousels: CarouselSlot[];
}

// Konfigurasi Cloud Database (Upstash Redis / Vercel KV)
const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/$/, "");
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const IS_CLOUD_DB = Boolean(KV_URL && KV_TOKEN);

// Konfigurasi File Storage Lokal (jika belum memakai Cloud Database)
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "manageads-data")
  : path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const SEED_DATA: DatabaseSchema = {
  banners: [],
  publishers: [],
  events: [],
  carousels: [],
};

// In-Memory Cache untuk performa tinggi
let memoryCache: DatabaseSchema | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 3000; // 3 detik

async function ensureDb(): Promise<DatabaseSchema> {
  // 1. Jika terhubung ke Cloud Database (Upstash / Vercel KV)
  if (IS_CLOUD_DB) {
    if (memoryCache && Date.now() - lastFetchTime < CACHE_TTL) {
      return memoryCache;
    }

    try {
      const res = await fetch(`${KV_URL}/get/manageads_db`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        if (json && json.result) {
          const parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
          memoryCache = {
            banners: parsed.banners || [],
            publishers: parsed.publishers || [],
            events: parsed.events || [],
            carousels: parsed.carousels || [],
          };
          lastFetchTime = Date.now();
          return memoryCache;
        }
      }
    } catch (err) {
      console.error("[ManageADS Cloud DB] Gagal membaca dari Redis:", err);
    }

    if (!memoryCache) memoryCache = { ...SEED_DATA };
    return memoryCache;
  }

  // 2. Fallback: File Storage Lokal (SSD di komputer Anda / tmp di Vercel)
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {}
  }

  if (!fs.existsSync(DB_FILE)) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2), "utf-8");
    } catch (e) {}
    return { ...SEED_DATA };
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      banners: parsed.banners || [],
      publishers: parsed.publishers || [],
      events: parsed.events || [],
      carousels: parsed.carousels || [],
    };
  } catch (err) {
    return { ...SEED_DATA };
  }
}

async function saveDb(data: DatabaseSchema): Promise<void> {
  memoryCache = data;
  lastFetchTime = Date.now();

  // 1. Simpan ke Cloud Database
  if (IS_CLOUD_DB) {
    try {
      await fetch(`${KV_URL}/set/manageads_db`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      });
      return;
    } catch (err) {
      console.error("[ManageADS Cloud DB] Gagal menyimpan ke Redis:", err);
    }
  }

  // 2. Simpan ke File Lokal
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {}
}

export async function getBanners(): Promise<Banner[]> {
  const db = await ensureDb();
  return db.banners;
}

export async function getBannerById(id: string): Promise<Banner | undefined> {
  const db = await ensureDb();
  return db.banners.find((b) => b.id === id);
}

export async function createBanner(
  data: Omit<Banner, "id" | "createdAt" | "updatedAt" | "views" | "clicks">
): Promise<Banner> {
  const db = await ensureDb();
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
  await saveDb(db);
  return newBanner;
}

export async function updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
  const db = await ensureDb();
  const index = db.banners.findIndex((b) => b.id === id);
  if (index === -1) return null;

  db.banners[index] = {
    ...db.banners[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveDb(db);
  return db.banners[index];
}

export async function deleteBanner(id: string): Promise<boolean> {
  const db = await ensureDb();
  const initialLength = db.banners.length;
  db.banners = db.banners.filter((b) => b.id !== id);
  if (db.banners.length !== initialLength) {
    await saveDb(db);
    return true;
  }
  return false;
}

export async function deletePublisher(id: string): Promise<boolean> {
  const db = await ensureDb();
  const initialLength = db.publishers.length;
  db.publishers = db.publishers.filter((p) => p.id !== id);
  if (db.publishers.length !== initialLength) {
    await saveDb(db);
    return true;
  }
  return false;
}

// Ambang batas keaktifan domain mitra: jika tidak ada impresi dalam 48 jam, status dianggap tidak aktif
export const INACTIVE_THRESHOLD_MS = 48 * 60 * 60 * 1000; // 48 jam

export async function getPublishers(): Promise<Publisher[]> {
  const db = await ensureDb();
  const now = Date.now();
  return db.publishers.map((p) => {
    const lastActive = new Date(p.lastActiveAt).getTime();
    const isActive = now - lastActive <= INACTIVE_THRESHOLD_MS;
    return {
      ...p,
      status: isActive ? "ACTIVE" : "INACTIVE",
    };
  });
}

export async function recordEvent(params: {
  bannerId: string;
  type: "VIEW" | "CLICK";
  referrer: string;
  userAgent?: string;
  ip?: string;
}): Promise<void> {
  const db = await ensureDb();
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

  // 5. Simpan event log
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

  await saveDb(db);
}

export async function getStats(): Promise<any> {
  const db = await ensureDb();
  const totalViews = db.banners.reduce((sum, b) => sum + b.views, 0);
  const totalClicks = db.banners.reduce((sum, b) => sum + b.clicks, 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0.00";
  const now = Date.now();
  const activePublishers = db.publishers.filter((p) => {
    const lastActive = new Date(p.lastActiveAt).getTime();
    return now - lastActive <= INACTIVE_THRESHOLD_MS;
  }).length;
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
    totalCarousels: (db.carousels || []).length,
    chartData: Object.values(days),
    isCloudDb: IS_CLOUD_DB,
  };
}

export async function getCarousels(): Promise<CarouselSlot[]> {
  const db = await ensureDb();
  return db.carousels || [];
}

export async function getCarouselById(id: string): Promise<CarouselSlot | undefined> {
  const db = await ensureDb();
  return (db.carousels || []).find((c) => c.id === id);
}

export async function createCarousel(
  data: Omit<CarouselSlot, "id" | "createdAt" | "updatedAt">
): Promise<CarouselSlot> {
  const db = await ensureDb();
  const newCarousel: CarouselSlot = {
    ...data,
    id: `car-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.carousels = db.carousels || [];
  db.carousels.unshift(newCarousel);
  await saveDb(db);
  return newCarousel;
}

export async function updateCarousel(
  id: string,
  data: Partial<Omit<CarouselSlot, "id" | "createdAt">>
): Promise<CarouselSlot | null> {
  const db = await ensureDb();
  db.carousels = db.carousels || [];
  const index = db.carousels.findIndex((c) => c.id === id);
  if (index === -1) return null;

  db.carousels[index] = {
    ...db.carousels[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await saveDb(db);
  return db.carousels[index];
}

export async function deleteCarousel(id: string): Promise<boolean> {
  const db = await ensureDb();
  db.carousels = db.carousels || [];
  const initialLength = db.carousels.length;
  db.carousels = db.carousels.filter((c) => c.id !== id);
  if (db.carousels.length !== initialLength) {
    await saveDb(db);
    return true;
  }
  return false;
}

export async function clearDatabase(): Promise<void> {
  const emptyDb: DatabaseSchema = {
    banners: [],
    publishers: [],
    events: [],
    carousels: [],
  };
  await saveDb(emptyDb);
}
