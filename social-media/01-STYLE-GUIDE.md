# Daumenstopp · Social Style Guide (Kinetic System)

Dieses System übersetzt den Referenzstil (Kinetic-Typography-Case-Video, 90 s, 4:5, Schwarz/Gold) in die Daumenstopp-CI aus `angebote/daumenstopp-angebot.html`. Jedes der 30 Skripte in `videos/` verweist auf die hier definierten Bausteine.

---

## 1 · Analyse der Referenz

| Merkmal | Beobachtung | Übernahme für Daumenstopp |
|---|---|---|
| Format | 720 × 900 (4:5), 25 fps, 90 s | 9:16 als Master (1080 × 1920), Flaggschiffe zusätzlich 4:5 (1080 × 1350) |
| Bühne | Schwarz mit feinem Raster, weiche Lichtschleier, Vignette; Kamera schwebt leicht | Identisch, Farben aus CI (siehe 2) |
| Typo | Kondensierte Versalien mit Silber-Verlauf, Akzentwort in Gold, Verbindungswort in dunkler Pill, Flourish in Schreibschrift | Archivo Display, Paper-Verlauf, Akzent Cap-Gelb, Pill in Ink-2, Flourish = Archivo Italic kondensiert |
| Meta-Ebene | Cursor mit Namensschildern, Auswahlrahmen, Graph-Editor, Stagger-Panel, Values-Panel | Cursor tragen Pipeline-Rollen (Editor · QC · CD). UI-Fragmente aus Schnittprogramm statt Design-Tool |
| Beweis-Objekte | Tabelle (CTR, Kosten pro Ergebnis), Bon-Drucker (Umsatz), Zählwerk (Ad Spend), Kommentar-Karten, DM-Postfach, Phone-Mockup, Player mit View-Zählern | Gleiches Repertoire, plus Vorher/Nachher-Regler, Hook-Rate-Balken, Timecode-Leiste 0,0 → 1,7 s |
| 3D | Schwebende Gold-Lettern, 3D-Logo, Klappe, Kamera, Umschlag, Kreditkarte | Gelbe 3D-Lettern „STOPP“, 3D-Daumen, Klappe, Phone. Kein Geld-Imagery (passt nicht zur Marke) |
| Dramaturgie | Hook → Kontext → Zahlen → Social Proof → „3 Dinge“ → Autorität → Vergleich → Angebot mit Risikoumkehr → CTA → Logo | Übernommen als Flaggschiff-Blueprint (siehe 6) |
| Schnittrhythmus | Keine harten Cuts, Morph-Übergänge; Kapitelwechsel bei ca. 16 s, 31 s, 56 s, 68 s, 76 s, 87 s | Kapitel alle 10–15 s, dazwischen fließend. Pattern-Interrupt alle 2–4 s |
| Audio | −14,2 LUFS integriert, LRA 2,0 LU, True Peak +1,2 dBFS (clippt) | −14 LUFS, LRA 3–5 LU, True Peak −1 dBTP (sauberer als Referenz) |

---

## 2 · Farben

| Rolle | Token | Hex | Einsatz |
|---|---|---|---|
| Bühne | `--ink` | `#0B0C0F` | Hintergrund |
| Bühne 2 | `--ink-2` / `--ink-3` | `#121419` / `#1B1E25` | Pills, Karten, Panels |
| Raster | `--line` | `rgba(238,236,230,.09)` | Grid, Trennlinien |
| Primärtext | `--paper` | `#EEECE6` | Kernwörter (Verlauf Paper → `#B9B7B1` von oben nach unten) |
| Akzent | `--cap` | `#FFD43B` | Betonte Wörter, Cursor, Zahlen, Daumen |
| Text auf Akzent | `--cap-ink` | `#17140A` | Text in gelben Pills |
| Daten A | `--clip-r` | `#FF6B8B` | Hook-Variante A, „schlecht“, Vorher |
| Daten B | `--clip-t` | `#3CC9B4` | Hook-Variante B, „gut“, Nachher |
| Daten C | `--clip-v` | `#8E7CFF` | Hook-Variante C, Neutral |
| Alarm | `--rec` | `#FF453A` | REC-Punkt, „weggewischt“, Fehler |
| Gedämpft | `--mute` | `#9296A1` | Quellen, Kleingedrucktes, Pill-Text |

