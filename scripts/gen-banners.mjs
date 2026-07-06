// Generates cinematic hospital banner images (SVG) into public/hospitals/.
// Designed placeholders — swap for licensed photography by replacing the files.
import { mkdir, writeFile } from "fs/promises";

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function banner({ sky1, sky2, glow, seed }) {
  const W = 1600, H = 900, ground = 730;
  const rnd = mulberry32(seed);

  // skyline buildings
  const specs = [];
  let x = -20;
  while (x < W + 20) {
    const bw = 70 + Math.floor(rnd() * 80);
    const bh = 130 + Math.floor(rnd() * 300);
    specs.push({ x, bw, bh });
    x += bw + 14 + Math.floor(rnd() * 18);
  }
  // central hospital tower (tall, with red cross)
  const hx = Math.floor(W / 2) - 70;
  const hosp = { x: hx, bw: 150, bh: 470 };

  const windows = (b, lit) => {
    let r = "";
    const cols = Math.max(2, Math.floor(b.bw / 26));
    const rows = Math.max(3, Math.floor(b.bh / 34));
    const pw = 10, ph = 14;
    const gx = (b.bw - cols * pw) / (cols + 1);
    const gy = 26;
    for (let c = 0; c < cols; c++) {
      for (let rr = 0; rr < rows; rr++) {
        const wx = b.x + gx + c * (pw + gx);
        const wy = H - b.bh + 24 + rr * gy;
        if (wy > ground - ph) continue;
        const on = rnd() < (lit ? 0.55 : 0.28);
        r += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="${pw}" height="${ph}" rx="1.5" fill="${on ? "#F6C453" : "#0c2a1f"}" opacity="${on ? 0.85 : 0.5}"/>`;
      }
    }
    return r;
  };

  const buildings = specs
    .map(
      (b) =>
        `<rect x="${b.x}" y="${H - b.bh}" width="${b.bw}" height="${b.bh}" fill="#06160f" opacity="0.92"/>${windows(b, false)}`,
    )
    .join("");

  // ECG line
  let ecg = `M0 ${ground - 90}`;
  for (let i = 0; i < W; i += 150) ecg += ` H${i + 70} l16 -46 l16 90 l16 -70 l12 26 H${i + 150}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="68%" cy="22%" r="55%">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.55"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="cross" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M30 22v16M22 30h16" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#cross)"/>
  <path d="${ecg}" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.12"/>
  ${buildings}
  <!-- hospital tower -->
  <rect x="${hosp.x}" y="${H - hosp.bh}" width="${hosp.bw}" height="${hosp.bh}" fill="#08231a"/>
  ${windows(hosp, true)}
  <g transform="translate(${hosp.x + hosp.bw / 2}, ${H - hosp.bh + 46})">
    <circle r="26" fill="#0F7A45"/>
    <path d="M-12 0H12M0 -12V12" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  </g>
  <rect x="0" y="${ground}" width="${W}" height="${H - ground}" fill="#020d08"/>
  <rect width="${W}" height="${H}" fill="url(#sky)" opacity="0.12"/>
</svg>`;
}

const HOSPITALS = [
  { file: "korle-bu", sky1: "#072a1c", sky2: "#020d08", glow: "#19a35e", seed: 11 },
  { file: "kath", sky1: "#053026", sky2: "#02110c", glow: "#1bbf86", seed: 23 },
  { file: "ugmc", sky1: "#06233a", sky2: "#03110d", glow: "#1f8f6a", seed: 37 },
  { file: "ridge", sky1: "#0a3a26", sky2: "#02120b", glow: "#3fd089", seed: 41 },
  { file: "cape-coast", sky1: "#053a44", sky2: "#02110f", glow: "#22b0a0", seed: 53 },
  { file: "tamale", sky1: "#2a2410", sky2: "#0a2418", glow: "#f0b13c", seed: 67 },
];

await mkdir("public/hospitals", { recursive: true });
for (const h of HOSPITALS) {
  await writeFile(`public/hospitals/${h.file}.svg`, banner(h));
  console.log("  ✓ public/hospitals/" + h.file + ".svg");
}
console.log("Done.");
