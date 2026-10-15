# Seite „Referenzen-neu“ auf die Live-Seite übertragen

Die sechs Sections liegen als Bricks-Section-Vorlagen in `bricks/templates/`. Sie werden auf Live per Drag & Drop importiert und dann in die Seite eingefügt. Erzeugt werden sie mit `node tools/referenzen-neu.mjs` (zusammen mit den Clipboard-Dateien `bricks/referenzen-neu-*.json`).

Die Vorlagen sind so gebaut, dass sie ohne Nacharbeit an Code funktionieren:

- **Symbole** sind Bricks-Icon-Elemente – kein SVG-Code, also keine Code-Signatur nötig:
  - Kennzahlen im Hero und Vorteile: eigene Linien-Icons nach der Vorlage, SVG-Dateien aus `assets/icons/` in der Mediathek (`weka-gebaeude`, `weka-doktorhut`, `weka-personen`, `weka-schild`, `weka-medaille`, `weka-zahnrad`, `weka-bildschirm`, `weka-diagramm`).
  - Branchenkarten, Häkchen, Bewertungs-Plakette: Font Awesome 6.
  - **Variante zum Zurückwechseln:** `referenzen-neu-1-hero-fa.json` und `referenzen-neu-4-vorteile-fa.json` mit den bisherigen Font-Awesome-Icons (ohne Mediathek-Dateien).
- **Klassen** (56 eigene + `eyebrow`, `check-list`) stecken in den Vorlagen. Bricks legt fehlende Klassen beim Import an und nimmt vorhandene (gleiche ID oder gleicher Name) unverändert. ACSS-Klassen werden nur referenziert.
- **Bilder** (6 Fotos, 2 Siegel) werden beim Import zu Platzhaltern – Live kann die lokalen Bilder nicht laden. Die Bilder werden auf Live in der Mediathek ausgewählt.

## Vorher auf Live

- [ ] Sicherung (Duplicator: Backup erstellen)
- [ ] WPCodeBox: neues PHP-Snippet „WEKA Proven Expert – Bewertung“ anlegen, Inhalt aus `snippets/weka-proven-expert-bewertung.php`, Ausführung „Always“, Einfügepunkt Root, aktivieren. Ohne das Snippet bleiben Note, Anzahl und Sterne leer.
- [ ] Die acht SVG-Dateien aus `assets/icons/` in die Mediathek hochladen (Medien › Datei hinzufügen, alle acht auf einmal hineinziehen). SVG-Upload muss erlaubt sein (Bricks › Einstellungen › Allgemein › „SVG-Uploads“ für Administratoren).
- [ ] Prüfen, dass die Referenzen mit den IDs 4120 (Deutsche Bahn), 9298 (Samsung SDI), 9297 (RheinEnergie), 9283 (Duravit), 2750 (Thyssengas), 2751 (Sparkasse Leipzig) auf Live existieren und „aktiv“ sind (Referenzen › Liste, ID per Maus über dem Titel). Weichen IDs ab: nach dem Einfügen im Loop „Logo“ unter Abfrage › Einschließen die richtigen Referenzen wählen.

## Import

1. Bricks › Templates › **Importieren**.
2. Die sechs Dateien `bricks/templates/referenzen-neu-1-hero.json` … `-6-beratung.json` in das Feld ziehen (oder „Dateien auswählen“). Für Hero und Vorteile wahlweise die `-fa`-Dateien.
3. **„Bilder importieren“ nicht anhaken** → Importieren.
4. In der Liste stehen jetzt „Referenzen-neu 1 – Hero“ bis „Referenzen-neu 6 – Beratung“ (Typ Sektion).

## Seite bauen

1. Neue Seite anlegen (Entwurf), mit Bricks bearbeiten.
2. Im Builder oben **Templates** (Ordner-Symbol) › „Meine Vorlagen“ › die sechs Vorlagen der Reihe nach einfügen (1 bis 6).
3. Bilder auswählen: Hero-Foto, vier Branchenfotos, Beratungsfoto, Siegel (Comenius EduMedia 2025, Proven-Expert-Siegel).
4. Linien-Icons auswählen: die vier Icons der Kennzahlen (Hero) und die vier der Vorteile – Element „Symbol“ anklicken › Icon › SVG › Datei aus der Mediathek (gleicher Name wie oben). Wer das nicht möchte, nimmt stattdessen die Vorlagen mit Endung `-fa` (Font Awesome, nichts auszuwählen).
5. Bei Bedarf Links setzen: Buttons „Mehr erfahren“ (Platzhalter `#`), „Jetzt beraten lassen“ (`/kontakt/`).
6. In allen Breakpoints prüfen, speichern, Vorschau ansehen (Sterne und Note erscheinen nur im Frontend).

## Hinweise

- Die Kennzahlen im Hero (6.000+, 430+, 800+, 25+) stammen aus der Vorlage und sind nicht belegt.
- Die Fotos sind KI-Platzhalter ohne Kennzeichnung (Ausnahme, siehe `projekt.md`); der Kunde tauscht sie aus.
- Alternative ohne Vorlagen: die Clipboard-Dateien `bricks/referenzen-neu-*.json` öffnen, Inhalt kopieren und im Builder mit Strg+V einfügen (geht auf Live, weil HTTPS).