Regel: Pro Frame maximal eine Akzentfarbe plus Paper. Die Clip-Farben nur für Daten und A/B/C-Vergleiche.

## 3 · Typografie

| Rolle | Schrift | Stil | Beispiel |
|---|---|---|---|
| **Kern** | Archivo | wght 800–900, wdth 75–90, Versalien, Tracking −2 %, Verlauf Paper | DER FEED |
| **Akzent** | Archivo | wie Kern, Farbe Cap-Gelb | KEINE ZWEITE CHANCE |
| **Pill** | Instrument Sans | wght 500, 40 % der Kerngröße, Pill-Hintergrund Ink-2, 1 px Line-2, Radius 999 | „deshalb“, „das Ergebnis nach“ |
| **Flourish** | Archivo Italic | wdth 62, wght 600, Cap-Gelb, Rotation −6°, erscheint 6 Frames nach dem Kernwort | *Video* |
| **Daten** | IBM Plex Mono | wght 500, Tabellen, Timecodes, Prozentwerte | `00:00:01:17` · `48 %` |
| **Label** | IBM Plex Mono | wght 500, Versalien, Tracking +12 %, Mute | HOOK-RATE · QUELLE |

Größen bei 1080 × 1920: Kern 150–210 px, Akzent gleich, Pill 56–64 px, Daten 48–72 px. Maximal 4 Wörter gleichzeitig im Kern.

## 4 · Signature-Elemente

1. **Daumenstopp-Moment (Ident, 1,2 s).** Phone-Mockup, Feed scrollt schnell (3 Beiträge/s, Motion Blur). Ein gelber 3D-Daumen setzt auf, der Feed stoppt hart, der Timecode friert ein, der REC-Punkt wird gelb. Logo „Daumenstopp“ erscheint in Archivo. Sound: Scroll-Rauschen → trockener Stopp-Thud (60 Hz) → Klick. Als Outro in jedem Video, als Intro nie.
2. **Timecode-Leiste 0,0 → 1,7 s.** Dünne Linie oben, gelber Punkt wandert. Bei 1,7 s wird sie rot und zeigt „weggewischt“. Visualisiert den Dringlichkeits-Fakt.
3. **Pipeline-Cursor.** Drei Cursor mit gelben Namensschildern: `Editor`, `QC`, `CD`. Sie setzen Elemente, verschieben Keyframes, korrigieren Tippfehler. Sichtbares Vier-Augen-Prinzip.
4. **REC-Block.** Oben links `REC ● 00:00:00:00` in Plex Mono. Zählt real mit. Ab Beat 2 kaum sichtbar, aber da.
5. **Hook-Rate-Balken.** Drei horizontale Balken A/B/C in Clip-Farben mit Prozentwert. Beispielwerte 31 / 48 / 22 % immer mit Label „Beispielwerte“.
6. **Vorher/Nachher-Regler.** Vertikale gelbe Linie mit Griff, links „Roh · S-Log3“ (flach, grau), rechts „Daumenstopp-Edit“ (gegradet, Captions). Griff fährt im Takt.
7. **Review-Pin.** Gelber Pin mit Kommentar-Karte, wie im Review-Link des Kunden. Für Feedback-Szenen.

## 5 · Motion-Regeln

- **Easing:** `ease-out cubic-bezier(.22,1,.36,1)` für Eingänge, `ease-pop cubic-bezier(.34,1.56,.64,1)` für Zahlen und Daumen, `ease-io cubic-bezier(.65,0,.35,1)` für Kamerafahrten (aus der CI).
- **Wort-Eingang:** 8–12 Frames, Scale 70 → 100 %, Blur 12 → 0 px, leichte Y-Bewegung. Akzentwort 4 Frames später als Kern.
- **Wort-Ausgang:** 6 Frames, nach oben oder in die Tiefe. Nie einfach ausblenden.
- **Kamera:** Permanente Drift (Position 2 %, Rotation 0,5°). Kapitelwechsel mit Push-In oder Whip.
- **Pattern-Interrupt:** Spätestens alle 4 s eines davon: Objektwechsel, Farbflash (Gelb 2 Frames), Zoom-Punch, Cursor-Aktion, Sound-Only-Beat (Bild friert, Ton läuft).
- **Kein toter Frame:** Zwischen zwei Beats bleibt immer eine Bewegung (Raster-Drift, Lichtschleier, Timecode).
- **Zahlen:** Immer hochzählen (Zählwerk oder Odometer), nie statisch erscheinen.
- **Safe Zones (9:16):** oben 250 px, unten 420 px, seitlich 60 px. Pills und Cursor dürfen in Safe Zones, Kernwörter nicht.

