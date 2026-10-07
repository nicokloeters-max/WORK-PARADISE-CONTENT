# Daumenstopp · Render-Pipeline

Erzeugt aus den 30 Skripten in `../videos/` fertige MP4-Dateien (1080 × 1920, 25 fps, H.264 + AAC, −14 LUFS). Alles läuft lokal und deterministisch: keine Stock-Assets, keine Cloud-Dienste.

## Was passiert

| Schritt | Datei | Inhalt |
|---|---|---|
| Timeline | `timelines/vNN.py` | Beats pro Video: Voiceover-Text, On-Screen-Typo (Pill · KERN · **AKZENT** · *Flourish* · `Daten`), Objekt (Phone, Regler, Balken, Bon, Tabelle, Kurven, 3D-Lettern …), Cursor, Sound-Events. DSL in `timelines/_dsl.py`. |
| Voiceover | `build.py` → Piper | Jeder Beat wird mit der deutschen Piper-Stimme „Thorsten“ synthetisiert. Die Beat-Länge ergibt sich aus der Sprechdauer plus Nachlauf. **Platzhalter-Stimme:** für die Veröffentlichung durch eine echte Sprecherin oder einen Sprecher ersetzen (siehe unten). |
| Bild | `engine.html` + `engine.css` + `engine.js` + `components.js` | Motion-Engine im CI (Ink `#0B0C0F`, Cap-Gelb `#FFD43B`, Archivo / Instrument Sans / IBM Plex Mono). `DS.seek(t)` rendert jeden Zeitpunkt deterministisch; Playwright macht pro Frame einen Screenshot, ffmpeg kodiert. |
| Ton | `audio.py` | Prozedurales Sound-Design (Hit, Stopp-Thud, Whoosh, Ticks, Zählwerk, Drucker, Drop, Pling …), dunkles Bass-Bett (90 BPM), Sidechain unter dem Voiceover, zweistufiges Loudness-Mastering auf −14 LUFS / −1 dBTP. |
| Ident | `components.js` → `ident` | Daumenstopp-Moment als Outro: Feed scrollt, Daumen stoppt, Logo. |

## Ausführen

```bash
cd social-media/render
pip install playwright numpy scipy          # Chromium liegt unter /opt/pw-browsers oder DS_CHROME setzen
python3 build.py preview 22                 # Kontaktbogen in out/preview/
python3 build.py render 22                  # ein Video → out/daumenstopp_22_*.mp4
python3 build.py render 01 02 03            # mehrere
python3 build.py all                        # alle 30
```

Piper: Binary und Stimme werden über `DS_PIPER_BIN` und `DS_PIPER_MODEL` gefunden (Standard: Scratch-Verzeichnis dieser Session). Download: `rhasspy/piper` Release `2023.11.14-2` (Binary) und `v0.0.2` (`voice-de-thorsten-low.tar.gz`).

Pro Video entstehen:

- `out/daumenstopp_NN_slug.mp4` – fertiges Video
- `out/poster_NN.jpg` – Cover-Frame
- `out/cues_NN.json` – Voiceover-Cue-Sheet (Zeitpunkt, Text, Dauer) für die Sprecherin / den Sprecher

## Echte Sprecherstimme einsetzen

1. `out/cues_NN.json` an die Sprecherin / den Sprecher geben. Jeder Eintrag ist ein Beat mit Startzeit.
2. Aufnahmen als `vo/NN/beat_00.wav`, `beat_01.wav`, … ablegen (eine Datei pro Beat, 48 kHz).
3. In `build.py` den `tts()`-Aufruf durch das Laden dieser Dateien ersetzen (Funktion `resolve()`), dann neu rendern. Die Beat-Längen passen sich automatisch an die echten Sprechdauern an.

## 4:5-Version für den Feed

Die Flaggschiffe sind so gebaut, dass der Inhalt im mittleren Band liegt. Für 4:5 reicht ein Crop:

```bash
ffmpeg -i out/daumenstopp_01_*.mp4 -vf "crop=1080:1350:0:285" -c:a copy out/daumenstopp_01_4x5.mp4
```

Der REC-Block und die Timecode-Leiste oben fallen dabei weg.

## Grenzen dieser Fassung

- Stimme ist synthetisch (Piper). Für Social-Posting eine echte Stimme aufnehmen, Timing bleibt erhalten.
- Musikbett ist synthetisch und bewusst minimal. Für die Veröffentlichung ein lizenziertes Bett einsetzen (`bed()` in `audio.py` ersetzen oder `spec['bed']=False`).
- „Footage“ in Phone-Mockups und Regler ist stilisierte Platzhalter-Grafik, kein echtes Material.
- Platzhalter `[[…]]` aus den Skripten erscheinen im Bild, bis sie in den Timelines ersetzt sind (Videos 07, 28, 29 sowie Preisangaben).
