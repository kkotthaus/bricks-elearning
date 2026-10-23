# Seite „Büro-Verwaltung“ auf die Live-Seite übertragen

Die Landingpage für Büro & Verwaltung (Vorlage: `docs/vorlagen/buero-verwaltung/`) besteht aus acht Sections und einem kleinen JavaScript-Snippet. Die Sections liegen als Bricks-Section-Vorlagen in `bricks/templates/buero-verwaltung-*.json`, erzeugt mit `node tools/buero-verwaltung.mjs` (zusammen mit den Clipboard-Dateien `bricks/buero-verwaltung-*.json`). Lokal ist die Seite unter http://weka-e.local/buero-verwaltung/ (ID 10863) zu sehen.

Was in den Vorlagen steckt:

- **Klassen:** 57 eigene Klassen (`office-…`), 10 Schrift-Klassen (`audience-h1` … `audience-h6`, `audience-text-l/m/s/xs`, gemeinsam mit „Zielgruppe“) und die vorhandene Klasse `eyebrow`. Bricks legt fehlende Klassen beim Import an und nimmt vorhandene unverändert. ACSS-Klassen werden nur referenziert.
- **Schriftgrößen:** Jede Überschrift und jeder Text hat als erste Klasse eine Schrift-Klasse (`audience-h1` … `audience-h6`, `audience-text-l`, `-m`, `-s`, `-xs`). Nur diese Klassen setzen die Schriftgröße – ändert man im Builder die Größe einer Schrift-Klasse, ändert sie sich auf „Zielgruppe“ und allen Unterseiten. Die Klasse richtet sich nach der Größe, nicht nach dem Tag (ein `<h3>` in Größe h4 hat `audience-h4`). Eigene Größen behalten Dachzeilen (`eyebrow`, gilt für die ganze Website), Nummern und Paketgrößen, Buttons (ACSS) und das Auswahlfeld des Lösungsfinders.
- **Keine Bilder, keine Icons mit Code** – es muss nichts signiert und nichts in die Mediathek geladen werden. Häkchen und Plus/Minus kommen aus dem CSS der Klassen.
- **Aufklappen** von Themen und Fragen: normale HTML-Elemente `details`/`summary`, ohne Skript.
- **Sprungmarken:** Die Sections haben die IDs `themen`, `pakete`, `loesung` und `kurse`; die Buttons springen dorthin.
- **Auswahlfelder, Empfehlung und Themenfilter** steuert das Snippet „WEKA Büro & Verwaltung – Lösungsfinder“. Bricks erlaubt keine Auswahlfelder als eigenes Element; im Builder stehen die Auswahlmöglichkeiten deshalb als Liste (Texte dort änderbar), im Frontend macht das Snippet daraus Auswahlfelder. Ohne Snippet stehen alle drei Empfehlungen untereinander und die Listen als Text da.

## Regeln des Lösungsfinders

Section „Ihr Weg zur passenden Lösung“: zwei Fragen, danach genau eine von drei Empfehlungen.

| Was benötigen Sie? | Bis zu 50 Mitarbeitende | Mehr als 50 Mitarbeitende |
|---|---|---|
| Mehrere Themen / ein Lernpaket | Flatrate | Beratung |
| Einen einzelnen Kurs | Einzelkurs | Beratung |
| Inhalte für unser eigenes LMS | Beratung (mit Zusatz „– passend zu Ihrem bestehenden LMS“) | Beratung (mit Zusatz) |
| Eine individuelle Lösung / Beratung | Beratung | Beratung |

Umsetzungsregeln:

