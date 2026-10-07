#!/usr/bin/env bash
# Waits for finished renders, remixes the audio with the current audio.py (headroom fix), measures loudness/peak.
cd "$(dirname "$0")"
mkdir -p out/qa
while true; do
  for log in out/logs/w*.log; do
    grep -oE "^done v[0-9]+" "$log" 2>/dev/null | sed 's/done v//' | while read -r n; do
      [ -e "out/qa/remixed_$n" ] && continue
      f=$(ls out/daumenstopp_${n}_*.mp4 2>/dev/null | grep -v _draft | head -1); [ -n "$f" ] || continue
      python3 build.py remix "$n" >/dev/null 2>&1 || { echo "remix FAILED v$n" >> out/qa/audio_report.txt; continue; }
      m=$(ffmpeg -i "$f" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' ' | tr '\n' ' ')
      echo "v$n $m" >> out/qa/audio_report.txt
      touch "out/qa/remixed_$n"
    done
  done
  [ "$(ls out/qa/remixed_* 2>/dev/null | wc -l)" -ge 30 ] && break
  sleep 20
done
echo "postprocess complete" >> out/qa/audio_report.txt
