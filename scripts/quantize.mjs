#!/usr/bin/env node
// Quantizes a binary PPM (P6) into the site's sixteen-color palette with ordered
// Bayer 4x4 dithering and writes it as a PNG. Also writes a second "twinkle" frame
// where isolated bright star pixels drop one step, so the page can alternate them.
//
//   magick source.jpg -resize 640x400! ppm:- | node scripts/quantize.mjs assets/scene-640.png
//
// Zero dependencies. The palette must match styles.css :root.

import { deflateSync } from "node:zlib";
import { writeFileSync, readFileSync } from "node:fs";

const PAL_HEX = [
  "#000000", "#0b0b2a", "#1c1f5c", "#3a2c7c", "#7b3fa3", "#c2508e", "#e5703d", "#f4c454",
  "#f6f1dc", "#a9b1c9", "#5a6382", "#2d3350", "#42c8c8", "#1f8e7c", "#4ed66c", "#d93c3c",
];
const PAL = PAL_HEX.map(h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
// The art never uses the UI-only green and red.
const USABLE = PAL.map((_, i) => i).filter(i => i !== 14 && i !== 15);

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map(r => r.map(v => (v + 0.5) / 16 - 0.5)); // centered on zero

const out = process.argv[2];
const spread = Number(process.argv[3] ?? 48); // dither amplitude in 8-bit units
const snap = Number(process.argv[4] ?? 0);     // pixels this close to a palette color skip the dither (flat fills)
if (!out) { console.error("usage: quantize.mjs <out.png> [spread] [snap] < image.ppm"); process.exit(1); }

// ---------- read PPM ----------
const buf = readFileSync(0);
let pos = 0;
function token() {
  while (pos < buf.length && (buf[pos] === 0x20 || buf[pos] === 0x0a || buf[pos] === 0x0d || buf[pos] === 0x09)) pos++;
  if (buf[pos] === 0x23) { while (buf[pos] !== 0x0a) pos++; return token(); }
  let s = pos;
  while (pos < buf.length && buf[pos] > 0x20) pos++;
  return buf.toString("ascii", s, pos);
}
if (token() !== "P6") { console.error("expected binary PPM (P6)"); process.exit(1); }
const W = Number(token()), H = Number(token()); token(); pos++;
const px = buf.subarray(pos, pos + W * H * 3);

// ---------- nearest palette color, perceptually weighted ----------
let lastDist = 0;
function nearest(r, g, b) {
  let best = 0, bd = Infinity;
  for (const i of USABLE) {
    const p = PAL[i];
    const dr = r - p[0], dg = g - p[1], db = b - p[2];
    const d = dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114;
    if (d < bd) { bd = d; best = i; }
  }
  lastDist = Math.sqrt(bd);
  return best;
}

const idx = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const o = (y * W + x) * 3;
    const flat = snap > 0 ? nearest(px[o], px[o + 1], px[o + 2]) : -1;
    if (flat >= 0 && lastDist <= snap) { idx[y * W + x] = flat; continue; }
    const t = BAYER[y & 3][x & 3] * spread;
    idx[y * W + x] = nearest(px[o] + t, px[o + 1] + t, px[o + 2] + t);
  }
}

// ---------- twinkle frame: isolated ivory/pale pixels step down ----------
const twinkle = new Uint8Array(idx);
let stars = 0;
for (let y = 1; y < H - 1; y++) {
  for (let x = 1; x < W - 1; x++) {
    const i = idx[y * W + x];
    if (i !== 8 && i !== 9) continue;
    let dark = 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = idx[(y + dy) * W + x + dx];
      if (n === 0 || n === 1 || n === 11) dark++;
    }
    if (dark >= 3 && ((x * 7 + y * 13) % 3 === 0)) { twinkle[y * W + x] = i === 8 ? 9 : 10; stars++; }
  }
}

// ---------- PNG (8-bit RGB) ----------
function crc32(b) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < b.length; n++) {
    c = (crc ^ b[n]) & 0xff;
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
function encode(layer) {
  // indexed PNG: PLTE + 1 byte per pixel keeps the files small
  const raw = Buffer.alloc((W + 1) * H);
  for (let y = 0; y < H; y++) {
    raw[y * (W + 1)] = 0;
    for (let x = 0; x < W; x++) raw[y * (W + 1) + 1 + x] = layer[y * W + x];
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 3; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const plte = Buffer.from(PAL.flat());
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr), chunk("PLTE", plte),
    chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0)),
  ]);
}
writeFileSync(out, encode(idx));
const outB = out.replace(/\.png$/, "-b.png");
writeFileSync(outB, encode(twinkle));
const used = new Set(idx).size;
console.log(`${out} ${W}x${H}, ${used} palette entries, ${stars} twinkle pixels -> ${outB}`);
