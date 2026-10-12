# garcia.systems

Personal homepage for Nyle Garcia, served by GitHub Pages at https://garcia.systems.

Plain HTML and CSS, one bitmap font, no build step.

- `index.html`, `styles.css`, `main.js` — the page. Edit content directly in the HTML.
- `assets/` — the sixteen-color space scene at 640x400 and 320x200, two frames each (star twinkle). Source illustration in `assets/source/hero.jpg`; rebuild with `sh scripts/make-scene.sh` (ImageMagick + node; `scripts/quantize.mjs` does the Bayer dither into the palette). `scripts/render-art.mjs` is the older procedural scene, kept for reference.
- `fonts/` — DotGothic16 (SIL Open Font License), Latin and kana subsets.
- `CNAME` — custom domain for GitHub Pages.
