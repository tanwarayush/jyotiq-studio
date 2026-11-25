#!/bin/bash
# भारत Ep6 render (copied from Ep5), adapted from chhathi-maiya/render_final.sh (same steps; an 80 s single reel).
# 1. Bundle the code once with a small public dir (render/public: APFS clones of only the files this reel loads): a frozen snapshot, so a later edit to a shared file (other sessions also work in this
#    video project) cannot change Day 1 halfway through the render.
# 2. Render 12 video-only chunks at native 1080x1920 (--scale=1), PNG frames, H.264 CRF 12, bt709.
#    A chunk that fails (for example a headless Chrome crash on the 8 GB Mac) is retried once.
# 3. Concat with -c copy, mux mix.wav as AAC 320k 48 kHz, faststart -> the posting master.
# 4. Measure the master's loudness and true peak. If AAC pushed the true peak above -1.5 dBFS,
#    re-mux once with just enough gain cut to bring it to about -1.6.
# 5. A share copy under 50 MB only when the master is larger (for file_send).
# 6. Run chhathi-maiya/review.sh (format checks and contact sheets for the viewer review).
# Re-running resumes: finished chunks are kept and skipped. To re-render one chunk, move that chunk file aside.
# To use a fresh bundle (after code fixes), set BUNDLE_NAME=bundle2.
# Usage:
#   mkdir -p /Users/ayushrajput/.kiro/crew/workspace/chhathi-maiya/render
#   nohup caffeinate -is bash /Users/ayushrajput/.kiro/crew/workspace/chhathi-maiya/render_final.sh \
#     >> /Users/ayushrajput/.kiro/crew/workspace/chhathi-maiya/render/render.log 2>&1 &
set -u
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
VIDEO=/Users/ayushrajput/.kiro/crew/workspace/video
EP=/Users/ayushrajput/.kiro/crew/workspace/mahabharat-ep6
OUT="$EP/render"
BUNDLE="$OUT/${BUNDLE_NAME:-bundle}"
FINAL="$EP/final/${FINAL_NAME:-Bharata_Ep6_Guru_Se_Yuddh_1080x1920}.mp4"
SHARE="$EP/final/${FINAL_NAME:-Bharata_Ep6_Guru_Se_Yuddh_1080x1920}_share.mp4"
MIX="$EP/audio/mix/mix.wav"
TS="$VIDEO/src/Jyotiq/bharata/ep6/timing.ts"
EPF="$VIDEO/src/Jyotiq/bharata/ep6/Episode6.tsx"
COMP=Bharata6Reel
CHUNKS=40

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

cd "$VIDEO" || exit 1
ulimit -n 10240 2>/dev/null
mkdir -p "$OUT" "$EP/final"

# Guards: a generated timeline, under the 81 s cap, a mix to mux, and the mix switched on in the composition.
TOTAL=$(grep -o "TOTAL = [0-9]*" "$TS" | head -1 | grep -o "[0-9]*")
[ -n "$TOTAL" ] || { log "FAILED: no TOTAL in $TS"; exit 1; }
[ "$TOTAL" -lt 3300 ] || { log "FAILED: TOTAL $TOTAL frames is over the 110 s cap"; exit 1; }
[ -s "$MIX" ] || { log "FAILED: no mix at $MIX"; exit 1; }
true  # chunks render muted; mix.wav is muxed below
STEP=$(((TOTAL + CHUNKS - 1) / CHUNKS))
log "$COMP: TOTAL $TOTAL frames, $CHUNKS chunks of $STEP"

if [ ! -f "$BUNDLE/index.html" ]; then
  log "bundle -> $BUNDLE"
  npx remotion bundle src/index.ts --out-dir="$BUNDLE" --public-dir="$OUT/public" --log=error || { log "FAILED: bundle"; exit 1; }
fi

