#!/bin/bash
# Canonical local render for @ashuanimates reel 1. Heavy output stays in video/out and is ignored by git.
set -euo pipefail
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
VIDEO="$ROOT/video"
OUT="$VIDEO/out/ashuanimates-barbarik"
MASTER="$OUT/barbarik_reel_v2_master_fullrange.mp4"
FINAL="$OUT/barbarik_reel_v2.mp4"
COVER="$OUT/barbarik_cover.png"

cd "$VIDEO"
mkdir -p "$OUT"
[ -s public/ashuanimates/barbarik/mix.wav ] || {
  echo "missing public/ashuanimates/barbarik/mix.wav; copy the ignored mix physically into video/public first (symlinks do not bundle)" >&2
  exit 1
}

npx remotion render AshuanimatesBarbarik "$MASTER" \
  --codec=h264 \
  --audio-codec=aac \
  --audio-bitrate=320k \
  --crf=12 \
  --pixel-format=yuv420p \
  --concurrency=1 \
  --overwrite

# Remotion's Chrome/encoder path emits full-range yuvj420p on this Mac even when yuv420p is requested.
# Convert range once for the delivery master; keep the render master beside it locally for debugging.
ffmpeg -hide_banner -y -i "$MASTER" \
  -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -preset medium -crf 12 -pix_fmt yuv420p -color_range tv \
  -movflags +faststart -c:a copy "$FINAL"

npx remotion still AshuanimatesBarbarikCover "$COVER" --concurrency=1 --overwrite
bash "$ROOT/episodes/ashu-mahabharata/reel01_barbarik/qa_final.sh" "$FINAL"
echo "RENDER DONE -> $FINAL"
echo "COVER DONE -> $COVER"