- Unternehmensgröße = gesamte Belegschaft, nicht Anzahl der zu schulenden Personen. Deshalb heißt die Frage „Wie groß ist Ihr Unternehmen? (gesamte Belegschaft)“.
- Genau 50 Mitarbeitende gehören zu „Bis zu 50“. Ab 51 Mitarbeitenden erfolgt die Empfehlung zum Vertrieb.
- Eigenes LMS oder individuelle Beratung führen unabhängig von der Unternehmensgröße zum Vertrieb.
- Die Empfehlung aktualisiert sich bei jeder Auswahländerung.
- Keine automatische Weiterleitung: Der Nutzer klickt aktiv auf den angezeigten Button.
- Beide Auswahlfelder bleiben sichtbar und veränderbar.
- Vorauswahl entsprechend dem Entwurf: „Bis zu 50 Mitarbeitende“ + „Mehrere Themen / ein Lernpaket“ = Empfehlung Flatrate. Die Vorauswahl ist jeweils die erste Option – die Reihenfolge der Listeneinträge im Builder nicht ändern.

## Vorher auf Live

- [ ] Sicherung (Duplicator: Backup erstellen)
- [ ] WPCodeBox: neues Snippet **„WEKA Büro & Verwaltung – Lösungsfinder“** anlegen
  - Typ **JavaScript**, Inhalt aus `snippets/weka-buero-verwaltung.js`
  - Ausführung „Always“, Einfügepunkt **Frontend Footer**, keine Bedingung (das Skript tut nur etwas, wenn die Sections auf der Seite sind)
  - speichern und aktivieren

## Import

1. Bricks › Templates › **Importieren**.
2. Die acht Dateien `bricks/templates/buero-verwaltung-1-hero.json` … `-8-abschluss.json` in das Feld ziehen (oder „Dateien auswählen“).
3. „Bilder importieren“ nicht anhaken (es gibt keine) → Importieren.
4. In der Liste stehen jetzt „Büro-Verwaltung 1 – Hero“ bis „Büro-Verwaltung 8 – Abschluss“ (Typ Sektion).

## Seite bauen

1. Neue Seite anlegen, Titel „Büro-Verwaltung“, Titelform (Slug) `buero-verwaltung`, als Entwurf; mit Bricks bearbeiten. Übergeordnete Seite ist **Zielgruppe** (Adresse `/zielgruppe/buero-verwaltung/`, entschieden 19.10.2026). Dafür braucht es die Seite „Zielgruppe“ und das Snippet „WEKA Zielgruppe – Unterseiten“, siehe `docs/zielgruppe-auf-live.md`. Gibt es „Zielgruppe“ noch nicht, die Seite zunächst ohne übergeordnete Seite anlegen und später umhängen.
2. Im Builder oben **Templates** (Ordner-Symbol) › „Meine Vorlagen“ › die acht Vorlagen der Reihe nach einfügen (1 bis 8).
3. Speichern und die **Vorschau** öffnen (die Auswahlfelder erscheinen nur im Frontend, im Builder sind es Listen).
4. Prüfen:
   - „Was benötigen Sie?“ umstellen: Die blaue Empfehlung wechselt (Flatrate / Einzelkurs / Beratung). Bei „Inhalte für unser eigenes LMS“ steht im Beratungstext „– passend zu Ihrem bestehenden LMS“.
   - „Mehr als 50 Mitarbeitende“ zeigt immer die Beratung.
   - Button „Lösung für 10 Themen finden“ springt zum Lösungsfinder, stellt „Mehrere Themen / ein Lernpaket“ ein und unter „Die Themen im Überblick“ die Auswahl auf 10 Themen (bei 5 und 15 entsprechend).
   - „Auswahl anzeigen“ zeigt 5, 10 oder alle 15 Themen.
   - Themen und Fragen klappen auf und zu, auch mit der Tastatur (Tab, Enter).
   - In allen Breakpoints ansehen (Desktop, Tablet, Handy).
5. Veröffentlichen, wenn alles stimmt.

## Update 23.10.2026: Paket-Buttons stellen die Themenzahl ein

Nur nötig, wenn die Seite auf Live schon vor dem 23.10.2026 gebaut wurde. Wer die Seite neu baut, bekommt die Änderung mit den Vorlagen und dem Snippet automatisch.

Neu: Die Buttons „Lösung für 5/10/15 Themen finden“ springen wie bisher zum Lösungsfinder und stellen dort „Mehrere Themen / ein Lernpaket“ ein. Zusätzlich stellen sie unter „Die Themen im Überblick“ die Auswahl auf ihre Themenzahl.

