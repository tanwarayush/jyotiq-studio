#!/bin/bash
# Key-frame stills of Bharata6Reel from a preview bundle. Usage: bash stills.sh 0 120 ...   (REBUNDLE=1 after code edits)
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
EP=/Users/ayushrajput/.kiro/crew/workspace/mahabharat-ep6
cd /Users/ayushrajput/.kiro/crew/workspace/video || exit 1
B="$EP/render/preview_bundle"
[ "${REBUNDLE:-0}" = 1 ] && rm -rf "$B"
[ -f "$B/index.html" ] || npx remotion bundle src/index.ts --out-dir="$B" --public-dir="$EP/render/public" --log=error || exit 1
mkdir -p "$EP/review/stills"
for fr in "$@"; do
  npx remotion still "$B" Bharata6Reel "$EP/review/stills/f$fr.png" --frame=$fr --scale=0.5 --concurrency=1 --log=error && echo "still $fr ok"
done
