# Seite „Referenzen-neu“ auf die Live-Seite übertragen

Die sechs Sections liegen als Bricks-Section-Vorlagen in `bricks/templates/`. Sie werden auf Live per Drag & Drop importiert und dann in die Seite eingefügt. Erzeugt werden sie mit `node tools/referenzen-neu.mjs` (zusammen mit den Clipboard-Dateien `bricks/referenzen-neu-*.json`).

Die Vorlagen sind so gebaut, dass sie ohne Nacharbeit an Code funktionieren:

- **Symbole** sind Bricks-SVG-Elemente mit SVG-Code (Farbe über `currentColor`). Der Code steckt in den Vorlagen, es muss nichts in die Mediathek:
  - Kennzahlen im Hero und Vorteile: eigene Linien-Icons nach der Vorlage (`assets/icons/weka-*.svg`).
  - Branchenkarten, Häkchen, Bewertungs-Plakette: Font Awesome 6.7.2 Free als SVG (`assets/icons/fa/*.svg`).
  - **Variante zum Zurückwechseln:** `referenzen-neu-1-hero-fa.json` und `referenzen-neu-4-vorteile-fa.json` mit Font-Awesome-SVGs statt der Linien-Icons.
  - **Code-Signatur:** SVG-Code läuft in Bricks nur mit einer Signatur, die zur jeweiligen Seite gehört. Nach dem Import fehlt sie, im Builder steht dann „No signature“ – deshalb nach dem Einfügen signieren (siehe „Seite bauen“). Voraussetzung: Bricks › Einstellungen › Benutzerdefinierter Code › „Code-Ausführung aktivieren“ für Administratoren.
- **Klassen** (56 eigene + `eyebrow`, `check-list`) stecken in den Vorlagen. Bricks legt fehlende Klassen beim Import an und nimmt vorhandene (gleiche ID oder gleicher Name) unverändert. ACSS-Klassen werden nur referenziert.
- **Bilder** (6 Fotos, 2 Siegel) werden beim Import zu Platzhaltern – Live kann die lokalen Bilder nicht laden. Die Bilder werden auf Live in der Mediathek ausgewählt.

## Vorher auf Live

- [ ] Sicherung (Duplicator: Backup erstellen)
- [ ] WPCodeBox: neues PHP-Snippet „WEKA Proven Expert – Bewertung“ anlegen, Inhalt aus `snippets/weka-proven-expert-bewertung.php`, Ausführung „Always“, Einfügepunkt Root, aktivieren. Ohne das Snippet bleiben Note, Anzahl und Sterne leer.
- [ ] BricksExtras › Elements: **Star Rating** einschalten und speichern (die Sterne sind dieses Element). Vor dem Import, sonst kennt Bricks das Element nicht.
- [ ] Bricks › Einstellungen › Benutzerdefinierter Code: Code-Ausführung ist aktiviert (sonst zeigen die SVG-Elemente nichts an).
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
4. Seite speichern, dann Bricks › Einstellungen › Benutzerdefinierter Code › **„Code-Signaturen neu erzeugen“** (signiert den Code der ganzen Website neu, mit den Schlüsseln der Live-Seite – vorher sicherstellen, dass dort kein fremder, ungeprüfter Code steht). Alternativ im Builder jedes SVG-Element anklicken und beim Code „Code signieren“. Danach dürfen keine Hinweise „No signature“ mehr erscheinen (29 Symbole).
5. Bei Bedarf Links setzen: Buttons „Mehr erfahren“ (Platzhalter `#`), „Jetzt beraten lassen“ (`/kontakt/`).
6. In allen Breakpoints prüfen, speichern, Vorschau ansehen (Sterne und Note erscheinen nur im Frontend).

## Hinweise

- Die Kennzahlen im Hero (6.000+, 430+, 800+, 25+) stammen aus der Vorlage und sind nicht belegt.
- Die Fotos sind KI-Platzhalter ohne Kennzeichnung (Ausnahme, siehe `projekt.md`); der Kunde tauscht sie aus.
- Alternative ohne Vorlagen: die Clipboard-Dateien `bricks/referenzen-neu-*.json` öffnen, Inhalt kopieren und im Builder mit Strg+V einfügen (geht auf Live, weil HTTPS).