1. Sicherung (Duplicator: Backup erstellen).
2. WPCodeBox: Snippet „WEKA Büro & Verwaltung – Lösungsfinder“ öffnen, den ganzen Code durch den Inhalt von `snippets/weka-buero-verwaltung.js` ersetzen, speichern. Prüfen, ob das Snippet noch aktiviert ist.
3. Seite „Büro-Verwaltung“ mit Bricks bearbeiten, Section „Lernpakete“:
   - Button „Lösung für 5 Themen finden“ auswählen › **Stil › Attribute**. Das vorhandene Attribut `data-office-need` = `flat` bleibt. Neues Attribut: Name `data-office-filter`, Wert `5`.
   - Button für 10 Themen: dasselbe mit Wert `10`.
   - Button für 15 Themen: dasselbe mit Wert `15`.
   - Den Link (`#loesung`) nicht ändern. Speichern.
4. Prüfen im Frontend: „Lösung für 10 Themen finden“ klicken – die Seite springt zum Lösungsfinder; weiter unten unter „Die Themen im Überblick“ steht „Auswahl anzeigen“ auf 10 Themen, und es sind 10 Themen zu sehen.

## Inhalte ändern

- Texte, Links und Themen direkt im Builder ändern. Ein Thema gehört über das Attribut `data-office-level` (5, 10 oder 15) zu einer Stufe des Filters.
- Optionen der Auswahlfelder: Listeneintrag im Builder, Wert im Attribut `data-value`. Die Werte `small`/`large` und `flat`/`single`/`lms`/`advice` wertet das Snippet aus – nicht umbenennen.
- Die drei Empfehlungen sind Blöcke mit dem Attribut `data-office-result` (`flat`, `single`, `advice`).
- Die Buttons der Lernpakete springen zum Lösungsfinder (`#loesung`). Attribut `data-office-need` = `flat` stellt dort „Mehrere Themen / ein Lernpaket“ ein, Attribut `data-office-filter` (5, 10 oder 15) stellt den Themenfilter auf diese Zahl (entschieden 23.10.2026).

## Hinweise

- Ziel-URLs (vom Kunden bestätigt am 19.10.2026):
  - **Flatrate:** https://lernen.weka.de/de/e/weka-ecampus-flatrate-unterweisungen-140 – Button der Empfehlung „Flatrate“ und Karte „Flatrate im eCampus“
  - **Einzelkurse:** https://lernen.weka.de/de/t/schulungen-f%C3%BCr-b%C3%BCromitarbeitende – Button der Empfehlung „Einzelkurs“, Karte „Einzelne Kurse“ und 12 der 15 Themen
  - **Vertrieb:** https://www.weka-elearning.de/kontakt/ – Button der Empfehlung „Beratung“ und Karte „Unternehmenslösung“
- Drei Themen verlinken wie im Entwurf direkt auf ihren Kurs: Grundlagen Informationssicherheit (`…/de/e/grundlagen-informationssicherheit-173`), Datenschutz Büro & Verwaltung (`…/de/e/datenschutz-b%C3%BCro-verwaltung-175`), Code of Conduct (`…/de/e/code-of-conduct-156`).
- Der Header des Entwurfs (eigenes Menü „Themen / Lernpakete / Alle Kurse“) ist nicht nachgebaut; die Seite nutzt Header und Footer der Website.
- Alternative ohne Vorlagen: die Clipboard-Dateien `bricks/buero-verwaltung-*.json` öffnen, Inhalt kopieren und im Builder mit Strg+V einfügen.

## Offene Fragen an den Kunden

Themenfilter (Section „Die Themen im Überblick“): Umgesetzt wie im Entwurf. Die Vorgaben dazu macht der Kunde (Stand 19.10.2026).

- **Name der Stufe 15:** Im Filter heißt sie „Alle 15 Themen“, bei den Lernpaketen „Rundum-Paket“. Soll im Filter „Rundum-Paket · 15 Themen“ stehen?
