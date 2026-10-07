#!/usr/bin/env bash
# Builds a contact sheet (one frame every 3 s) from each final MP4 for a last visual check.
set -e
cd "$(dirname "$0")/out"
mkdir -p qa
for f in daumenstopp_*.mp4; do
  [ -e "$f" ] || continue
  n="${f#daumenstopp_}"; n="${n%%_*}"
  ffmpeg -v error -y -i "$f" -vf "fps=1/3,scale=216:-1,tile=6x8:padding=4:margin=4" -frames:v 1 "qa/sheet_$n.png"
  echo "qa/sheet_$n.png"
done
