#!/usr/bin/env node
// Renders the sixteen-color space scene for garcia.systems as indexed-looking RGBA PNGs.
// Zero dependencies. Every intermediate tone is an ordered (Bayer 4x4) dither of two
// palette entries; no true blends exist anywhere in the output.
//
//   node scripts/render-art.mjs            -> assets/scene.png, assets/stars-a.png, assets/stars-b.png
//
// Virtual resolution is 320x200. The page displays it at integer multiples only.

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const W = 320, H = 200;

// The locked palette. Index numbers are referenced below; hex values mirror styles.css.
const PAL = [
  "#000000", // 0 void
  "#0b0b2a", // 1 deep navy
  "#1c1f5c", // 2 indigo
  "#3a2c7c", // 3 violet
  "#7b3fa3", // 4 purple
  "#c2508e", // 5 magenta
  "#e5703d", // 6 orange
  "#f4c454", // 7 amber
  "#f6f1dc", // 8 ivory
  "#a9b1c9", // 9 pale slate
  "#5a6382", // 10 mid slate
  "#2d3350", // 11 dark slate
  "#42c8c8", // 12 cyan
  "#1f8e7c", // 13 teal
  "#4ed66c", // 14 green
  "#d93c3c", // 15 red
].map(h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map(r => r.map(v => (v + 0.5) / 16));

// ---------- deterministic noise ----------
let seed = 20261012;
function rand() { // mulberry32
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const GRID = 64;
const lattice = new Float32Array(GRID * GRID);
for (let i = 0; i < lattice.length; i++) lattice[i] = rand();
function lat(x, y) { return lattice[((y % GRID + GRID) % GRID) * GRID + ((x % GRID + GRID) % GRID)]; }
function smooth(t) { return t * t * (3 - 2 * t); }
function value(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const fx = smooth(x - xi), fy = smooth(y - yi);
  const a = lat(xi, yi), b = lat(xi + 1, yi), c = lat(xi, yi + 1), d = lat(xi + 1, yi + 1);
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}
function fbm(x, y, oct = 5) {
  let s = 0, amp = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += amp * value(x * f, y * f); amp *= 0.5; f *= 2; }
  return s;
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Dither a continuous position along a ramp of palette indices into one index.
function ramp(indices, t, x, y) {
  const f = clamp(t, 0, 1) * (indices.length - 1);
  const i = Math.floor(f);
  if (i >= indices.length - 1) return indices[indices.length - 1];
  return (f - i) > BAYER[y & 3][x & 3] ? indices[i + 1] : indices[i];
}

// ---------- buffers ----------
function makeLayer() { return new Int16Array(W * H).fill(-1); } // -1 = transparent
const scene = makeLayer();
const starsA = makeLayer();
const starsB = makeLayer();

// ---------- stars ----------
const STAR_RAMP = [10, 9, 8];
const stars = [];
for (let i = 0; i < 230; i++) {
  const x = Math.floor(rand() * W), y = Math.floor(rand() * H);
  const b = rand();
  stars.push({ x, y, b });
}
function plotStar(layer, s, brightnessShift) {
  const b = clamp(s.b + brightnessShift, 0, 0.999);
  const idx = STAR_RAMP[Math.floor(b * STAR_RAMP.length)];
  layer[s.y * W + s.x] = idx;
  if (b > 0.93) { // bright stars grow a one-pixel cross
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const xx = s.x + dx, yy = s.y + dy;
      if (xx >= 0 && xx < W && yy >= 0 && yy < H) layer[yy * W + xx] = 10;
    }
  }
}
stars.forEach((s, i) => {
  plotStar(starsA, s, 0);
  plotStar(starsB, s, (i % 3 === 0) ? -0.4 : (i % 7 === 0 ? 0.3 : 0));
});

// ---------- nebula ----------
// Two bodies: a magenta-violet mass top-left of the frame, a teal wisp crossing under it.
const NEB_RAMP = [-1, 1, 2, 3, 4, 5, 6, 7];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const nx = x / W, ny = y / H;
    // main mass
    const dx = nx - 0.34, dy = ny - 0.36;
    const fall = Math.exp(-(dx * dx * 4.5 + dy * dy * 7.5));
    const n = fbm(x * 0.013 + 3.1, y * 0.016 + 7.7, 6);
    let t = clamp((n - 0.38) * 2.4, 0, 1) * fall;
    t = Math.pow(t, 1.15);
    let idx = ramp(NEB_RAMP, t, x, y);
    if (idx !== -1) scene[y * W + x] = idx;
  }
}

