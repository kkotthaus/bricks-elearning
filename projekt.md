# Projekt: weka-elearning – Arbeitsumgebung

Eine bestehende Seite wird importiert und anschließend überarbeitet. Allgemeine Regeln (ACSS 3.x zuerst, BEM, CSS in der Klasse, Responsive, Icons, Benennung, Meta Box, WPCodeBox, Clipboard-JSON) stehen in [bricks-nodes](bricks-nodes/CLAUDE.md) und gelten führend. Hier steht nur Projektspezifisches und das Design.

## Projektdaten

- Prefix: `weka_` (Meta-Box-Feld-IDs, PHP-Funktionen in WPCodeBox)
- Bricks: immer aktuelle Version (Stand 28.09.2026: 2.4.1; im Duplicator-Archiv vom 28.09.2026: 2.3.10). `version` in Clipboard-JSON = installierte Version.
- Section-Dateien: `bricks/<name>.json`
- Staging: https://weka-e.kotthaus-bs.de (nur HTTPS/Backend, kein Mailversand – Mails fängt das WPCodeBox-Snippet „WEKA Staging – Mails abfangen“ ab, Ansicht unter Werkzeuge › Abgefangene Mails). Live ebenfalls nur über HTTPS erreichbar.
- Staging per SSH (seit 05.10.2026): Alias `weka-e` (CyberPanel-Server 89.58.38.62, Benutzer `wekae7789`, Schlüssel `~/.ssh/weka_e`), WordPress in `~/public_html`, WP-CLI als `wp`. Sicherungen vor Änderungen unter `~/backup/`. Auf netcup2 liegt unter `/srv/www/weka-e` nur eine alte Kopie (WordPress 6.4) – nicht verwenden.
- Angebotskonfigurator mit PDF-Preisauskunft (Preise, Mengenrabatt je Kurs, Flatrate-Vergleich, Freigabefeld): Snippets in `snippets/`, Preise und Übernahme auf live siehe [docs/live-angebot-pdf.md](docs/live-angebot-pdf.md). Aufruf von lernen.weka.de (Link mit Vorauswahl, iframe): [docs/aufruf-von-lernen-weka.md](docs/aufruf-von-lernen-weka.md).
- Seite „Referenzen-neu“ (lokal ID 10839, Entwurf) nach Vorlage [docs/vorlagen/referenzen-neu.png](docs/vorlagen/referenzen-neu.png): Sections `bricks/referenzen-neu-*.json`. Kennzahlen aus der Vorlage übernommen (nicht belegt), Buttons „Mehr erfahren“ mit `#` als Platzhalter-Link.
- **Ausnahme KI-Kennzeichnung (entschieden 15.10.2026):** Die Fotos auf „Referenzen-neu“ sind KI-Bilder aus der Vorlage und werden ohne Kennzeichnung eingesetzt; der Kunde tauscht sie später selbst aus. Mediathek-Titel enden auf „(Platzhalter)“.
- Proven-Expert-Bewertung: Das Code-Element im Footer (Template 24) holt die Werte per API und speichert sie als JSON im Webroot. Das Snippet „WEKA Proven Expert – Bewertung“ (`snippets/weka-proven-expert-bewertung.php`) liest nur diese Datei: `{echo:weka_pe_rating('note'|'wert'|'anzahl'|'text')}`. Die Note steht mit einer Nachkommastelle, ab ,05 aufgerundet (4,54 → „4,5“); `wert` ist dieselbe Note mit Punkt („4.5“). Die Sterne sind seit 16.10.2026 das **BricksExtras-Element Star Rating** (`xstarrating`, Typ „Farben“, Wert `{echo:weka_pe_rating('wert')}`, Farben über `--x-star-color`/`--x-star-empty-color` in der Klasse `rating-bar__stars`); das Element muss in BricksExtras › Elements aktiviert sein. Das Snippet übersetzt außerdem die Screenreader-Beschriftung des Elements („Bewertung: 4.5 von 5 Sternen“). Im Builder können Sterne und Werte leer bleiben, im Frontend stimmen sie.
- Symbole auf „Referenzen-neu“ sind seit 16.10.2026 **SVG-Elemente mit SVG-Code** (`source: code`, `currentColor`): Kennzahlen und Vorteile mit eigenen Linien-Icons nach der Vorlage (`assets/icons/*.svg`), Branchenkarten, Häkchen und Bewertungs-Plakette mit Font Awesome 6.7.2 Free als SVG (`assets/icons/fa/*.svg`). Der Code braucht eine Bricks-Code-Signatur je Seite: nach Einfügen oder Template-Import signieren (siehe [docs/referenzen-neu-auf-live.md](docs/referenzen-neu-auf-live.md)), sonst steht dort „No signature“. Font Awesome im Kreis hat zusätzlich die Klasse `icon-circle__glyph` (45 % statt 58 %). Die Font-Awesome-Fassung von Hero und Vorteilen gibt es als Dateien mit Endung `-fa`. Lokal ist die Seite 10839 umgestellt und signiert; die importierten Vorlagen 10846–10851 sind noch der alte Stand.
- Sections und Vorlagen erzeugt `node tools/referenzen-neu.mjs`; Übertragung auf Live: [docs/referenzen-neu-auf-live.md](docs/referenzen-neu-auf-live.md). Lokal sind die sechs Vorlagen importiert (Templates 10846–10851).
- Seite „Büro-Verwaltung“ (lokal ID 10863, Unterseite von „Zielgruppe“: `/zielgruppe/buero-verwaltung/`, veröffentlicht) nach dem Entwurf in [docs/vorlagen/buero-verwaltung/](docs/vorlagen/buero-verwaltung/) (HTML und Screenshots von weka-buero-unterweisen.rockypetal10.chatgpt.site, Stand 19.10.2026): acht Sections `bricks/buero-verwaltung-*.json`, erzeugt mit `node tools/buero-verwaltung.mjs`, Klassen `office-*`. Lösungsfinder und Themenfilter steuert das WPCodeBox-Snippet „WEKA Büro & Verwaltung – Lösungsfinder“ (`snippets/weka-buero-verwaltung.js`, JavaScript, Footer, lokal ID 84): Bricks erlaubt kein `select` als eigenes Tag, deshalb stehen die Optionen im Builder als Liste (`ul[data-office-select]`) und das Snippet macht daraus Auswahlfelder. Themen und Fragen klappen mit `details`/`summary` auf (ohne Skript). Übertragung auf Live: [docs/buero-verwaltung-auf-live.md](docs/buero-verwaltung-auf-live.md). Lokal eingespielt per WP-CLI (Klassen und Seiteninhalt, `--user=kkotthaus`, sonst verwirft Bricks den Inhalt), die Vorlagen sind lokal nicht importiert.
- Seite „Zielgruppe“ (lokal ID 10865, `/zielgruppe/`, veröffentlicht) nach dem Entwurf in [docs/vorlagen/zielgruppe/](docs/vorlagen/zielgruppe/) (HTML und Screenshots von weka-buero-unterweisen.rockypetal10.chatgpt.site/zielgruppe/, Stand 19.10.2026): fünf Sections `bricks/zielgruppe-*.json`, erzeugt mit `node tools/zielgruppe.mjs`. Neue Klassen `audience-*` und `office-plan--straight`, dazu Klassen `office-*` von Büro-Verwaltung (das Skript liest sie aus `bricks/buero-verwaltung-*.json`). Die drei Symbole der Zielgruppen-Karten sind SVG-Elemente mit Code und brauchen eine Code-Signatur (lokal beim Einspielen signiert). Die Karte „Büro & Verwaltung“ verlinkt auf die Unterseite `/zielgruppe/buero-verwaltung/`. Die Kurs-Taxonomie „Zielgruppen“ (Meta Box) belegt `/zielgruppe/<begriff>/`; damit Unterseiten trotzdem erreichbar sind, gibt es das PHP-Snippet „WEKA Zielgruppe – Unterseiten“ (`snippets/weka-zielgruppe-unterseiten.php`, Root, lokal ID 85): Unterseite vor Archiv. Unterseiten nie wie einen Taxonomie-Begriff benennen. Wie beide Seiten in die Navigation kommen, ist noch offen. Übertragung auf Live: [docs/zielgruppe-auf-live.md](docs/zielgruppe-auf-live.md).
- Die Anleitungen für Live (`docs/referenzen-neu-auf-live.md`, `docs/live-angebot-pdf.md`, `docs/buero-verwaltung-auf-live.md`, `docs/zielgruppe-auf-live.md`) gibt es als PDF in `docs/pdf/`: `node tools/pdf.mjs` (Chrome oder Edge, keine Abhängigkeiten). Nach Änderungen an den Anleitungen neu bauen und die PDFs mit committen. Auf der Karte in der Übersicht (`windows-dev/projekte.json`) als Dokumente verlinkt.

### Plugins (Duplicator-Archiv vom 28.09.2026)

Lokale Arbeitskopie: Local-Seite **weka-e** (http://weka-e.local), am 15.10.2026 neu aus dem Duplicator-Paket von Staging eingerichtet (Paket in `backup/`, nicht im Repo). Bricks 2.4.2 + Child-Theme aktiv, WordPress 7.1.3. Lokal ist in `wp-config.php` die Zeile `$_SERVER['HTTPS']='on'` auskommentiert (gilt nur für den Reverse Proxy auf Staging).

Die Plugin-Liste unten ist der Stand vom 28.09.2026. Seit Staging zusätzlich aktiv: WS Form Pro (+ HubSpot, PDF) für den Angebotskonfigurator.

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
