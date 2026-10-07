# Daumenstopp · Social Media

30 produktionsreife Videoskripte für Instagram Reels, TikTok und YouTube Shorts im Stil des Referenzvideos (Kinetic Typography auf Schwarz, Akzent in Daumenstopp-Gelb, Meta-Editor-Ästhetik, Beweis-Objekte als 3D- und UI-Mockups).

## Dateien

| Datei | Inhalt |
|---|---|
| `00-PROMPT-optimiert.md` | Der optimierte Auftrag: Rolle, Markenfakten aus der Repo, Referenzanalyse, Mix, Pflichtstruktur, Abnahmekriterien. Wurde vor der Ausführung erstellt und dann abgearbeitet. |
| `01-STYLE-GUIDE.md` | Visuelles und akustisches System: Farben, Typografie, Signature-Elemente (Daumenstopp-Moment, Timecode-Leiste, Pipeline-Cursor), Motion-Regeln, Flaggschiff-Blueprint, Audio-Spezifikation, Caption-System. |
| `02-CONTENT-PLAN.md` | Alle 30 Videos in einer Tabelle, 10-Wochen-Kalender (3 Videos pro Woche), Schritte vor der Produktion, KPI-Rahmen. |
| `videos/01…30-*.md` | Ein Skript pro Video: Kopfdaten, drei Hook-Varianten, Beat-Tabelle (Zeit · Voiceover · On-Screen · Bild & Motion · Sound), Loop, CTA, Caption, Cover, Produktionsnotizen. |

## Mix

| Typ | Anzahl | Länge | Videos |
|---|---|---|---|
| Flaggschiff (Referenzstil, zusätzlich 4:5) | 8 | 75–90 s | 01–08 |
| Mittel | 12 | 40–60 s | 09–20 |
| Kurz | 10 | 15–30 s | 21–30 |

## Platzhalter

Alles, was noch nicht belegt ist, steht in doppelten eckigen Klammern, wie im Angebot. Vor der Produktion ersetzen oder streichen:

```
grep -rn "\[\[" social-media/videos/
```

Betroffen sind vor allem Kundennamen, Zitate, Kennzahlen, Preise (im Angebot noch nicht bestätigt), Kapazität und Monat. Beispielwerte (Hook A/B/C 31/48/22 %) bleiben als Beispielwerte beschriftet, bis echte Daten vorliegen.

## Quellen

- Marke, STOPP-Methode, Pakete, Ablauf, Garantie, FAQ, CI: `angebote/daumenstopp-angebot.html` (Branch `claude/affectionate-ritchie-23lltg`).
- Referenzvideo: 90 s, 4:5, Kinetic-Typography-Case-Video einer Agentur. Analyse in `01-STYLE-GUIDE.md`, Abschnitt 1.
