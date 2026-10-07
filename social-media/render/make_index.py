#!/usr/bin/env python3
"""Writes ../VIDEOS.md: index of rendered videos with duration, size and loudness."""
import os, re, json, subprocess, glob
HERE=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(HERE,'out')
plan=open(os.path.join(HERE,'..','02-CONTENT-PLAN.md'),encoding='utf-8').read()
titles={m.group(1):m.group(2).strip() for m in re.finditer(r'^\| (\d\d) \| ([^|]+) \|',plan,re.M)}
rows=[]
for f in sorted(glob.glob(os.path.join(OUT,'daumenstopp_*.mp4'))):
    if f.endswith('_draft.mp4'): continue
    n=os.path.basename(f).split('_')[1]
    pr=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration,size','-of','json',f],capture_output=True,text=True)
    j=json.loads(pr.stdout)['format']; dur=float(j['duration']); size=int(j['size'])/1e6
    lu=subprocess.run(['ffmpeg','-i',f,'-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
    m=re.search(r'I:\s+(-?[\d.]+) LUFS',lu.split('Summary')[-1]); lufs=m.group(1) if m else '?'
    cues=os.path.join(OUT,f'cues_{n}.json'); nb=len(json.load(open(cues))['cues']) if os.path.exists(cues) else '?'
    rows.append((n,titles.get(n,''),dur,size,lufs,nb,os.path.basename(f)))
lines=['# Daumenstopp · Gerenderte Videos','','Alle Videos 1080 × 1920, 25 fps, H.264 + AAC. Erzeugt mit `render/build.py`. Stimme: Piper „Thorsten“ (Platzhalter für echte Sprecherin / echten Sprecher).','',
       '| # | Titel | Länge | Größe | Lautheit | VO-Beats | Datei |','|---|---|---|---|---|---|---|']
for n,t,d,s,l,nb,fn in rows: lines.append(f'| {n} | {t} | {d:.1f} s | {s:.1f} MB | {l} LUFS | {nb} | `render/out/{fn}` |')
tot=sum(r[2] for r in rows)
lines+=['',f'**{len(rows)} Videos · {tot/60:.1f} Minuten Gesamtlaufzeit.** Poster-Frames: `render/out/poster_NN.jpg`, Voiceover-Cue-Sheets: `render/out/cues_NN.json`.']
open(os.path.join(HERE,'..','VIDEOS.md'),'w',encoding='utf-8').write('\n'.join(lines)+'\n')
print('\n'.join(lines))
