---
name: garcia.systems
description: A retro space-sim screen set inside a hyper-modern HUD; sixteen locked colors, a bitmap voice, hairline frames, and air.
colors:
  void: "#000000"
  deep-navy: "#0b0b2a"
  indigo: "#1c1f5c"
  violet: "#3a2c7c"
  purple: "#7b3fa3"
  magenta: "#c2508e"
  orange: "#e5703d"
  amber: "#f4c454"
  ivory: "#f6f1dc"
  pale-slate: "#a9b1c9"
  mid-slate: "#5a6382"
  dark-slate: "#2d3350"
  cyan: "#42c8c8"
  teal: "#1f8e7c"
  green: "#4ed66c"
  red: "#d93c3c"
typography:
  display:
    fontFamily: "DotGothic16, MS Gothic, monospace"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: "64px"
    letterSpacing: "0"
  headline:
    fontFamily: "DotGothic16, MS Gothic, monospace"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: "32px"
    letterSpacing: "0"
  title:
    fontFamily: "Chakra Petch, Segoe UI, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: "28px"
  body:
    fontFamily: "Chakra Petch, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "28px"
  label:
    fontFamily: "DotGothic16, MS Gothic, monospace"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0"
spacing:
  "4": "4px"
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "24": "24px"
  "32": "32px"
  "40": "40px"
  "48": "48px"
components:
  frame:
    backgroundColor: "{colors.deep-navy}"
  title-bar:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.deep-navy}"
    typography: "{typography.label}"
    padding: "0 12px"
  menu-row:
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    padding: "2px 10px"
  menu-row-active:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.deep-navy}"
    typography: "{typography.label}"
    padding: "2px 10px"
  link:
    textColor: "{colors.cyan}"
  link-hover:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.deep-navy}"
  lang-tag:
    textColor: "{colors.pale-slate}"
    typography: "{typography.label}"
    padding: "0 6px"
    height: "22px"
  systems-cell:
    textColor: "{colors.ivory}"
    padding: "4px 12px"
---

# Design System: garcia.systems

## Overview

**Creative North Star: "The Sixteen-Color Bridge"**

A PC-98 space-sim screen docked inside a current HUD. The retro layer is literal and locked: sixteen hard-coded colors, ordered dither for every in-between tone, a bitmap face at integer sizes, and a 320x200 dithered ringed-planet scene shown only at integer scale. The modern layer is restraint around it: one hairline frame grammar, a current geometric body face (Chakra Petch), a large display scale, and generous air on a pure black void.

Density is low-to-medium. Regions are fixed and framed; content inside them reads as a log of rows separated by hairlines. Space imagery lives in exactly one window, the scene; the rest of the page is void and deep-navy panels. Nothing glows, blurs, or rounds.

**Key Characteristics:**
- Locked sixteen-entry palette; every color on the page is one of them.
- Intermediate tones are 4px checkerboard dithers of two palette entries, never blends.
- DotGothic16 for display and readouts at 16/32/48/64px only; Chakra Petch 400/500/600 for copy.
- Hairline (1px dark slate) frames with 12px pale-slate pixel corner brackets on two opposite corners.
- Inversion (ivory ground, navy ink) is the active and title-bar state.
- Stepped motion only: per-row window wipe and a two-frame star twinkle.

## Colors

A cold night palette of navy, indigo, and slate, lit by a warm sunset run (purple to amber) that lives mostly in the art, with ivory as the single text light.

### Primary
- **Ship Amber** (amber): section headings, dates and row keys, system codes, emphasized role text, and the menu pointer at rest. The page's one warm voice in the chrome.
- **Signal Cyan** (cyan): links only. Hover and focus invert it to a cyan ground with navy ink.

### Secondary
- **Burner Orange** (orange): the menu pointer when its row is active. Otherwise art-only.
- **Live Green** (green): the 8px live-status square, and nothing else.

### Tertiary (art and dither only)
- **Indigo** and **Violet** (indigo, violet): the two halves of the 25% dither strip under the title bar; planet and nebula ramps.
- **Purple**, **Magenta**, **Teal** (purple, magenta, teal): scene ramps and favicon only; no chrome role.

