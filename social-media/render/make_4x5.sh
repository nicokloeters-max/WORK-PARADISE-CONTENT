#!/usr/bin/env bash
# 4:5 feed versions of the eight flagship videos (center crop of the 9:16 master; HUD at the top falls away).
set -e
cd "$(dirname "$0")/out"
mkdir -p 4x5
for n in 01 02 03 04 05 06 07 08; do
  f=$(ls daumenstopp_${n}_*.mp4 2>/dev/null | grep -v _draft | head -1) || true
  [ -n "$f" ] || { echo "skip $n (not rendered)"; continue; }
  ffmpeg -v error -y -i "$f" -vf "crop=1080:1350:0:285" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart "4x5/${f%.mp4}_4x5.mp4"
  echo "4x5/${f%.mp4}_4x5.mp4"
done
