# Bricks-relevante Plugins

Wofür jedes Plugin eingesetzt wird und wie. Welche davon ein Projekt aktiv nutzt, hält das Projekt fest (Bestand prüfen: [development-environment.md](development-environment.md#plugin-bestand-prüfen)).

## Reihenfolge

Für interaktive Bausteine (Akkordeon, Tabs, Modal/Popup, OffCanvas, Slider, Lightbox, Inhaltsverzeichnis, Menü):

1. **Bricks-Element** (nestable Accordion/Tabs/Slider, Offcanvas, Popup-Template, Nav (Nestable), Dropdown, Toggle), wenn es Tastaturbedienung und ARIA mitbringt.
2. **BricksExtras**, wenn Bricks den Baustein nicht hat oder nicht ausreicht.
3. **Frames-Widgets** nur, wenn das Projekt Frames ohnehin nutzt.
4. Eigenes JavaScript nur, wenn nichts davon passt – als WPCodeBox-Snippet, Grund dokumentieren.

Je Website für dieselbe Aufgabe **ein** Werkzeug (z. B. Slider nur aus einer Quelle). Gestaltet wird auch bei Fremdelementen über BEM-Klassen mit ACSS-Variablen ([konventionen.md](konventionen.md#css-in-der-klasse)).

## BricksExtras

- Zusätzliche Elemente, u. a. Pro Accordion, Pro Tabs, Pro Slider (Splide), Modal, OffCanvas, Lightbox, Burger Trigger, Slide Menu, Header Row, Inhaltsverzeichnis, Media Player, Popover/Tooltip, Breadcrumbs, Lesefortschritt, Back to Top, Social Share, Before/After, Countdown; dazu zusätzliche **Bedingungen** für Bricks.
- **Nur die genutzten Elemente in den BricksExtras-Einstellungen aktivieren**, alle anderen aus (weniger Code, übersichtlicher Builder). Die aktiven Elemente im Projekt dokumentieren.
- Gestaltung über eine BEM-Klasse am Element; interne Teile über die Stil-Felder des Elements nur, wenn sie nicht per Klasse erreichbar sind, sonst per Kind-Selektor im Custom-CSS der BEM-Klasse.
- Modals/OffCanvas: Auslöser als echter `<button>`, Fokus beim Öffnen hinein, beim Schließen zurück, `Esc` schließt – nach Einbau mit Tastatur prüfen.
- **Bricks Forge** nicht parallel einsetzen (überschneidet sich mit BricksExtras).

## Frames

- Von den ACSS-Machern, auf ACSS 3 abgestimmt: Bibliothek fertiger Sections/Wireframes und einige Widgets (Modal, Slider, Inhaltsverzeichnis, Notes). Die zugehörigen Frames-Module in ACSS nur aktivieren, wenn sie genutzt werden.
- Frames-Sections als **Ausgangspunkt** einfügen, dann den Block auf den Projektnamen umbenennen (`fr-…` → eigener BEM-Block) und auf das Projekt-Design anpassen. Keine `fr-`-Klassen dauerhaft stehen lassen, die projektspezifisch verändert wurden.
- Frames-CSS sitzt in globalen Klassen – passt zur Regel „CSS in der Klasse“.

## WP Grid Builder (+ Bricks, Meta Box, Caching)

- Für **Filter, Suche, Sortierung und Pagination** von Bricks Query Loops. Das Bricks-Add-on verbindet Facetten mit einem Bricks Query Loop, das Meta-Box-Add-on macht Meta-Box-Felder als Facetten-Quelle nutzbar, das Caching-Add-on beschleunigt die Abfragen.
- Die Liste selbst bleibt ein Bricks Query Loop mit BEM-Klassen; WPGB liefert nur die Facetten. Keine WPGB-Grids/Karten-Builder für neue Listen.
- Facetten-Stil über die WPGB-Einstellungen bzw. eine BEM-Klasse am Facetten-Element, Farben aus ACSS-Variablen.

## Meta Box AIO

- Siehe [konventionen.md](konventionen.md#meta-box). Ist zusätzlich das einzelne Plugin `meta-box` installiert, prüfen, ob es noch gebraucht wird (AIO enthält das Framework).

## HappyFiles Pro

- Ordner für die Mediathek (vom Bricks-Team). Ordnerstruktur je Projekt festlegen (z. B. nach Bereich/Beitragstyp). Keine Gestaltungsfunktion.

## Motion.page

- Für Animationen, die Bricks Interactions nicht leisten (Zeitleisten, Scroll-gesteuert). Einfache Ein-/Ausblendungen mit Bricks Interactions bzw. ACSS.
- Auslöser und Ziele über **BEM-Klassen** oder Datenattribute, nie über Bricks-IDs (`#brxe-…`).
- Bei `prefers-reduced-motion` Animationen aus bzw. reduziert; Inhalte müssen ohne Animation sichtbar sein.

## Formulare (WS Form Pro, Bricks-Formular)

- **Ein Formular-Plugin je Website.** WS Form Pro für komplexe Formulare und Integrationen (z. B. CRM), sonst das Bricks-Formular-Element. Weitere Formular-Plugins (z. B. Funnel-Formulare) nur mit klarem Zweck; Überschneidungen im Projekt dokumentieren.
- Formular-Stil über die Stileinstellungen des Formular-Plugins mit ACSS-Variablen bzw. eine BEM-Klasse am Element – kein separates CSS-File. Ist in ACSS das Formular-Styling an, prüfen, dass es nicht mit dem Plugin-Stil kollidiert.
- Fehlermeldungen mit Text, nicht nur Farbe; Pflichtfelder gekennzeichnet; Labels immer sichtbar.

## Admin Columns Pro

- Spalten, Filter und Inline-Bearbeitung in Backend-Listen, auch für Meta-Box-Felder – erleichtert die Pflege ohne Webmaster. Einstellungen als Datei exportieren und ins Repo legen.

## User Role Editor Pro

- Eigene Rollen, z. B. Redaktion nur für bestimmte Beitragstypen; Bricks-Builder-Zugriff in Bricks › Einstellungen › Builder-Zugriff je Rolle festlegen (Redaktion: höchstens „Nur Inhalte bearbeiten“). Ist zusätzlich die kostenlose Version installiert, prüfen, ob sie gebraucht wird.

## BricksLabs Bricks Navigator

- Reine Arbeitshilfe (Schnellzugriff in der Admin-Leiste). Live nicht nötig.

## Leistung, SEO, Datenschutz

- **WP Rocket:** Builder-Aufrufe (`?bricks=run`) und eingeloggte Benutzer nicht cachen. „JavaScript verzögern“ und „Ungenutztes CSS entfernen“ nach Aktivierung mit allen interaktiven Elementen (BricksExtras, Slider, Facetten, Motion.page) prüfen; betroffene Skripte ausnehmen. Seiten mit „jetzt“-abhängigen Daten kurz cachen.
- **SEO und Schema:** genau **ein** SEO-Plugin und **eine** Schema-Quelle. Sind mehrere installiert (z. B. SEO-Plugin mit Schema + eigenes Schema-Plugin), doppelte JSON-LD-Ausgaben prüfen und eines abschalten (nach Rückfrage).
- **Cookie-Banner:** Einbettungen (Video, Karten) erst nach Einwilligung laden; mit dem Media Player bzw. den Bricks-Elementen testen.
