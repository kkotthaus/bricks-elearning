# Seite „Zielgruppe“ auf die Live-Seite übertragen

Die Übersichtsseite „E-Learning nach Zielgruppe“ (Vorlage: `docs/vorlagen/zielgruppe/`) besteht aus fünf Sections und einem kleinen PHP-Snippet für die Adressen der Unterseiten. Die Sections liegen als Bricks-Section-Vorlagen in `bricks/templates/zielgruppe-*.json`, erzeugt mit `node tools/zielgruppe.mjs` (zusammen mit den Clipboard-Dateien `bricks/zielgruppe-*.json`). Lokal ist die Seite unter http://weka-e.local/zielgruppe/ (ID 10865) zu sehen.

Was in den Vorlagen steckt:

- **Klassen:** 23 neue Klassen (fast alle beginnen mit `audience-`, dazu `office-plan--straight`), 25 Klassen der Seite „Büro-Verwaltung“ (`office-…`) und die vorhandene Klasse `eyebrow`. Bricks legt fehlende Klassen beim Import an und nimmt vorhandene unverändert. ACSS-Klassen werden nur referenziert. Die Reihenfolge der Importe von Büro-Verwaltung und Zielgruppe ist egal.
- **Symbole:** Die drei Symbole der Zielgruppen-Karten (Bildschirm, Helm, Führungskraft) sind SVG-Elemente mit Code aus der Vorlage. Sie brauchen eine Bricks-Code-Signatur (siehe „Seite bauen“), sonst steht im Builder „No signature“ und die Symbole fehlen.
- **Keine Bilder** – es muss nichts in die Mediathek geladen werden. Häkchen kommen aus dem CSS der Klassen.
- **Unterseiten:** Büro-Verwaltung ist eine Unterseite von „Zielgruppe“ (`/zielgruppe/buero-verwaltung/`). Die Kurs-Taxonomie „Zielgruppen“ (Meta Box) belegt aber schon die Adressen `/zielgruppe/<begriff>/` (z. B. `/zielgruppe/mitarbeitende/`), sodass WordPress Unterseiten dort nicht findet (Fehler 404). Das Snippet „WEKA Zielgruppe – Unterseiten“ prüft zuerst, ob es eine Unterseite mit diesem Namen gibt, und zeigt sie; sonst bleibt es beim Kurs-Archiv. Eine Unterseite darf deshalb nicht so heißen wie ein Begriff der Taxonomie (auszubildende, dienstwagenfahrer, elektrofachkraefte, eup, fuehrungskraefte, mitarbeitende) – sonst ist das Archiv nicht mehr erreichbar.
- **Sprungmarken:** Die Sections haben die IDs `mitarbeitende`, `verantwortliche` und `buchungsweg`; der Button im Hero springt zu `mitarbeitende`.

## Vorher auf Live

- [ ] Sicherung (Duplicator: Backup erstellen)
- [ ] WPCodeBox: neues Snippet **„WEKA Zielgruppe – Unterseiten“** anlegen
  - Typ **PHP**, Inhalt aus `snippets/weka-zielgruppe-unterseiten.php`
  - Ausführung „Always“, Einfügepunkt **Root**
  - speichern und aktivieren
- [ ] Bricks › Einstellungen › Benutzerdefinierter Code: „Code-Ausführung aktivieren“ für Administratoren ist an (ist für „Referenzen-neu“ ohnehin nötig).

## Import

1. Bricks › Templates › **Importieren**.
2. Die fünf Dateien `bricks/templates/zielgruppe-1-hero.json` … `-5-abschluss.json` in das Feld ziehen (oder „Dateien auswählen“).
3. „Bilder importieren“ nicht anhaken (es gibt keine) → Importieren.
4. In der Liste stehen jetzt „Zielgruppe 1 – Hero“ bis „Zielgruppe 5 – Abschluss“ (Typ Sektion).

## Seite bauen

1. Neue Seite anlegen, Titel „Zielgruppe“, Titelform (Slug) `zielgruppe`, als Entwurf; mit Bricks bearbeiten.
2. Im Builder oben **Templates** (Ordner-Symbol) › „Meine Vorlagen“ › die fünf Vorlagen der Reihe nach einfügen (1 bis 5).
3. Die drei Symbole signieren: im Builder jedes SVG-Element in den Zielgruppen-Karten anklicken und beim Code „Code signieren“. Alternativ Bricks › Einstellungen › Benutzerdefinierter Code › „Code-Signaturen neu erzeugen“ (signiert den Code der ganzen Website – vorher sicherstellen, dass dort kein fremder, ungeprüfter Code steht).
4. Speichern und die **Vorschau** öffnen.
5. Prüfen:
   - Symbole in allen drei Karten sichtbar, kein Hinweis „No signature“.
   - „Zielgruppe auswählen“ springt zu „Wen möchten Sie schulen?“.
   - „Themen & Lernpakete entdecken“ öffnet die Seite Büro-Verwaltung (nach Schritt 7).
   - In allen Breakpoints ansehen (Desktop, Tablet, Handy).
6. Veröffentlichen, wenn alles stimmt.
7. Seite **Büro-Verwaltung** bearbeiten (WordPress-Editor, Seitenattribute): „Übergeordnete Seite“ = **Zielgruppe**, aktualisieren. Sie liegt dann unter `/zielgruppe/buero-verwaltung/`; die alte Adresse `/buero-verwaltung/` leitet WordPress selbst weiter. Danach Einstellungen › Permalinks einmal speichern.
8. Prüfen: `/zielgruppe/buero-verwaltung/` zeigt Büro-Verwaltung, `/zielgruppe/mitarbeitende/` zeigt weiter das Kurs-Archiv.

## Ziel-Links

| Stelle | Ziel |
|---|---|
| Brotkrumen „Startseite“ | `/` |
| Karte Büro & Verwaltung | `/zielgruppe/buero-verwaltung/` |
| Karte Produktion & Werkstatt | https://www.weka-elearning.de/betriebliche-unterweisungen/arbeitsschutz/ |
| Karte Führungskräfte, Unternehmenslösung, Abschluss-Button | https://www.weka-elearning.de/kontakt/ |
| Personalentwicklung & HR | https://www.weka-elearning.de/lms-fuer-unternehmen/ |
| Fachverantwortliche & Beauftragte | https://www.weka-elearning.de/betriebliche-unterweisungen/ |
| Zum WEKA eCampus, Einzelkurs | https://lernen.weka.de/de |
| Flatrate | https://lernen.weka.de/de/e/weka-ecampus-flatrate-unterweisungen-140 |

Alle Links stammen aus dem Entwurf (Stand 19.10.2026).

## Hinweise

- Der Header des Entwurfs (eigenes Menü „Für Ihr Team / Für Verantwortliche / Beratung anfragen“) und die Fußzeile sind nicht nachgebaut; die Seite nutzt Header und Footer der Website.
- Die Einstiegskarte im Hero nutzt die Klassen der Lernplan-Karte von Büro-Verwaltung; der Modifier `office-plan--straight` nimmt die Drehung weg (im Entwurf steht die Karte gerade).
- Alternative ohne Vorlagen: die Clipboard-Dateien `bricks/zielgruppe-*.json` öffnen, Inhalt kopieren und im Builder mit Strg+V einfügen. Danach ebenfalls signieren.

## Offene Fragen an den Kunden

- **Menü:** Soll „Zielgruppe“ ins Hauptmenü der Website?
