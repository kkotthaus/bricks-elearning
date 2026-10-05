# Konventionen für Bricks-Projekte

Regeln für Klassen, CSS, ACSS, Responsive, Icons, Benennung, Daten und Barrierefreiheit. `<prefix>` steht für das Kürzel des Projekts.

**Design bleibt im Projekt.** Farben, Farbregeln, Schriften, Schatten, konkrete Werte und die ACSS-Einstellungen eines Projekts stehen in dessen Design-Doku (z. B. `<projekt>/docs/design.md`), nie hier.

## Reihenfolge: ACSS zuerst

Für jede Gestaltungsaufgabe in dieser Reihenfolge entscheiden:

1. **ACSS-Einstellung** – Was global gilt (Button-Stil, Überschriften, Abstände der Sections, Links, Fokus, Farbschema), wird im ACSS-Dashboard eingestellt, nicht nachgebaut.
2. **ACSS-Klasse** – Gibt es eine ACSS-Klasse dafür, wird sie dem Element gegeben (z. B. `btn--primary`, `btn--outline`, `bg--primary-dark`, `text--white`, `grid--3`, `grid--m-1`, `gap--m`, `flex--col`, `pad-section--l`, `content-grid`, `width--l`, `hidden-accessible`).
3. **BEM-Klasse mit ACSS-Variablen** – Nur was ACSS-Klassen nicht abdecken, bekommt eine eigene BEM-Klasse; alle Werte darin als ACSS-Variablen.
4. **Eigener Wert** – Nur wenn ACSS weder Klasse noch Variable bietet oder es nicht funktioniert; Grund im Custom-CSS der Klasse kommentieren.

ACSS-Klassen und BEM-Klasse dürfen am selben Element stehen (`hero__actions` + `flex--row` + `gap--s`). Keine eigenen Klassen, die ACSS-Klassen nachbilden (keine eigenen Button-, Farb- oder Grid-Klassen). ACSS-Klassen erscheinen in Bricks als gesperrte globale Klassen – nie bearbeiten oder umbenennen.

## ACSS 3.x

- **Version 3.x.** Variablen und Klassen aus der v3-Doku; nichts aus ACSS 4 übernehmen.
- **Farben nur als ACSS-Variablen** – kein Hex/RGB/HSL im Element oder in Klassen:
  - Grundfarben `var(--primary)`, `--secondary`, `--tertiary`, `--accent`, `--base`, `--neutral`, `--shade`, `--action`, Status `--success`, `--warning`, `--danger`, `--info` (nur die im Projekt aktivierten).
  - Abstufungen `-ultra-light`, `-light`, `-semi-light`, `-medium`, `-semi-dark`, `-dark`, `-ultra-dark`, `-hover`.
  - Transparenzen `--<farbe>-trans-10` … `-90`, auch `--black-trans-*`, `--white-trans-*` – nicht selbst berechnen.
  - Im Bricks-Farbwähler Werte als `var(--…)` (raw) eintragen bzw. die ACSS-Palette nutzen.
  - Neue Farben nur im ACSS-Dashboard anlegen. Welche Farbe wofür, regelt das Projekt-Design.
- **Abstände** `var(--space-xs…xxl)`, Sections `var(--section-space-xs…xxl)`, Lücken `var(--content-gap)`, `var(--container-gap)`, `var(--grid-gap)`, seitlich `var(--gutter)`.
- **Typografie** `var(--text-xs…xxl)`, `var(--h1…h6)`; Überschriftenfarbe, -gewicht und -abstände kommen aus den Einstellungen – nicht je Element nachfärben.
- **Radius** `var(--radius)`, `var(--radius-xs…xl)`; **Breite** `var(--content-width)`, `var(--width-*)`.
- Keine eigenen Bricks-Variablen (Variablen-Manager) für etwas, das ACSS kennt.
- **Breakpoints von Bricks und ACSS aufeinander abstimmen**, damit ACSS-Responsive-Klassen (`grid--m-1`) und Bricks-Breakpoints an denselben Breiten umschalten. Die Werte stehen im Projekt.
- ACSS-Module, die nicht genutzt werden, im Dashboard ausschalten (weniger CSS). Welche aktiv sind, hält das Projekt fest.

