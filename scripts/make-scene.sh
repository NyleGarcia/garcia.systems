#!/usr/bin/env sh
# Rebuilds the hero scene from assets/source/hero.jpg: crop to 16:10, resize to the two
# integer display sizes, and quantize into the sixteen-color palette with ordered dither.
# Needs ImageMagick 7 (magick) and node.
set -e
cd "$(dirname "$0")/.."
SRC=assets/source/hero.jpg
W=$(magick "$SRC" -format %w info:); H=$(magick "$SRC" -format %h info:)
CW=$(( H * 16 / 10 )); [ "$CW" -gt "$W" ] && CW=$W
magick "$SRC" -gravity center -crop ${CW}x${H}+0+0 +repage -resize 640x400! ppm:- | node scripts/quantize.mjs assets/scene-640.png 40
magick "$SRC" -gravity center -crop ${CW}x${H}+0+0 +repage -resize 320x200! ppm:- | node scripts/quantize.mjs assets/scene-320.png 40

# Project icons: eight cells of assets/source/icons.jpg (4x2 contact sheet), 64x64 each.
i=0
for n in gamehail openwave openwave-opendeck gpu-screen-recorder-opendeck cztimer-opendeck countdown-opendeck crunchy-plus ai-skills; do
  col=$(( i % 4 )); row=$(( i / 4 )); x=$(( 172 + 344 * col - 150 )); y=$(( 192 + 384 * row - 150 ))
  # snap the sheet's background to the panel navy so it does not dither into a checker
  magick assets/source/icons.jpg -crop 300x300+${x}+${y} +repage -fuzz 9% -fill '#0b0b2a' -opaque "$(magick assets/source/icons.jpg -format '%[pixel:p{6,6}]' info:)" -resize 64x64! ppm:- | node scripts/quantize.mjs assets/icons/$n.png 40 22 >/dev/null
  rm -f assets/icons/$n-b.png; i=$(( i + 1 ))
done
