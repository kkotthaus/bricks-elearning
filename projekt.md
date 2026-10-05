# Projekt: weka-elearning – Arbeitsumgebung

Eine bestehende Seite wird importiert und anschließend überarbeitet.

## Tech-Stack

| Bereich | Werkzeug | Zweck |
|---|---|---|
| CMS | WordPress | Basis-System |
| Page Builder | Bricks Builder (immer aktuelle Version, Stand 28.09.2026: 2.4.1) | Layout, Templates, Query Loops, Dynamic Data |
| CSS-Framework | Automatic.css (ACSS) 3.x | Design-Tokens (Variablen) & Utility-Klassen |
| Custom Fields / CPT | Meta Box (metabox.io) | Custom Post Types, Taxonomien, Felder, Relationships |
| Code-Snippets | WPCodeBox | PHP- und JS-Snippets (statt functions.php); CSS von Sections gehört in die Bricks-Klassen |
| Klassen-Konvention | BEM | Block__Element--Modifier |

## Konventionen

### CSS / Klassen (BEM)
- Schema: `.block`, `.block__element`, `.block--modifier`, `.block__element--modifier`
- Klassennamen klein, mit Bindestrich: z. B. `.course-card__title`
- In Bricks als **globale Klassen** anlegen, keine ID-basierten Styles
- Keine Inline-Styles im Element, wenn eine Klasse sinnvoll ist
- Modifier nur ergänzend zur Block-/Element-Klasse verwenden

### ACSS 3.x
- Werte immer über ACSS-Variablen statt fester Pixel-Werte, z. B.
  - Abstände: `var(--space-m)`, `var(--section-space-m)`, `var(--content-gap)`
  - Typografie: `var(--text-m)`, `var(--h2)`
  - Farben: `var(--primary)`, `var(--primary-hover)`, `var(--base)`, `var(--neutral)`
  - Radius: `var(--radius)`
- Utility-Klassen von ACSS nur sparsam; eigene Komponenten in BEM
- Globale Abstände zentral im ACSS-Dashboard pflegen

### Farbsystem (von ACSS vorgegeben)
- **Keine eigenen Farbwerte** (kein Hex/RGB/HSL im Code) – ausschließlich ACSS-Farbvariablen
- Abstufungen/Varianten: `-ultra-light`, `-light`, `-semi-light`, `-medium`, `-semi-dark`, `-dark`, `-ultra-dark`, `-hover`
  - z. B. `var(--primary)`, `var(--primary-dark)`, `var(--base-ultra-light)`, `var(--primary-hover)`
- Transparenzen über ACSS-Varianten (z. B. `var(--primary-trans-20)`, `var(--black-trans-20)`), nicht selbst berechnen
- Hintergrund-/Textfarben bevorzugt über ACSS-Klassen bzw. Variablen, damit Kontraste vom Framework gesteuert werden
- Neue Farben werden nur im ACSS-Dashboard angelegt, nie im Element

## ACSS-Einstellungen dieses Projekts (Export vom 28.09.2026)

### Aktive Farben
| Variable | Basiswert | Einsatz |
|---|---|---|
| `--primary` | #0052c2 (Blau) | Hauptfarbe, Links, Primär-Buttons |
| `--secondary` | #000 (Schwarz) | Sekundär-Buttons |
| `--action` | #99cc00 (Grün) | Call-to-Action, Fokus/Aktiv-Zustände |
| `--base` | #344F6F (Blaugrau) | Flächen, ruhige Hintergründe |
| `--accent` | #f5f5f5 (Hellgrau) | helle Akzentflächen |
| `--neutral` | #000000 | Hintergründe `bg--light/dark` (neutral-Stufen) |
| `--shade` | #000000 | Graustufen (z. B. Rahmen, Formulare) |
| `--info` | #18A2B8 | Hinweise |
| `--success` | #29A745 | Erfolgsmeldungen |
| `--warning` | #FFC10A | Warnungen |

- **Deaktiviert:** `tertiary` und `danger` → nicht verwenden (Variablen/Klassen werden nicht erzeugt). Für Fehlermeldungen vorher `danger` im Dashboard aktivieren.
- Alternative Farben (`*-alt`) und Komplementärfarben (`*-comp`) sind aus.
- Überschriftenfarbe global: #003580 (im Dashboard gesetzt) – Überschriften nicht separat einfärben.
- Links: `var(--primary)`, Hover `var(--primary-hover)`, ohne Unterstreichung.
- Text: `--text-dark` = `var(--black)`, `--text-light` = `var(--white)`, gedämpft `--text-dark-muted` / `--text-light-muted`.
- Hintergrund-Klassen: `bg--ultra-light`, `bg--light` (neutral hell, Text dunkel), `bg--dark`, `bg--ultra-dark` (neutral dunkel, Text hell).
- Farbschema: hell (`website-color-scheme: light`), Color-Scheme-Switcher aktiv, `prefers-color-scheme` aus.