### Neutral
- **Void** (void): page ground and the scene backing. The void stays void.
- **Deep Navy** (deep-navy): every framed panel ground, ink on inverted surfaces, `theme-color`.
- **Ivory** (ivory): primary text and every inverted ground (title bar, active menu row, skip link, focus ring).
- **Pale Slate** (pale-slate): secondary text (bio, descriptions, meta, HUD readouts, caption) and frame corner brackets.
- **Mid Slate** (mid-slate): menu row borders, language-tag borders, the 50% divider dither. Decoration only.
- **Dark Slate** (dark-slate): hairline frames, row separators, HUD and status rules, the live label on the inverted title bar.

### Named Rules
**The Locked Sixteen Rule.** Every color in CSS, art, and favicon is one of the sixteen `--c0`..`--c15` entries, mirrored exactly in `scripts/render-art.mjs`. Add no seventeenth color, no alpha tint, no `color-mix`.

**The Dither, Not Blend, Rule.** An in-between tone is an ordered dither of two entries: `repeating-conic-gradient(A 0 25%, B 0 50%) 0 0 / 4px 4px` in CSS, Bayer 4x4 in the art.

**The Decoration Slate Rule.** Mid slate (`--c10`) is borders and dithers only; it never sets text.

**The Reserved Red Rule.** Red (`--c15`) is reserved for errors. It currently appears nowhere; keep it that way until something can actually fail.

## Typography

**Display Font:** DotGothic16 (with MS Gothic, monospace), self-hosted woff2, latin / latin-ext / kana subsets, `font-display: block`.
**Body Font:** Chakra Petch 400/500/600 (with Segoe UI, system-ui, sans-serif), self-hosted latin, `font-display: swap`.

**Character:** A bitmap game-screen voice for names, headings, menus, and readouts, against a squared-off contemporary sans for the sentences people actually read.

### Hierarchy
- **Display** (DotGothic16 400, 32px / 48px at 700px+ / 64px at 1040px+, line-height equal to size, uppercase): the name in the identity frame only. Bold by overprint: `text-shadow: 2px|3px|4px 0 0 currentColor` scaled with the size.
- **Headline** (DotGothic16 400, 32px/32px, uppercase, amber, `2px 0 0 currentColor` overprint): section headings in the log.
- **Title** (Chakra Petch 600, 19px/28px): project and employer names in rows. The role line uses 19px at 500 with its title in 600 amber.
- **Body** (Chakra Petch 400, 17px/28px): all prose; paragraphs cap at 68ch, the bio at 52ch.
- **Label** (DotGothic16 400, 16px/24px, letter-spacing 0, smoothing off, usually uppercase): HUD, menu rows, title bar, caption, dates, system codes, language tags (22px line inside a tag), status line.

### Named Rules
**The Integer Cell Rule.** The bitmap face renders only at 16, 32, 48, or 64px on a 24px row (`--row`), with font smoothing off. Never fractional, never fluid, never `clamp()`.

**The Overprint Bold Rule.** DotGothic16 has one weight. Bitmap bold is a horizontal `text-shadow` of currentColor, 1px per 16px of size; never `font-weight` or faux-bold.

## Layout

A single centered screen, max 1280px, with 16px side gutters (24px at 1040px+) and 32px bottom padding (48px at 1040px+). Order is fixed: HUD strip, upper band, log window, status line.

- **Upper band:** one column with 24px gap and 24px vertical padding; at 1040px+ it becomes `1fr 648px` with 32px gap and padding, identity frame left, scene right.
- **Identity frame padding:** 24px, 32px at 700px+, 40px at 1040px+. The menu docks to the frame bottom (`margin-top: auto`).
- **Log body padding:** 32px 24px 24px, then 40px 32px 32px at 700px+, then 48px 40px 40px at 1040px+.
- **Rows:** single column under 700px; at 700px+ a key column of 144px (176px at 1040px+), widened to 224px / 288px for projects. Rows pad 16px vertically, separated by 1px dark-slate hairlines; the first row has none.
- **Systems grid:** `repeat(auto-fill, minmax(176px, 1fr))`, 8px gap.
- **Section dividers:** 4px-tall 50% dither strips with 32px margin above and below.
- **Spacing rhythm:** 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48px; 24px is the row and default gap.
- **Breakpoints:** 700px (scene to 2x, wider row keys, caption spec and HUD coordinates appear) and 1040px (two-column band, larger display).

## Elevation & Depth