## 6 · Flaggschiff-Blueprint (75–90 s)

| Kapitel | Zeit | Aufgabe | Objekte |
|---|---|---|---|
| 1 Hook | 0–3 s | Behauptung, die provoziert oder verspricht | Kern + Akzent, Player-Mockup im Hintergrund |
| 2 Kontext | 3–12 s | Problem der Zielgruppe in ihren Worten | Pills, 3D-Lettern |
| 3 Zahlen | 12–28 s | Beweis mit Objekt | Tabelle, Balken, Zählwerk, Regler |
| 4 Social Proof | 28–40 s | Stimmen, Kommentare, Postfach | Kommentar-Karten, Phone |
| 5 Mechanismus | 40–55 s | „So geht das“ in 3–5 Punkten | Karten-Trio/Quintett (STOPP) |
| 6 Vergleich | 55–65 s | Wir vs. Alternative | Zwei Spalten, Zahl gegen Zahl |
| 7 Angebot | 65–80 s | Paket oder Garantie, Risikoumkehr | Klappe, Umschlag, Gelbe Vollfläche |
| 8 CTA + Ident | 80–90 s | Eine Handlung, Daumenstopp-Moment | Phone, Daumen, Logo |

## 7 · Audio

- **Voiceover:** Männlich oder weiblich, 30–45, ruhig, bestimmt, Du-Form. Keine Werbestimme. Tempo 150–165 Wörter pro Minute. Aufnahme trocken, De-Esser, leichte Sättigung.
- **Musik:** Dunkles Bass-Bett, 85–95 BPM, wenig Melodie, lizenzierte Bibliothek. Drop beim Kapitelwechsel „Angebot“.
- **SFX pro Beat:** Wort-Hit (kurzer Sub-Thud + Klick), Pill-Ein (Whoosh 80 ms), Zahl-Zähler (Tick-Rattern), Cursor (Mausklick), Daumenstopp-Moment (Scroll-Rauschen → Stopp-Thud → Klick).
- **Mastering:** −14 LUFS integriert, True Peak −1 dBTP, LRA 3–5 LU. Voiceover 6 dB über Musik.
- **Ohne Ton:** Jedes Video muss stumm funktionieren. On-Screen-Text trägt den Inhalt vollständig.

## 8 · Caption- und Cover-System

- **Caption:** Zeile 1 ist ein zweiter Hook (nie „In diesem Video…“). Zeilen 2–4 liefern Kontext oder einen Aha-Punkt. Letzte Zeile CTA. 3–5 Hashtags: `#daumenstopp` immer, dazu `#shortformcontent #reelsstrategie #contentmarketing #videomarketing #socialmediamarketing` nach Thema.
- **Cover:** Max. 4 Wörter, Kern-Typo auf Ink, gelbes Akzentwort, Daumen-Icon unten rechts. Alle Cover im Grid gleich aufgebaut (Profil wirkt wie ein System).
- **Erste Kommentar-Antwort:** Vorbereitet pro Video (Frage beantworten, Link oder nächsten Schritt nennen).

## 9 · Beweis-Regel

Nur echte Zahlen, echte Projekte, echte Zitate. Alles Unbelegte steht als `[[Platzhalter]]` im Skript. Beispielwerte (z. B. Hook A/B/C 31/48/22 %) tragen im Bild das Label „Beispielwerte“. Die Preise der Pakete sind in der Repo noch nicht bestätigt und erscheinen daher nur als `[[Preis]]`.