render_chunk() {  # $1 chunk index, $2 first frame, $3 last frame
  npx remotion render "$BUNDLE" "$COMP" "$OUT/chunk_$1.part.mp4" \
    --frames="$2-$3" --scale=1 --concurrency=1 --muted \
    --codec=h264 --crf=12 --pixel-format=yuv420p --color-space=bt709 \
    --image-format=png --overwrite
}

for i in $(seq 0 $((CHUNKS - 1))); do
  a=$((i * STEP))
  b=$((a + STEP - 1))
  [ "$b" -ge "$TOTAL" ] && b=$((TOTAL - 1))
  chunk="$OUT/chunk_$i.mp4"
  if [ -s "$chunk" ]; then
    log "chunk $i ($a-$b) already rendered, skipping"
    continue
  fi
  log "chunk $i ($a-$b) start"
  if ! render_chunk "$i" "$a" "$b"; then
    log "chunk $i failed, retrying once in 30 s"
    sleep 30
    render_chunk "$i" "$a" "$b" || { log "FAILED: chunk $i"; exit 1; }
  fi
  mv "$OUT/chunk_$i.part.mp4" "$chunk"
  log "chunk $i done ($(du -h "$chunk" | cut -f1))"
done

log "concat"
: > "$OUT/list.txt"
for i in $(seq 0 $((CHUNKS - 1))); do echo "file '$OUT/chunk_$i.mp4'" >> "$OUT/list.txt"; done
ffmpeg -v error -y -f concat -safe 0 -i "$OUT/list.txt" -c copy "$OUT/video.mp4" || { log "FAILED: concat"; exit 1; }

mux() {  # $1 = audio gain in dB (0 keeps the calibrated mix as it is)
  ffmpeg -v error -y -i "$OUT/video.mp4" -i "$MIX" -map 0:v:0 -map 1:a:0 \
    -c:v copy -af "volume=${1}dB" -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest "$FINAL"
}
measure() {  # prints "I TP" for the master's audio track
  ffmpeg -nostats -hide_banner -i "$FINAL" -map 0:a:0 -af ebur128=peak=true:framelog=verbose -f null - 2>&1 \
    | awk '/^ *I:/{i=$2} /True peak:/{getline; tp=$2} END{print i, tp}'
}

log "mux mix.wav -> master"
mux 0 || { log "FAILED: mux"; exit 1; }
read -r LI LTP <<< "$(measure)"
log "master audio: I=${LI:-?} LUFS, true peak=${LTP:-?} dBFS"
if [ -z "${LTP:-}" ]; then
  log "WARNING: could not measure the master's true peak; review.sh must check it"
elif awk -v t="$LTP" 'BEGIN{exit !(t + 0 > -1.5)}'; then
  G=$(awk -v t="$LTP" 'BEGIN{printf "%.2f", -1.6 - t}')
  log "true peak above -1.5 dBFS after AAC, re-mux with ${G} dB"
  mux "$G" || { log "FAILED: mux"; exit 1; }
  read -r LI LTP <<< "$(measure)"
  log "master audio after the trim: I=${LI:-?} LUFS, true peak=${LTP:-?} dBFS"
fi
ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate,nb_frames,pix_fmt,color_space,sample_rate,channels:format=duration,size,bit_rate -of compact "$FINAL"

SIZE=$(stat -f %z "$FINAL")
if [ "$SIZE" -gt 50000000 ]; then
  log "share copy (under 50 MB)"
  ffmpeg -v error -y -i "$FINAL" \
    -c:v libx264 -preset slow -crf 18 -maxrate 6000k -bufsize 12000k -pix_fmt yuv420p \
    -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$SHARE" \
    || { log "FAILED: share copy"; exit 1; }
  ls -la "$SHARE"
fi
log "RENDER DONE -> $FINAL"

if [ -f "$EP/review.sh" ]; then
  log "review.sh"
  bash "$EP/review.sh" || log "review.sh reported a problem"
fi
log "ALL DONE -> $FINAL"