Flat. There are no drop shadows, glows, blurs, or gradients that imply light. Depth comes from three things only: the void behind deep-navy panels, inversion for the foremost state, and dither bands that step between two flat colors. The only `box-shadow` in the system is the 2px ivory focus ring on links, a spread ring with no offset or blur.

### Named Rules
**The No-Light Rule.** Surfaces never cast shadow and never glow. If something needs to come forward, it inverts.

## Shapes

Square everything: no `border-radius` anywhere. Borders are 1px. The one recurring silhouette is the frame bracket: a 12px L in 2px pale slate at the top-left and bottom-right corners of every framed region, sitting over the 1px hairline. Icons are drawn in CSS, never glyphs or emoji: the menu pointer is an 8x12px `clip-path` triangle, and the live indicator is a filled 8px square. The scene raster is `image-rendering: pixelated` at 320x200 (under 700px) or exactly 640x400, never a non-integer scale.

## Components

### Frame
The region primitive. 1px dark-slate border, deep-navy ground, two 12px pale-slate corner brackets (top-left, bottom-right). Used for the identity block, the scene, and the log window. Every region gets one; nothing else does.

### Command Menu (Navigation)
Bordered rows that read like a game menu.
- **Shape:** square, 1px mid-slate border, 2px 10px padding, 4px gap between rows, max 360px wide.
- **Row grid:** 16px pointer cell, label, right-aligned pale-slate hint, 8px gaps, uppercase label voice.
- **Rest:** ivory text, pointer hidden.
- **Active / hover / focus:** the row inverts to an ivory ground with navy ink and ivory border, the hint drops to dark slate, and the orange pointer appears. `aria-current="true"` marks the active row; `main.js` moves it to the section in view (progressive enhancement only).

### Title Bar
Inverted strip across the top of the log window: ivory ground, navy label text, 12px side padding, label left and status right. Directly under it, an 8px indigo/violet 25% dither strip.

### Links
- **Rest:** cyan text, no underline.
- **Hover / focus:** cyan ground, navy ink; focus adds a 2px ivory ring.

### Language Tag (Chip)
Inline square tag after a project name: 1px mid-slate border, pale-slate label text, 0 6px padding, 22px line.

### Systems Cell
Square 1px dark-slate cell, 4px 12px padding, 28px line, Chakra Petch 500 name preceded by an amber bitmap code (MSG, ORC, CLD...) with 10px gap.

### Scene Window (Signature)
The only window into space. Three stacked 320x200 PNGs (stars-a, stars-b, scene) rendered from `scripts/render-art.mjs`, pixelated at 1x or 2x inside a frame. A deep-navy caption block sits bottom-right in pale-slate label type. Stars twinkle in two frames: `2.4s steps(1, end) infinite`, swapping at 56%.

### Window Open (Motion)
The log window wipes open top-down one text row at a time: `clip-path: inset(0 0 100% 0)` to `inset(0)`, `640ms steps(var(--rows), end)`, where `main.js` sets `--rows` to the window's visible height divided by 24px (minimum 8). Both animations sit inside `prefers-reduced-motion: no-preference`; reduced motion shows the final state.

## Do's and Don'ts

### Do:
- **Do** pick every color from the sixteen `--c0`..`--c15` tokens, and update `render-art.mjs` in the same change if the palette ever moves.
- **Do** make in-between tones as 4px two-color checkerboard dithers.
- **Do** set DotGothic16 at 16, 32, 48, or 64px with smoothing off, and bold it by overprint.
- **Do** give every region the hairline frame with pixel corner brackets, and nothing that is not a region.
- **Do** signal active state by inversion to ivory and navy.
- **Do** keep motion stepped (`steps()`), and gate it behind `prefers-reduced-motion: no-preference`.
- **Do** scale raster art by integers only, with `image-rendering: pixelated`.

### Don't:
- **Don't** use gradients for shading, blur, `backdrop-filter`, glow, drop shadows, or rounded corners.
- **Don't** set text in mid slate (`--c10`), or use red (`--c15`) for anything but errors.
- **Don't** use a system or fallback face as a display voice; the bitmap face is self-hosted and blocks until loaded.
- **Don't** use glyph, emoji, or icon-font icons; draw them with `clip-path` or filled squares.
- **Don't** add a starfield or space imagery outside the scene window; the page ground stays pure void.
- **Don't** use eased or continuous tweens; this world moves in frames.