## BEM-Klassen

- Schema `.block`, `.block__element`, `.block--modifier`, `.block__element--modifier`; klein, mit Bindestrich: `.course-card__title`.
- Blockname = vom Nutzer genannter Name, sonst sprechend englisch. Keine Projekt-Präfixe in Klassen nötig.
- In Bricks als **globale Klassen** anlegen (`settings._cssGlobalClasses`). Der BEM-Generator von ACSS 3 in Bricks darf genutzt werden.
- Modifier nur zusätzlich zur Block- bzw. Element-Klasse, nie allein.
- Varianten über Modifier, auch dynamisch: Klasse mit Dynamic Data (z. B. `status--{mb_…}`) statt verschiedener Element-Zweige.
- Keine Styles an Bricks-IDs (`#brxe-…`) und keine Element-Styles (Stil-Felder direkt am Element). Ausnahme: rein inhaltliche Einstellungen (Text, Tag, Link, Bildquelle, Button-Icon).

## CSS in der Klasse

**Das gesamte CSS einer Section/Komponente steckt in ihren globalen Klassen.** Kein separates CSS-File, kein CSS in WPCodeBox, im Child-Theme, in Seiten- oder Template-Einstellungen, im Code-Element oder in einer Klasse eines anderen Elements.

1. **Stil-Felder der Klasse** (bevorzugt, im Builder sichtbar):
   - Layout `_display`, `_direction`, `_flexWrap`, `_alignItems`, `_justifyContent`, `_gridTemplateColumns`, `_rowGap`, `_columnGap`, `_flexGrow`/`_flexShrink`/`_flexBasis`
   - Größe `_width`, `_widthMax`, `_widthMin`, `_height`
   - Abstände `_margin`, `_padding` (`top/right/bottom/left`)
   - Typografie `_typography` (`font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform`, `text-align`, `color: {raw}`)
   - Hintergrund `_background: { color: { raw: "var(--…)" } }`, Rahmen `_border`, Position `_position`, `_top…`, `_zIndex`, `_overflow`, `_objectFit`
   - Zustände als Zustand der Klasse (`_background:hover`, `_typography:hover`).
2. **Custom-CSS-Feld derselben Klasse** (`_cssCustom`) nur für das, was Bricks nicht als Feld hat: Pseudo-Elemente, `transition`, `box-shadow`, `filter`, `:focus-visible`, `list-style`, `hyphens`, `overflow-wrap`, `@container`, Kind-Selektoren für fremdes Markup (z. B. Rich-Text). Mit echtem Klassen-Selektor (`.block__element { … }`), nicht `%root%`, und nur Regeln, die diese Klasse betreffen.
3. Globale Grundlagen (Typografie, Links, Fokus, Section-Abstände) über ACSS-Einstellungen; Bricks-Theme-Styles nicht für Gestaltung nutzen.

Bricks schreibt das Klassen-CSS selbst (Einstellung „CSS-Lademethode: Externe Dateien“ empfohlen) – das ist kein eigenes CSS-File im Sinne dieser Regel.

## Responsive

- Werte für kleinere Bildschirme in den **Bricks-Breakpoints der Klasse** (`_gridTemplateColumns:tablet_portrait`, `:mobile_landscape`, `:mobile_portrait`) bzw. per ACSS-Responsive-Klasse (`grid--m-1`).
- Desktop zuerst; Tablet hoch: Spalten reduzieren; Mobil quer: einspaltig, Flex-Reihen stapeln, CTA-Buttons volle Breite (`--btn-width: 100%`); Mobil hoch: Feinschliff.
- Grids mit `minmax(0, 1fr)` statt `1fr`. Überschriften `max-width: 100%; overflow-wrap: break-word; hyphens: auto`.
- Bilder `width: 100%; height: auto`, Logos feste Höhe + `width: auto`.
- Button-Gruppen gleich groß (Grid mit gleichen Spalten, `grid-auto-rows: 1fr`).
- Kein horizontaler Überlauf bei 375 px. Prüfen bei 1300 / 900 / 600 / 375 px.

