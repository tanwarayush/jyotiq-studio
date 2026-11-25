#!/bin/bash
# Post-render checks for the भारत Ep6 master, adapted from chhathi-maiya/review.sh: specs, loudness and true peak,
# black/freeze detection, five 8-frame contact sheets (every 72 frames from frame 6, so every 2.4 s), and the
# first and last frames side by side, for the third-person viewer review. render_final.sh runs it after RENDER DONE.
# Usage: bash review.sh  (writes into chhathi-maiya/review/final, which survives session restarts)
set -u
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
F=/Users/ayushrajput/.kiro/crew/workspace/mahabharat-ep6/final/${FINAL_NAME:-Bharata_Ep6_Guru_Se_Yuddh_1080x1920}.mp4
TS=/Users/ayushrajput/.kiro/crew/workspace/video/src/Jyotiq/bharata/ep6/timing.ts
R=/Users/ayushrajput/.kiro/crew/workspace/mahabharat-ep6/review/final
mkdir -p "$R"
[ -s "$F" ] || { echo "REVIEW FAILED: no master at $F"; exit 1; }
TOTAL=$(grep -o "TOTAL = [0-9]*" "$TS" | head -1 | grep -o "[0-9]*")
LAST=$((${TOTAL:-1} - 1))
ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate,avg_frame_rate,nb_frames,pix_fmt,color_space,color_primaries,color_transfer,sample_rate,channels,bit_rate:format=duration,size,bit_rate -of default=nw=1 "$F" > "$R/probe.txt"
ffmpeg -hide_banner -i "$F" -vn -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' > "$R/loudness.txt"
ffmpeg -hide_banner -i "$F" -vf "blackdetect=d=0.1:pix_th=0.10,freezedetect=n=-60dB:d=1.0" -an -f null - 2>&1 | grep -E "black_|freeze_" > "$R/blackfreeze.txt"
ffmpeg -v error -y -i "$F" -vf "select='not(mod(n-6\,72))',scale=270:480,tile=4x2" -frames:v 5 -fps_mode vfr "$R/sheet_%d.png"
ffmpeg -v error -y -i "$F" -vf "select='eq(n\,0)+eq(n\,$LAST)',scale=540:960,tile=2x1" -frames:v 1 -fps_mode vfr "$R/firstlast.png"
cat "$R/probe.txt"
echo "--- loudness"
cat "$R/loudness.txt"
echo "--- black/freeze (empty = none)"
cat "$R/blackfreeze.txt"
ls -la "$R"
echo "REVIEW DONE"
