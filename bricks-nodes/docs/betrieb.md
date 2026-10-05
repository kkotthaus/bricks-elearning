# Betrieb: Builder, PHP, Veröffentlichen

## Arbeiten im Builder

- **Bestehende Sections werden direkt im Bricks Builder geändert** (Claude bedient den Builder im Browser: Elemente, Klassen, Stil-Felder, Breakpoints).
- Vor dem Speichern das Ergebnis in allen Breakpoints prüfen (Screenshot); gespeichert wird nach Freigabe.
- Klassen über den Klassen-Manager umbenennen (ändert alle Verwendungen), nicht neu anlegen. Unbenutzte Klassen nur nach Rückfrage löschen.

## Neue Sections als Clipboard-JSON

Wenn eine komplett neue Section nicht direkt im Builder gebaut werden kann:

- **Eine Datei je Section:** `bricks/<name>.json` im Projekt (Bricks-Clipboard-Format), Einfügen in Bricks mit Strg+V.
- Kein zusätzliches CSS-File, kein Snippet – das CSS steckt in `globalClasses`.
- `version` = installierte Bricks-Version.
- **Klassen-IDs aus dem Klassennamen ableiten** (gleicher Name = gleiche ID in allen Dateien), damit gemeinsame Klassen wiedererkannt werden. Existiert eine Klasse mit gleichem Namen schon, übernimmt Bricks die vorhandene – geänderte Klassen vorher anpassen statt doppelt anlegen.
- ACSS-Klassen nicht in `globalClasses` mitliefern; sie existieren in der Installation bereits (per Name referenzieren bzw. im Builder nach dem Einfügen zuweisen).

```json
{
  "content": [
    { "id": "sec001", "name": "section", "parent": 0, "children": ["con002"], "label": "Teaser – Kurse",
      "settings": { "_cssGlobalClasses": ["ab12cd"] } },
    { "id": "con002", "name": "container", "parent": "sec001", "children": ["hdg003"], "label": "Inhaltsbereich",
      "settings": {} },
    { "id": "hdg003", "name": "heading", "parent": "con002", "children": [], "label": "Überschrift",
      "settings": { "text": "Titel", "tag": "h2", "_cssGlobalClasses": ["ef34gh"] } }
  ],
  "source": "bricksCopiedElements",
  "sourceUrl": "",
  "version": "<bricks-version>",
  "globalClasses": [
    { "id": "ab12cd", "name": "course-teaser", "settings": {
        "_background": { "color": { "raw": "var(--primary-ultra-light)" } },
        "_padding": { "top": "var(--section-space-m)", "bottom": "var(--section-space-m)" } } },
    { "id": "ef34gh", "name": "course-teaser__title", "settings": {
        "_typography": { "font-size": "var(--h2)" },
        "_typography:mobile_landscape": { "font-size": "var(--h3)" },
        "_cssCustom": ".course-teaser__title {\n  hyphens: auto;\n}" } }
  ],
  "globalElements": []
}
```

## Daten in der Datenbank

Bricks speichert alles in der Datenbank – zum Lesen und Sichern per WP-CLI:

| Inhalt | Ort |
| --- | --- |
| Inhalt einer Seite / eines Templates | Post-Meta `_bricks_page_content_2` (Header `_bricks_page_header_2`, Footer `_bricks_page_footer_2`) |
| Templates | Beitragstyp `bricks_template`, Art in `_bricks_template_type` |
| Globale Klassen | Option `bricks_global_classes` (Kategorien `bricks_global_classes_categories`) |
| Einstellungen, Theme-Styles, Komponenten | Optionen `bricks_global_settings`, `bricks_theme_styles`, `bricks_components` |

- Globale Klassen und Komponenten regelmäßig als JSON ins Repo exportieren (nur lesend), damit Änderungen nachvollziehbar sind.
- **Nicht direkt in diese Optionen schreiben**, solange der Builder genutzt wird – sonst gehen Builder-Änderungen verloren. Schreiben nur nach ausdrücklicher Anweisung und mit Backup.

## PHP und JavaScript als WPCodeBox-Snippets

- **Jedes Snippet wird in WPCodeBox angelegt** – PHP und JavaScript. Nicht in `functions.php` des Child-Themes, nicht als mu-plugin oder eigenes Plugin, nicht im Bricks-Code-Element, nicht in Bricks › Einstellungen › Benutzerdefinierter Code (Header-/Body-Skripte).
- Anlegen per WPCodeBox-MCP-Funktionen (`wpcodebox/…`), sonst in der WPCodeBox-Oberfläche. Im Repo liegt eine Kopie je Snippet (`snippets/<name>.php|js`) zur Versionierung; nach Änderungen in WPCodeBox die Kopie nachziehen.
- Ein Ordner je Projekt, Snippets sprechend benannt und kurz kommentiert. **Kein CSS in WPCodeBox** – CSS steht in den Bricks-Klassen.
- Ausführung „Always“, Einfügepunkt Root. WPCodeBox führt Code per `eval()` in einem try-Block aus:
  - kein `const` auf oberster Ebene, sondern `define()`;
  - kein `__DIR__`;
  - Funktionen erst ab ihrer Definition verfügbar;
  - jede Datei beginnt mit `defined( 'ABSPATH' ) || exit;`.
- Funktionen mit Präfix `<prefix>_`. Funktionen für `{echo:…}` in Bricks freigeben (Filter `bricks/code/echo_function_names`).
- Fehlerhafte Snippets schaltet WPCodeBox ab – nach Änderungen `enabled` prüfen.

## Veröffentlichen mit Duplicator Pro

Erstveröffentlichung als Kopie (Dateien + Datenbank); Duplicator ersetzt die Adresse auch in serialisierten Bricks-Daten.

**Vorher:** Test- und Beispielinhalte entfernen, unbenutzte Plugins deaktivieren (nach Rückfrage), SEO-Indexierung prüfen, Paket erstellen.

**Nachher (live):**

1. Lizenzen aktivieren (Bricks, ACSS, BricksExtras, Frames, WP Grid Builder, Meta Box AIO, WPCodeBox, weitere Pro-Plugins).
2. ACSS-Einstellungen speichern (CSS neu erzeugen); in Bricks CSS-Dateien neu erzeugen; Permalinks speichern.
3. Caches leeren; „Suchmaschinen davon abhalten …“ aus.
4. SMTP testen, Admin-E-Mail prüfen, Anwendungspasswörter und Benutzer prüfen.
5. Installer-Dateien löschen; Cron per Server (`DISABLE_WP_CRON`).

**Nach dem Livegang nie wieder per Duplicator überschreiben** – Änderungen gezielt übertragen (Bricks: Kopieren/Einfügen oder Template-Export/-Import; PHP: WPCodeBox).

## Caching

Seiten mit Daten relativ zu „jetzt“ (Status, Fristen, Öffnungszeiten) vom Seitencache ausnehmen oder kurz cachen.
