# Projekt: weka-elearning – Arbeitsumgebung

Eine bestehende Seite wird importiert und anschließend überarbeitet. Allgemeine Regeln (ACSS 3.x zuerst, BEM, CSS in der Klasse, Responsive, Icons, Benennung, Meta Box, WPCodeBox, Clipboard-JSON) stehen in [bricks-nodes](bricks-nodes/CLAUDE.md) und gelten führend. Hier steht nur Projektspezifisches und das Design.

## Projektdaten

- Prefix: `weka_` (Meta-Box-Feld-IDs, PHP-Funktionen in WPCodeBox)
- Bricks: immer aktuelle Version (Stand 28.09.2026: 2.4.1; im Duplicator-Archiv vom 28.09.2026: 2.3.10). `version` in Clipboard-JSON = installierte Version.
- Section-Dateien: `bricks/<name>.json`
- Staging: https://weka-e.kotthaus-bs.de (nur HTTPS/Backend, kein Mailversand – Mails fängt das WPCodeBox-Snippet „WEKA Staging – Mails abfangen“ ab, Ansicht unter Werkzeuge › Abgefangene Mails). Live ebenfalls nur über HTTPS erreichbar.
- Angebotskonfigurator mit PDF-Versand: Snippets in `snippets/`, Übernahme auf live siehe [docs/live-angebot-pdf.md](docs/live-angebot-pdf.md).

### Plugins (Duplicator-Archiv vom 28.09.2026)

Lokale Arbeitskopie: Local-Seite **weka-e** (http://weka-e.local). Bricks 2.3.10 + Child-Theme aktiv, WordPress 7.1.2.

**Aktiv:** Automatic.css 3.3.7, BricksExtras 1.7.6, Frames 1.5.13, BricksLabs Bricks Navigator 1.2.1, Meta Box AIO 3.12.0, Meta Box 5.15.1, WPCodeBox 2 1.4.1, WP Grid Builder 2.3.6 (+ Bricks 1.3.6, Meta Box 1.2.0, Caching 1.2.1), HappyFiles Pro 1.9.1, Motion.page 3.2.10, Funnelforms Pro 3.8.10, Admin Columns Pro 7.1.6, Rank Math 1.0.279, Schema Pro 2.12.2, Imagify 2.3.4, Duplicator Pro 5.0.4, Enable Media Replace 4.2.2, Disable Embeds 1.5.0, Remove CPT base 6.7, Temporary Login Without Password 1.9.9.

**Inaktiv:** WS Form Pro 1.10.79 (+ HubSpot), WP Rocket 3.21.0.1, Cookiebot 4.7.3, Slim SEO Schema 2.12.2, User Role Editor Pro 4.65, User Role Editor 4.66.2.

Kein Bricks Forge.

**Offen:** Rank Math und Schema Pro sind beide aktiv (doppelte Schema-Ausgabe prüfen); Meta Box einzeln neben AIO; inaktive Plugins behalten oder entfernen; Formulare laufen über Funnelforms – WS Form ist inaktiv. Kein Cookie-Banner aktiv. Siehe [bricks-nodes/docs/plugins.md](bricks-nodes/docs/plugins.md).

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

## Wiederverwendbare Bausteine
- `.eyebrow` – Dachzeile (Großbuchstaben, `--text-s`, Laufweite .12em)
- `.check-list` (`__item`, `__icon`, `__text`) – Häkchen-Liste
- `.cta-button` (`--light` weiß, `--outline` Rahmen) – Button mit Pfeil
- Hintergrundbilder als eigenes Bild-Element (`__bg`, absolut, `object-fit: cover`) + Overlay per `::before`

- Häkchen im Kreis: Klasse mit `width/height 1.8em`, `padding .4em`, Hintergrund `--primary-dark`, `border-radius 50%`, Farbe `--white`.
- Pfeil-Icons in Buttons sind Button-Einstellungen (Font Awesome).

## Ablauf
1. Bestehende Seite importieren
2. Struktur prüfen (Seiten, Templates, CPTs, Felder), Plugin-Bestand mit Aktiv-Status festhalten
3. Styles auf ACSS-Klassen/-Variablen und globale BEM-Klassen (Bricks-Stil-Felder) umstellen
4. Custom PHP/JS nach WPCodeBox verlagern
