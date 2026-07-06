// Capture marketing screenshots of every page + a social-media pack.
// Usage: node scripts/marketing-screenshots.mjs   (dev server must be on :3000)
import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const BASE = "http://localhost:3000";
const ROOT = process.env.MARKETING_OUT ?? "marketing"; // override to write elsewhere
const OUT = `${ROOT}/screenshots`;
const SOCIAL = `${ROOT}/social`;

const DEMO = {
  admin: { email: "super@nobed.ai", password: "super123" },
  hospital: { email: "admin@ridge.gov.gh", password: "admin123" },
  dispatch: { email: "dispatch@ambulance.gov.gh", password: "dispatch123" },
};

const DESK = { width: 1440, height: 900, deviceScaleFactor: 2 };

async function login(context, creds) {
  const res = await context.request.post(`${BASE}/api/auth/login`, { data: creds });
  if (!res.ok()) throw new Error(`login failed: ${creds.email}`);
}

async function shoot(page, path, file, { dir = OUT, fullPage = true, map = false, charts = false } = {}) {
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(map ? 3000 : charts ? 1500 : 700);
  await page.screenshot({ path: `${dir}/${file}`, fullPage });
  console.log("  ✓", `${dir}/${file}`);
}

async function run() {
  await mkdir(OUT, { recursive: true });
  await mkdir(SOCIAL, { recursive: true });
  const browser = await chromium.launch();

  // ---- Public pages -----------------------------------------------------
  console.log("Public pages:");
  const pub = await browser.newContext({ viewport: DESK });
  const p = await pub.newPage();
  await shoot(p, "/", "01-home.png", { map: true });
  await shoot(p, "/map", "02-map.png", { map: true });
  await shoot(p, "/find-beds", "03-find-beds.png", { map: true });
  await shoot(p, "/sms", "04-sms.png");
  await shoot(p, "/emergency-guide", "05-emergency-guide.png");
  await shoot(p, "/about", "06-about.png");
  await shoot(p, "/login", "07-login.png");
  await pub.close();

  // ---- Hospital portal --------------------------------------------------
  console.log("Hospital portal:");
  const h = await browser.newContext({ viewport: DESK });
  await login(h, DEMO.hospital);
  await shoot(await h.newPage(), "/dashboard", "08-hospital-dashboard.png");
  await h.close();

  // ---- Ambulance portal -------------------------------------------------
  console.log("Ambulance portal:");
  const a = await browser.newContext({ viewport: DESK });
  await login(a, DEMO.dispatch);
  await shoot(await a.newPage(), "/ambulance", "09-ambulance.png", { map: true });
  await a.close();

  // ---- Admin command center --------------------------------------------
  console.log("Admin portal:");
  const ad = await browser.newContext({ viewport: DESK });
  await login(ad, DEMO.admin);
  const ap = await ad.newPage();
  await shoot(ap, "/admin", "10-admin-dashboard.png", { charts: true });
  await shoot(ap, "/admin/hospitals", "11-admin-hospitals.png");
  await shoot(ap, "/admin/users", "12-admin-users.png");
  await shoot(ap, "/admin/sms", "13-admin-sms.png");
  await shoot(ap, "/admin/audit", "14-admin-audit.png");
  await ad.close();

  // ---- Social media pack (exact aspect ratios, no fullPage) -------------
  console.log("Social pack:");
  const social = [
    { file: "og-1200x630.png", path: "/", vp: { width: 1200, height: 630 } },
    { file: "square-home-1080.png", path: "/", vp: { width: 1080, height: 1080 } },
    { file: "square-map-1080.png", path: "/map", vp: { width: 1080, height: 1080 } },
    { file: "story-home-1080x1920.png", path: "/", vp: { width: 1080, height: 1920 } },
    { file: "square-about-1080.png", path: "/about", vp: { width: 1080, height: 1080 } },
  ];
  for (const s of social) {
    const ctx = await browser.newContext({ viewport: { ...s.vp, deviceScaleFactor: 1 } });
    const pg = await ctx.newPage();
    await shoot(pg, s.path, s.file, { dir: SOCIAL, fullPage: false, map: true });
    await ctx.close();
  }

  await browser.close();
  console.log("\nDone.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
