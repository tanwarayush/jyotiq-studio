#!/bin/bash
# Storyboard stills for Ep6 (Bharata6Board: frame i = panel i). Usage: bash board.sh [panel ...]  (no args = all 22)
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
EP=/Users/ayushrajput/.kiro/crew/workspace/mahabharat-ep6
cd /Users/ayushrajput/.kiro/crew/workspace/video || exit 1
B="$EP/render/board_bundle"
[ "${REBUNDLE:-0}" = 1 ] && rm -rf "$B"
[ -f "$B/index.html" ] || npx remotion bundle src/index.ts --out-dir="$B" --public-dir="$EP/render/public" --log=error || exit 1
FR=("$@"); [ ${#FR[@]} -eq 0 ] && FR=($(seq 0 21))
for fr in "${FR[@]}"; do
  n=$(printf "%02d" "$fr")
  npx remotion still "$B" Bharata6Board "$EP/review/board/panel_$n.png" --frame=$fr --scale=0.5 --concurrency=1 --log=error && echo "panel $n ok"
done
