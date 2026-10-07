# Daumenstopp · Angebots-Master

`daumenstopp-angebot.html` ist eine einzelne Datei ohne Abhängigkeiten. Sie öffnet sich in jedem Browser, rechnet Preise live und führt den Kunden bis zur Annahme.

## Aufbau des Angebots

| # | Abschnitt | Aufgabe im Verkauf |
|---|---|---|
| – | Intro | Persönliche Ansprache, Kernversprechen, Feed-Animation, die auf dem Kundenvideo stoppt |
| 01 | Ausgangslage | Persönlicher Brief und „Heute → In 90 Tagen“ aus dem Erstgespräch |
| 02 | Warum jetzt | Dringlichkeit: 1,7 Sekunden Aufmerksamkeit im Feed (mit Quelle) |
| 03 | STOPP-Methode | Der USP als benanntes System: **S**croll-Stopper · **T**aktung · **O**ptik · **P**erformance · **P**ipeline |
| 04 | Qualität | Vorher/Nachher-Regler und technisches Datenblatt (4K, Color Grading, −14 LUFS, Safe Zones, QC) |
| 05 | Arbeitsproben | Kennzahlen, drei Video-Mockups, Kundenstimmen |
| 06 | Vergleich | Daumenstopp vs. Inhouse-Editor vs. Freelancer vs. selbst machen |
| 07 | Investition | 3 Pakete (Ankerpreis, Empfehlung, Preis pro Video), Laufzeit-Schalter, Add-ons, Live-Summe |
| 08 | Ablauf | In 7 Tagen live, Kundenaufwand pro Schritt |
| 09 | Garantie | Risikoumkehr |
| 10 | FAQ | Einwände vorab beantworten |
| 11 | Annahme | Countdown, Kapazität, Formular, Versand per WhatsApp oder E-Mail |

## Ein Angebot erstellen (5 Minuten)

1. Datei kopieren, z. B. `angebote/2026-10_muster-gmbh.html`.
2. Ganz oben im `<script>`-Block `window.DAUMENSTOPP` anpassen. Darunter muss nichts geändert werden.
   - **Kunde & Angebot:** Firma, Vorname, Handle, Angebotsnummer, Datum, Gültigkeit (14 Tage).
   - **Brief und Ausgangslage:** zwei, drei Sätze aus dem Erstgespräch. Möglichst die Worte des Kunden verwenden.
   - **Empfehlung:** Paket-ID und eine Begründung in einem Satz.
3. Im Browser öffnen. Oben rechts zeigt ein Zähler, wie viele Platzhalter noch offen sind. Mit **Zeigen ↓** springst du von Stelle zu Stelle. Erst wenn der Zähler verschwunden ist, ist das Angebot versandfertig.

### Platzhalter-System

- `[[Text]]` ist ein Platzhalter und wird rot gestrichelt markiert. Klammern entfernen = Wert bestätigt.
- `{firma}`, `{name}`, `{gruender}`, `{nummer}`, `{gueltig}`, `{datum}` werden im Text automatisch ersetzt.
- `**Text**` wird fett.
- `preiseBestaetigt: true` setzen, sobald die Paketpreise final sind.

### Einmal festlegen (gilt für alle Angebote)

- **Preise, Pakete, Add-ons, Laufzeiten:** Die Beispielpreise sind Vorschläge und müssen von euch bestätigt werden.
- **Agentur:** E-Mail, Telefon, WhatsApp-Nummer (nur Ziffern, z. B. `4917012345678`), Termin-Link, Impressum, Datenschutz, AGB.
- **Kennzahlen, Arbeitsproben, Stimmen:** nur echte Zahlen und echte Zitate. Erfundene Bewertungen sind nach UWG abmahnfähig. Leere Liste bei `stimmen: []` blendet den Abschnitt aus.
- **Videos:** In `arbeitsproben` bei `video` eine öffentlich erreichbare `.mp4`-URL eintragen (9:16, möglichst unter 8 MB). Ohne Video zeigt das Mockup eine animierte Stil-Demo.
- **Garantie:** Nur so stehen lassen, wenn ihr sie wirklich gebt. Text bei Bedarf anpassen.
- **Leistungsversprechen prüfen:** Lieferzeiten, Korrekturschleifen, 4K, −14 LUFS, Vier-Augen-Prinzip, Nutzungsrechte. Alles, was im Angebot steht, wird Vertragsinhalt.

### Personalisierung per Link (bei eigenem Hosting)

Eine gehostete Master-Datei lässt sich per URL personalisieren, ohne sie zu kopieren:

```
https://eure-domain.de/angebot.html?firma=Muster%20GmbH&name=Lisa&voll=Lisa%20Muster&handle=muster.gmbh&nr=DS-2026-014&gueltig=2026-10-21&paket=momentum
```

Brief, Ausgangslage und Sonderpreise brauchen weiterhin eine eigene Kopie.

## Versenden

- **Als Link verschicken, nicht als Anhang.** HTML-Anhänge werden von vielen Mailprogrammen blockiert. Gute Optionen: eigene Domain (`angebot.daumenstopp.de/muster-gmbh`), Netlify Drop (Datei hineinziehen, Link kopieren) oder eine private Claude-Artifact-Seite.
- **Achtung:** Dieses Repository ist öffentlich. Hier nur den Master mit Platzhaltern ablegen, keine ausgefüllten Kundenangebote.
- **PDF:** Datei im Browser öffnen, unten auf **Als PDF speichern** klicken (Hintergrundgrafiken aktivieren). Das PDF behält den dunklen Look, Animationen stehen still.
- Mobil testen: Die meisten Entscheider öffnen den Link zuerst auf dem Handy.

## So holt ihr das Maximum heraus

Kein Dokument garantiert einen Abschluss. Die Abschlussquote steigt aber deutlich, wenn das Angebot Teil eines sauberen Ablaufs ist:

1. **Angebot innerhalb von 24 Stunden nach dem Erstgespräch schicken.** Das Interesse ist dann am höchsten.
2. **Vorher im Call klären:** Budgetrahmen, Entscheider, Startzeitpunkt. Das Angebot bestätigt, was besprochen wurde, und überrascht nicht.
3. **Eine kurze persönliche Videonachricht dazu** (60–90 Sekunden, z. B. per Loom): „Hier ist dein Angebot, das sind die drei Punkte, auf die ich besonders achten würde.“
4. **Nachfassen nach Plan:**
   - **Tag 2:** „Hast du dir das Angebot schon anschauen können? Gibt es Fragen zum Paket Momentum?“
   - **Tag 5:** Ein konkreter Mehrwert, z. B. drei Hook-Ideen für ihren Account. Kein „wollte nur mal nachhaken“.
   - **Tag 12:** Hinweis auf die Gültigkeit: „Das Angebot und die entfallende Onboarding-Pauschale gelten noch bis Freitag. Soll ich euch den Startplatz im November reservieren?“
5. **Annahme sofort bestätigen:** Auftragsbestätigung, Vertrag und Kickoff-Termin innerhalb von 24 Stunden, wie im Angebot versprochen.