## Icons

- Bevorzugt **SVG-Element** (`name: "svg"`, `source: "code"`) mit `currentColor`; Farbe über die Textfarbe, Größe über `width`/`height` der Klasse (z. B. `1em`).
- Rein dekorative Icons `aria-hidden="true"`; bedeutungstragende mit zugänglichem Namen.
- Button-Icons dürfen die Icon-Einstellung des Buttons nutzen.

## Benennung im Builder

- Jedes Element bekommt ein sprechendes deutsches **Label** nach Bedeutung („Hero – Einstieg“, „Preiskarte Basic“, „Button: Termin buchen“).
- Templates und Komponenten sprechend benennen; Template-Bedingungen im Projekt dokumentieren.

## Wiederverwendung

- Wiederkehrende Bausteine (Karten, CTA, Listen) als **Bricks-Komponente** (mit Eigenschaften) oder Section-Template; nicht kopieren.
- Gemeinsame BEM-Blöcke (z. B. `.eyebrow`, `.check-list`) einmal anlegen und überall nutzen.
- Dynamische Inhalte (Telefon, Adresse, Öffnungszeiten) nie als Text ins Element schreiben, sondern aus der Meta-Box-Einstellungsseite lesen.

## Meta Box

- Beitragstypen, Taxonomien, Feldgruppen und Einstellungsseiten mit Meta Box. Feld-IDs mit Präfix `<prefix>_`.
- Ausgabe in Bricks über **Dynamic Data** (Blitz-Symbol, Tags `{mb_…}`) und **Query Loops** (Beitragstyp, Meta-Box-Relationship, klonbare Gruppen). Tag immer über die Auswahl einfügen, nicht abtippen.
- Bedingungen in Bricks (Element-Bedingungen) statt leerer Ausgaben: Section nur zeigen, wenn das Feld gefüllt ist.
- Werte, die PHP berechnen muss (Status, Summen), per WPCodeBox-Funktion bereitstellen und über `{echo:<prefix>_funktion}` ausgeben; die Funktion in Bricks › Einstellungen › Benutzerdefinierter Code für `echo` freigeben. Keine Shortcodes mit Markup.
- **Datumsfelder in Gruppen** speichert Meta Box im Anzeigeformat – beim Lesen beide Formate akzeptieren.
- Datenmodell aus dem Builder per WP-CLI (`wp eval-file`, nur lesend) als JSON ins Repo exportieren und nach Änderungen neu exportieren.

## Barrierefreiheit

- Ziel WCAG 2.1 AA. Kontraste regelt das Projekt-Design.
- Semantische Tags im Element setzen (`section`, `nav`, `header`, `footer`, `ul/li`, Überschriften-Hierarchie). Ein `h1` je Seite.
- Ausgeblendete Elemente (geschlossene Modals, inaktive Slides, mobiles Menü) per Tab nicht erreichbar.
- Zugänglicher Name von Schaltflächen = sichtbarer Text (WCAG 2.5.3); Links mit sprechendem Text.
- `prefers-reduced-motion` beachten (ACSS „Reduce Motion“, Animationen in Motion.page/Interactions abschaltbar).

## KI-Kennzeichnung

KI-erzeugte oder -veränderte Bilder und Videos werden gekennzeichnet (EU-KI-Verordnung Art. 50). Datenmodell wie in allen Projekten: Meta-Box-Feld `ki_art` am Anhang (`ai`, `generated`, `modified`; leer = keine KI), optional `ki_werkzeug`. Ausgabe in Bricks über eine Bedingung auf das Feld und eine BEM-Plakette (`.ki-plakette`), Hinweis zusätzlich im Alternativtext. Symbol, Farben und Texte legt das Projekt fest.
