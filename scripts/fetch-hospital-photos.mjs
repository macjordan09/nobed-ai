// Fetch royalty-free hospital lead images from Wikimedia (Wikipedia) with license + attribution.
import { mkdir, writeFile } from "fs/promises";

const UA = "noBed.ai-image-fetch/1.0 (educational MVP; macjordan.degadjor@gmail.com)";
const API = "https://en.wikipedia.org/w/api.php";

const HOSPITALS = [
  { slug: "korle-bu", title: "Korle Bu Teaching Hospital" },
  { slug: "kath", title: "Komfo Anokye Teaching Hospital" },
  { slug: "ugmc", title: "University of Ghana Medical Centre" },
  { slug: "ridge", title: "Greater Accra Regional Hospital" },
  { slug: "cape-coast", title: "Cape Coast Teaching Hospital" },
  { slug: "tamale", title: "Tamale Teaching Hospital" },
];

async function j(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

await mkdir("public/hospitals/photos", { recursive: true });
const credits = [];

for (const h of HOSPITALS) {
  try {
    const u = `${API}?action=query&format=json&redirects=1&prop=pageimages&piprop=original|name&titles=${encodeURIComponent(h.title)}`;
    const data = await j(u);
    const pages = data.query?.pages ?? {};
    const page = Object.values(pages)[0];
    const src = page?.original?.source;
    const fileName = page?.pageimage;
    if (!src || !fileName) {
      console.log(`  ✗ ${h.title}: no lead image`);
      credits.push({ ...h, image: null });
      continue;
    }
    // license + attribution
    let license = "unknown", artist = "", credit = "";
    try {
      const li = await j(`${API}?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent("File:" + fileName)}`);
      const meta = Object.values(li.query.pages)[0]?.imageinfo?.[0]?.extmetadata ?? {};
      license = meta.LicenseShortName?.value ?? "unknown";
      artist = (meta.Artist?.value ?? "").replace(/<[^>]+>/g, "").trim();
      credit = (meta.Credit?.value ?? "").replace(/<[^>]+>/g, "").trim();
    } catch {}

    // download
    const ext = src.split(".").pop().split("?")[0].toLowerCase();
    const out = `public/hospitals/photos/${h.slug}.${ext === "jpeg" ? "jpg" : ext}`;
    const img = await fetch(src, { headers: { "User-Agent": UA } });
    const buf = Buffer.from(await img.arrayBuffer());
    await writeFile(out, buf);
    console.log(`  ✓ ${h.title} -> ${out} (${(buf.length / 1024).toFixed(0)}KB, ${license})`);
    credits.push({ ...h, image: out.replace("public", ""), license, artist, source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}` });
  } catch (e) {
    console.log(`  ✗ ${h.title}: ${e.message}`);
    credits.push({ ...h, image: null });
  }
}

await writeFile("public/hospitals/photos/CREDITS.json", JSON.stringify(credits, null, 2));
console.log("\nCredits written to public/hospitals/photos/CREDITS.json");