// ---------- ringed planet ----------
const PC = { x: 236, y: 158, r: 66 };
const L = (() => { const v = [-0.55, -0.6, 0.58]; const m = Math.hypot(...v); return v.map(c => c / m); })();
const PLANET_RAMP = [1, 3, 4, 5, 6, 7, 8];
const RING_IN = 86, RING_OUT = 142, RING_FLAT = 0.26;
const RING_RAMP = [11, 10, 9, 8];
function ringAt(x, y) {
  const ex = (x - PC.x), ey = (y - PC.y) / RING_FLAT;
  const r = Math.hypot(ex, ey);
  if (r < RING_IN || r > RING_OUT) return -1;
  const u = (r - RING_IN) / (RING_OUT - RING_IN);
  // gaps and density bands of the ring system
  let dens = 0.55 + 0.45 * Math.sin(u * 28.0) * Math.sin(u * 7.3 + 1.1);
  if (u > 0.36 && u < 0.43) dens *= 0.08;      // Cassini-style gap
  if (u > 0.78 && u < 0.81) dens *= 0.25;
  dens *= 1 - Math.pow(u, 3) * 0.6;
  // the planet's shadow falls on the ring behind it (upper half, right side)
  const behind = y < PC.y;
  if (behind && Math.abs(x - PC.x) < PC.r * 0.9 && x > PC.x - 10) dens *= 0.15;
  return ramp(RING_RAMP, dens, x, y);
}
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = x - PC.x, dy = y - PC.y;
    const d2 = dx * dx + dy * dy;
    const inside = d2 <= PC.r * PC.r;
    const ring = ringAt(x, y);
    const ringInFront = y >= PC.y;
    if (ring !== -1 && !inside) { scene[y * W + x] = ring; continue; }
    if (ring !== -1 && inside && ringInFront) { scene[y * W + x] = ring; continue; }
    if (!inside) continue;
    const nxp = dx / PC.r, nyp = dy / PC.r;
    const nzp = Math.sqrt(Math.max(0, 1 - nxp * nxp - nyp * nyp));
    const shade = nxp * L[0] + nyp * L[1] + nzp * L[2];
    // latitude bands warped by noise
    const lat = Math.asin(clamp(nyp, -1, 1));
    const warp = (fbm(x * 0.05 + 40, y * 0.05 + 40, 3) - 0.5) * 0.9;
    const band = 0.5 + 0.5 * Math.sin(lat * 13 + warp * 2.2 + nxp * 0.6);
    const limb = Math.pow(nzp, 0.35);
    let v = clamp(shade, -0.2, 1);
    v = (v + 0.2) / 1.2;
    v = Math.pow(v, 1.3) * limb * (0.62 + 0.38 * band);
    let idx = ramp(PLANET_RAMP, v, x, y);
    if (shade < -0.02) idx = ramp([0, 1], clamp(-shade * 3, 0, 1), x, y) === 0 ? 1 : 1;
    scene[y * W + x] = idx;
  }
}

// ---------- a small moon, lit from the same side ----------
const MOON = { x: 92, y: 158, r: 9 };
for (let y = MOON.y - MOON.r; y <= MOON.y + MOON.r; y++) {
  for (let x = MOON.x - MOON.r; x <= MOON.x + MOON.r; x++) {
    const dx = x - MOON.x, dy = y - MOON.y;
    if (dx * dx + dy * dy > MOON.r * MOON.r) continue;
    const nxp = dx / MOON.r, nyp = dy / MOON.r;
    const nzp = Math.sqrt(Math.max(0, 1 - nxp * nxp - nyp * nyp));
    const shade = nxp * L[0] + nyp * L[1] + nzp * L[2];
    const v = clamp((shade + 0.15) / 1.15, 0, 1);
    scene[y * W + x] = ramp([1, 11, 10, 9, 8], v, x, y);
  }
}

// ---------- a distant station: a handful of lit pixels in a cross with a solar panel ----------
const ST = { x: 160, y: 118 };
const stationPixels = [[0, 0, 8], [1, 0, 9], [-1, 0, 9], [0, 1, 10], [0, -1, 10], [3, 0, 12], [4, 0, 12], [5, 0, 12], [-3, 0, 12], [-4, 0, 12], [-5, 0, 12]];
for (const [dx, dy, idx] of stationPixels) scene[(ST.y + dy) * W + ST.x + dx] = idx;

// ---------- a shooting star, upper right, fading along its tail ----------
for (let i = 0; i < 26; i++) {
  const x = 286 - i * 2, y = 22 + i;
  if (x < 0 || x >= W || y >= H) continue;
  const t = i / 26;
  scene[y * W + x] = t < 0.15 ? 8 : t < 0.5 ? 9 : 10;
  if (i % 2 === 0 && t < 0.5) scene[y * W + x + 1] = t < 0.15 ? 9 : 10;
}

// ---------- a small ship crossing toward the planet, engine lit ----------
// Rows are strings; '.' is transparent, letters map to palette indices.
const SHIP = [
  "......ab.........",
  "...cabbbbb.......",
  "ddcabbbbbbbbbb...",
  "...cabbbbb.......",
  "......ab.........",
];
const SHIP_MAP = { a: 9, b: 11, c: 12, d: 12 };
const SHIP_AT = { x: 118, y: 172 };
SHIP.forEach((row, ry) => {
  [...row].forEach((ch, rx) => {
    if (ch === '.') return;
    const x = SHIP_AT.x + rx, y = SHIP_AT.y + ry;
    if (x < W && y < H) scene[y * W + x] = SHIP_MAP[ch];
  });
});
// the engine wash trails off in dithered cyan
for (let i = 1; i < 7; i++) {
  const x = SHIP_AT.x - i, y = SHIP_AT.y + 2;
  if (x < 0) break;
  if (BAYER[y & 3][x & 3] < 1 - i / 7) scene[y * W + x] = i < 3 ? 12 : 13;
}

// ---------- PNG encoding ----------
function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePNG(layer) {
  const raw = Buffer.alloc((W * 4 + 1) * H);
  for (let y = 0; y < H; y++) {
    raw[y * (W * 4 + 1)] = 0;
    for (let x = 0; x < W; x++) {
      const idx = layer[y * W + x];
      const o = y * (W * 4 + 1) + 1 + x * 4;
      if (idx === -1) { raw[o] = raw[o + 1] = raw[o + 2] = raw[o + 3] = 0; continue; }
      const [r, g, b] = PAL[idx];
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync("assets", { recursive: true });
writeFileSync("assets/scene.png", encodePNG(scene));
writeFileSync("assets/stars-a.png", encodePNG(starsA));
writeFileSync("assets/stars-b.png", encodePNG(starsB));
const used = new Set([...scene, ...starsA, ...starsB].filter(i => i !== -1));
console.log(`wrote assets/scene.png assets/stars-a.png assets/stars-b.png (${W}x${H}), palette entries used: ${used.size}/16`);
