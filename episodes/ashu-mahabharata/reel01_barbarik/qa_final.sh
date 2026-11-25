#!/bin/bash
# Final QA for @ashuanimates reel 1. Writes review artefacts to review/final (ignored by git).
set -u
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
ROOT=/Users/ayushrajput/Documents/Codex/2026-09-11/act-as-a-senior-brand-identity/outputs/jyotiq-studio
F=${1:-$ROOT/video/out/ashuanimates-barbarik/barbarik_reel_v2.mp4}
R=$ROOT/episodes/ashu-mahabharata/reel01_barbarik/review/final
mkdir -p "$R"
[ -s "$F" ] || { echo "REVIEW FAILED: no master at $F"; exit 1; }
ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate,avg_frame_rate,nb_frames,pix_fmt,color_space,color_primaries,color_transfer,sample_rate,channels,bit_rate:format=duration,size,bit_rate -of default=nw=1 "$F" > "$R/probe.txt"
ffmpeg -hide_banner -i "$F" -vn -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' > "$R/loudness.txt"
ffmpeg -hide_banner -i "$F" -vf "blackdetect=d=0.1:pix_th=0.10,freezedetect=n=-60dB:d=1.0" -an -f null - 2>&1 | grep -E "black_|freeze_" > "$R/blackfreeze.txt" || true
# 12 spread frames plus first/end and key story beats.
ffmpeg -v error -y -i "$F" -vf "select='not(mod(n\,197))',scale=270:480,tile=4x3" -frames:v 1 -fps_mode vfr "$R/contact12.png"
for spec in "0 first" "72 hook" "1009 ekpal" "1808 sacrifice" "2046 hill" "2316 endcard"; do
  set -- $spec
  ffmpeg -v error -y -i "$F" -vf "select='eq(n\,$1)',scale=540:960" -frames:v 1 -fps_mode vfr "$R/$2.png"
done
cat "$R/probe.txt"
echo "--- loudness"
cat "$R/loudness.txt"
echo "--- black/freeze (empty = none)"
cat "$R/blackfreeze.txt"
ls -lh "$R"
echo "REVIEW DONE"