### Buttons
- Aktiv: **primary** (inkl. Outline + Light/Dark-Varianten), **secondary** (inkl. Outline + Varianten), **action**
- Alle anderen Button-Farben sind aus.
- Klassen: `btn--primary`, `btn--secondary`, `btn--action`, Modifier `btn--outline` (+ `-light`/`-dark`-Varianten)
- Stil: eckig (`btn-border-radius: 0`), Rahmen 2px, Padding .5em/1.25em, Schrift 14–18px, Gewicht 400, Mindestbreite 140px
- Action-Button: grüner Hintergrund mit Text `var(--primary-ultra-dark)`

### Typografie
- Root-Font-Size 62.5 % (1rem = 10px)
- Fließtext 16–18px, Zeilenhöhe 1.5, Skala 1.333 (mobil 1.2)
- Überschriften-Skala 1.333 (mobil 1.2), `h5` 16px, `h6` 14px fix, Abstand 1.2em, `text-wrap: pretty`
- `--text-s` 12–16px, `--text-xs` 11–13px
- Absatzabstand `--paragraph-spacing` 1em

### Abstände, Layout, Radius
- Basis-Abstand 24–30px, Skala 1.5 (mobil 1.333) → `--space-xs … --space-xxl`
- Sektionen: `padding-block: var(--section-space-m)`, seitlich 24–30px
- Gaps: `--container-gap` = `var(--space-xl)`, `--content-gap` = `var(--space-m)`, `--grid-gap` = `var(--space-m)`
- Radius: Basis 1rem, Skala 1.5 → `--radius-xs … --radius-xl`, `--radius`
- Rahmen: 1px solid, `--border-color-dark` = `var(--black-trans-20)`, `--border-color-light` = `var(--white-trans-20)`
- Body max. 1920px breit mit Schatten
- Transitions: .3s ease-in-out (global)

### Breakpoints
| Name | Wert |
|---|---|
| xl | 1440px |
| l | 992px |
| m | 768px |
| s | 480px |

`xs` und `xxl` sind deaktiviert. Viewport für fluide Werte: 320–1440px.

### Aktive / inaktive Module (Auswahl)
- **An:** BEM-Klassen-Generator, Smart Spacing, Content Grid, Auto Grid, Grid/Flex-Grids, Container Queries, Box Shadows, Overlays, Gradient Fades, Line-Clamp, Frames (Modal, Notes, Slider, Slider-Controls, TOC), Accessibility-Klassen, Reduce Motion, Smooth Scrolling
- **Aus:** ACSS-Cards (eigene Karten in BEM bauen), Forms-Styling, Icons, Auto-Radius, Owl-Spacing, Pro-Mode, Textures, externe-Link-Kennzeichnung
- Frames-Karten-Werte (falls genutzt): Padding `var(--space-m)`, Radius `var(--radius-xs)`, Rahmen 0.15rem `var(--shade-light)`

## Standard für neue Sections (verbindlich)

Diese Einstellungen gelten für **jede** neue Section/Komponente – ohne dass sie erneut genannt werden müssen.

### 0. Arbeitsweise (ab 28.09.2026)
- **Alle weiteren Änderungen werden direkt im Bricks Builder vorgenommen** (Claude bedient den Builder im Browser: Elemente, Klassen, Stil-Felder, Breakpoints).
- Keine JSON-/CSS-Dateien mehr für Änderungen an bestehenden Sections; Einfüge-JSON nur noch, wenn eine komplett neue Section angelegt wird und der direkte Weg nicht möglich ist.
- Vor dem Speichern in Bricks: Ergebnis per Screenshot/Breakpoint-Vorschau prüfen; gespeichert wird nur nach Rückmeldung bzw. wenn der Nutzer es freigegeben hat.

### 1. Lieferung
- **Genau eine Datei pro Section:** `bricks/<name>.json` (Bricks-Clipboard-JSON), Einfügen in Bricks mit Strg+V.
- **Kein zusätzliches CSS-File, kein WPCodeBox-Snippet** – das gesamte CSS steckt in den globalen Klassen.
- Datei wird in den Projektordner `bricks/` gelegt.
- `version` = installierte Bricks-Version (aktuell 2.4.1).

### 2. Klassen & CSS
- Jedes gestaltete Element bekommt eine **BEM-Klasse als globale Klasse** (`settings._cssGlobalClasses`), keine ID-Styles, keine Element-Styles.
- Styles stehen in den **Bricks-Stil-Feldern der Klasse**:
  - Layout: `_display`, `_direction`, `_flexWrap`, `_alignItems`, `_justifyContent`, `_gridTemplateColumns`, `_rowGap`, `_columnGap`, `_flexGrow/_flexShrink/_flexBasis`
  - Größe: `_width`, `_widthMax`, `_widthMin`, `_height`
  - Abstände: `_margin`, `_padding` (`top/right/bottom/left`)
  - Typografie: `_typography` (`font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform`, `text-align`, `text-decoration`, `color: {raw}`)
  - Hintergrund: `_background: { color: { raw: "var(--…)" } }`
  - Rahmen: `_border` (`width`, `style`, `color`, `radius`)
  - Position: `_position`, `_top/_right/_bottom/_left`, `_zIndex`, `_overflow`, `_objectFit`
