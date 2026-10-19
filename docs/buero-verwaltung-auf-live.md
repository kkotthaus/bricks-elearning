# Seite „Büro-Verwaltung“ auf die Live-Seite übertragen

Die Landingpage für Büro & Verwaltung (Vorlage: `docs/vorlagen/buero-verwaltung/`) besteht aus acht Sections und einem kleinen JavaScript-Snippet. Die Sections liegen als Bricks-Section-Vorlagen in `bricks/templates/buero-verwaltung-*.json`, erzeugt mit `node tools/buero-verwaltung.mjs` (zusammen mit den Clipboard-Dateien `bricks/buero-verwaltung-*.json`). Lokal ist die Seite unter http://weka-e.local/buero-verwaltung/ (ID 10863) zu sehen.

Was in den Vorlagen steckt:

- **Klassen:** 57 eigene Klassen (alle beginnen mit `office-`) und die vorhandene Klasse `eyebrow`. Bricks legt fehlende Klassen beim Import an und nimmt vorhandene unverändert. ACSS-Klassen werden nur referenziert.
- **Keine Bilder, keine Icons mit Code** – es muss nichts signiert und nichts in die Mediathek geladen werden. Häkchen und Plus/Minus kommen aus dem CSS der Klassen.
- **Aufklappen** von Themen und Fragen: normale HTML-Elemente `details`/`summary`, ohne Skript.
- **Sprungmarken:** Die Sections haben die IDs `themen`, `pakete`, `loesung` und `kurse`; die Buttons springen dorthin.
- **Auswahlfelder, Empfehlung und Themenfilter** steuert das Snippet „WEKA Büro & Verwaltung – Lösungsfinder“. Bricks erlaubt keine Auswahlfelder als eigenes Element; im Builder stehen die Auswahlmöglichkeiten deshalb als Liste (Texte dort änderbar), im Frontend macht das Snippet daraus Auswahlfelder. Ohne Snippet stehen alle drei Empfehlungen untereinander und die Listen als Text da.

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

1. Neue Seite anlegen, Titel „Büro-Verwaltung“, Titelform (Slug) `buero-verwaltung`, als Entwurf; mit Bricks bearbeiten.
2. Im Builder oben **Templates** (Ordner-Symbol) › „Meine Vorlagen“ › die acht Vorlagen der Reihe nach einfügen (1 bis 8).
3. Speichern und die **Vorschau** öffnen (die Auswahlfelder erscheinen nur im Frontend, im Builder sind es Listen).
4. Prüfen:
   - „Was benötigen Sie?“ umstellen: Die blaue Empfehlung wechselt (Flatrate / Einzelkurs / Beratung). Bei „Inhalte für unser eigenes LMS“ steht im Beratungstext „– passend zu Ihrem bestehenden LMS“.
   - „Mehr als 50 Mitarbeitende“ zeigt immer die Beratung.
   - Button „Lösung für 10 Themen finden“ springt zum Lösungsfinder und stellt „Mehrere Themen / ein Lernpaket“ ein.
   - „Auswahl anzeigen“ zeigt 5, 10 oder alle 15 Themen.
   - Themen und Fragen klappen auf und zu, auch mit der Tastatur (Tab, Enter).
   - In allen Breakpoints ansehen (Desktop, Tablet, Handy).
5. Veröffentlichen, wenn alles stimmt.

## Inhalte ändern

- Texte, Links und Themen direkt im Builder ändern. Ein Thema gehört über das Attribut `data-office-level` (5, 10 oder 15) zu einer Stufe des Filters.
- Optionen der Auswahlfelder: Listeneintrag im Builder, Wert im Attribut `data-value`. Die Werte `small`/`large` und `flat`/`single`/`lms`/`advice` wertet das Snippet aus – nicht umbenennen.
- Die drei Empfehlungen sind Blöcke mit dem Attribut `data-office-result` (`flat`, `single`, `advice`).

## Hinweise

- Die Links führen zu lernen.weka.de (Flatrate, Einzelkurse, drei einzelne Kurse) und zur Kontaktseite von weka-elearning.de – so wie im Entwurf. Vor dem Veröffentlichen prüfen, ob sie stimmen.
- Der Header des Entwurfs (eigenes Menü „Themen / Lernpakete / Alle Kurse“) ist nicht nachgebaut; die Seite nutzt Header und Footer der Website.
- Alternative ohne Vorlagen: die Clipboard-Dateien `bricks/buero-verwaltung-*.json` öffnen, Inhalt kopieren und im Builder mit Strg+V einfügen.
