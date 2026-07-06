// Record an end-to-end workflow video for social media.
// Usage: node scripts/marketing-video.mjs   (dev server must be on :3000)
import { chromium } from "playwright";
import { mkdir, rename, rm } from "fs/promises";

const BASE = "http://localhost:3000";
const VIDEO_DIR = `${process.env.MARKETING_OUT ?? "marketing"}/video`;
const RAW = `${VIDEO_DIR}/raw`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// On-screen caption overlay (re-injected after each navigation).
async function caption(page, text) {
  await page.evaluate((t) => {
    let el = document.getElementById("mkcap");
    if (!el) {
      el = document.createElement("div");
      el.id = "mkcap";
      el.style.cssText =
        "position:fixed;left:50%;bottom:34px;transform:translateX(-50%);z-index:99999;" +
        "background:rgba(1,58,36,.92);color:#fff;font:600 22px/1.3 system-ui,sans-serif;" +
        "padding:12px 22px;border-radius:9999px;box-shadow:0 10px 30px rgba(0,0,0,.35);" +
        "max-width:80vw;text-align:center;backdrop-filter:blur(4px);" +
        "border:1px solid rgba(255,255,255,.25)";
      document.body.appendChild(el);
    }
    el.textContent = t;
  }, text);
}

async function step(name, fn) {
  try {
    await fn();
  } catch (e) {
    console.warn(`  ! step "${name}" issue: ${e.message}`);
  }
}

async function run() {
  await rm(RAW, { recursive: true, force: true });
  await mkdir(RAW, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: RAW, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  const video = page.video();

  // Look up the Ridge hospital id (referral destination we can later log into).
  const hosp = await (await context.request.get(`${BASE}/api/hospitals`)).json();
  const ridge = hosp.hospitals.find((h) => h.name.includes("Ridge"));

  // 1) Landing
  console.log("Scene 1: landing");
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await sleep(1500);
  await caption(page, "NoBed.ai — real-time hospital beds for Ghana");
  await sleep(3500);

  // 2) Live map
  console.log("Scene 2: live map");
  await page.goto(BASE + "/map", { waitUntil: "domcontentloaded" });
  await sleep(3200);
  await caption(page, "Every hospital's capacity, colour-coded and live");
  await step("click pin", async () => {
    await page.locator(".leaflet-marker-icon").nth(3).click({ force: true, timeout: 4000 });
  });
  await sleep(3500);

  // 3) SMS access
  console.log("Scene 3: SMS");
  await page.goto(BASE + "/sms", { waitUntil: "domcontentloaded" });
  await sleep(1000);
  await caption(page, "No smartphone? Just text BED ACCRA");
  await step("send sms", async () => {
    await page.getByRole("button", { name: "Find emergency beds" }).click({ timeout: 4000 });
  });
  await sleep(3800);

  // 4) Sign in as ambulance dispatcher
  console.log("Scene 4: dispatcher login");
  await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
  await sleep(800);
  await caption(page, "Ambulance teams sign in to dispatch");
  await step("login dispatch", async () => {
    await page.locator("button", { hasText: "Ambulance Dispatcher" }).click({ timeout: 4000 });
  });
  await page.waitForURL("**/ambulance", { timeout: 8000 }).catch(() => {});
  await sleep(2500);

  // 5) Submit a referral
  console.log("Scene 5: submit referral");
  await caption(page, "Find a bed and refer the patient in one tap");
  await step("fill referral", async () => {
    await page.getByPlaceholder("e.g. Road traffic accident").fill("Road traffic accident", { timeout: 4000 });
    if (ridge) {
      const dest = page.locator("select").filter({ has: page.locator(`option[value="${ridge.id}"]`) });
      await dest.selectOption(ridge.id);
    }
    await page.getByPlaceholder("e.g. Kasoa, Central Region").fill("Kasoa, Central Region");
  });
  await sleep(1500);
  await step("submit referral", async () => {
    await page.getByRole("button", { name: "Submit referral" }).click({ timeout: 4000 });
  });
  await sleep(3200);

  // 6) Hospital accepts the referral
  console.log("Scene 6: hospital accepts");
  await step("logout", async () => {
    await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
    await context.request.post(`${BASE}/api/auth/login`, {
      data: { email: "admin@ridge.gov.gh", password: "admin123" },
    });
    await page.goto(BASE + "/dashboard", { waitUntil: "domcontentloaded" });
  });
  await sleep(1800);
  await caption(page, "The destination hospital sees it instantly");
  await step("scroll to incoming", async () => {
    await page.getByText("Incoming referrals").scrollIntoViewIfNeeded({ timeout: 4000 });
  });
  await sleep(2000);
  await step("accept", async () => {
    await page.getByRole("button", { name: "Accept" }).first().click({ timeout: 4000 });
  });
  await sleep(3200);

  // 7) Admin oversight
  console.log("Scene 7: admin analytics");
  await context.request.post(`${BASE}/api/auth/login`, {
    data: { email: "super@nobed.ai", password: "super123" },
  });
  await page.goto(BASE + "/admin", { waitUntil: "domcontentloaded" });
  await sleep(2200);
  await caption(page, "Health leaders monitor the whole country");
  await sleep(4000);

  // 8) Closing
  console.log("Scene 8: close");
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await sleep(1200);
  await caption(page, "NoBed.ai — stop guessing where the bed is");
  await sleep(3500);

  await context.close(); // finalizes the video
  await browser.close();

  const raw = await video.path();
  const out = `${RAW}/workflow.webm`;
  await rename(raw, out);
  console.log("Raw video saved:", out);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