- **Hover** als Zustand der Klasse (`_background:hover`, `_typography:hover`, `_border:hover`).
- **Nur was Bricks nicht als Feld hat**, kommt ins Custom-CSS-Feld **derselben Klasse** – mit echtem Klassen-Selektor (`.klasse { … }`), nicht `%root%`. Beispiele: `::before`, `list-style`, `hyphens`, `overflow-wrap`, `transition`, `box-shadow`, `filter`, `:focus-visible`, verschachtelte Selektoren.
- Werte ausschließlich über **ACSS-Variablen**; keine Hex-/RGB-Farben.
- **Klassen-IDs** werden aus dem Klassennamen abgeleitet (gleicher Name = gleiche ID in allen Dateien) → gemeinsame Bausteine werden beim Einfügen wiedererkannt.

### 3. Responsive (immer)
- Werte für kleinere Bildschirme in den **Bricks-Breakpoints der Klasse**:

| Bricks-Breakpoint | Suffix | Bereich | Typisches Verhalten |
|---|---|---|---|
| Desktop | – | Basis | volles Layout, mehrspaltig |
| Tablet hoch | `:tablet_portrait` | ≤ 991px | Spalten reduzieren (4 → 2, 3 → 2, 2 → 1), Trennlinien entfernen |
| Mobil quer | `:mobile_landscape` | ≤ 767px | einspaltig, Innenabstände kleiner, Flex-Reihen stapeln, CTA-Buttons 100 % |
| Mobil hoch | `:mobile_portrait` | ≤ 478px | Logos/Icons kleiner, Feinschliff |

- Grids mit `minmax(0, 1fr)` statt `1fr`.
- Überschriften: `max-width: 100%; overflow-wrap: break-word; hyphens: auto;`
- Kein horizontaler Überlauf bei 375px; Prüfung bei 1300 / 900 / 600 / 375px vor Auslieferung.
- Bilder `width: 100%; height: auto` bzw. Logos feste Höhe + `width: auto`.
- Button-Gruppen: Buttons gleich groß (Grid mit gleich breiten Spalten, `grid-auto-rows: 1fr`).

### 4. Icons
- Immer **SVG-Element** (`name: "svg"`, `source: "code"`, Inline-SVG mit `stroke="currentColor"` bzw. `fill="currentColor"`), **kein Icon-Element**.
- Farbe über die Textfarbe der Klasse, Größe über `width`/`height` der Klasse (z. B. `1em` + `font-size`).
- Häkchen im Kreis: Klasse mit `width/height 1.8em`, `padding .4em`, Hintergrund `--primary-dark`, `border-radius 50%`, Farbe `--white`.
- Ausnahme: Pfeil-Icons in Buttons sind Button-Einstellungen (Font Awesome).

### 5. Benennung
- Jedes Element erhält ein sprechendes deutsches **`label`** nach Bedeutung (z. B. „Hero – WEKA LMS Einstieg“, „Preiskarte Basic“, „Listenpunkt: …“, „Button: …“).
- BEM-Blockname = vom Nutzer genannter Name (z. B. `hero-lms-neu`), sonst sprechend englisch.

### 6. Wiederverwendbare Bausteine
- `.eyebrow` – Dachzeile (Großbuchstaben, `--text-s`, Laufweite .12em)
- `.check-list` (`__item`, `__icon`, `__text`) – Häkchen-Liste
- `.cta-button` (`--light` weiß, `--outline` Rahmen) – Button mit Pfeil
- Hintergrundbilder als eigenes Bild-Element (`__bg`, absolut, `object-fit: cover`) + Overlay per `::before`

### 7. Grundgerüst (Beispiel)
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
  "version": "2.4.1",
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
Hinweis: Existiert eine globale Klasse mit gleichem Namen bereits, übernimmt Bricks die vorhandene → vor erneutem Einfügen alte Klassen löschen.

### Meta Box
- CPTs, Taxonomien und Feldgruppen über Meta Box (Builder bzw. Code) definieren
- Feld-IDs mit Präfix, z. B. `weka_`
- Ausgabe in Bricks über Dynamic Data (`{mb_...}`) bzw. Query Loops

### WPCodeBox
- Eigener PHP/JS-Code ausschließlich als Snippet in WPCodeBox (Styles von Sections/Komponenten nicht hier, sondern in den globalen Bricks-Klassen)
- Snippets in Ordnern gruppieren, sprechend benennen, kurz kommentieren
- PHP-Funktionen mit Präfix `weka_` (Namenskollisionen vermeiden)

## Ablauf
1. Bestehende Seite importieren
2. Struktur prüfen (Seiten, Templates, CPTs, Felder)
3. Styles auf ACSS-Variablen und globale BEM-Klassen (Bricks-Stil-Felder) umstellen
4. Custom PHP/JS nach WPCodeBox verlagern
