# Bricks-Nodes – Entwicklungsumgebung

Referenz für den technischen Stack der Bricks-Projekte. Regeln für Klassen, CSS und Daten: [konventionen.md](konventionen.md). Zusatz-Plugins und ihr Einsatz: [plugins.md](plugins.md). Arbeitsablauf und Veröffentlichen: [betrieb.md](betrieb.md). Das Design steht im jeweiligen Projekt.

Versionen stehen hier bewusst nicht (Ausnahme: ACSS-Hauptversion 3.x ist vorgegeben). Welche Versionen ein Projekt einsetzt, hält das Projekt fest.

## Stack (Pflicht)

| Baustein | Slug | Zweck | Doku |
| --- | --- | --- | --- |
| WordPress | – | CMS-Basis | – |
| **Bricks Builder** | Theme `bricks` + Child-Theme | Visueller Builder: Elemente, globale Klassen, Templates (Header, Footer, Single, Archiv, Section, Popup), Komponenten, Query Loops, Dynamic Data, Bedingungen, Interactions. Das Child-Theme bleibt leer (kein CSS, kein PHP – PHP gehört nach WPCodeBox). | [academy.bricksbuilder.io](https://academy.bricksbuilder.io/) |
| **Automatic.css 3.x (ACSS)** | `automaticcss-plugin` | Design-System: Variablen (Farben, Abstände, Typografie, Radius), Utility-Klassen, Buttons, Breakpoints, Builder-Integration in Bricks. **Version 3.x** – keine v4-Syntax oder -Variablen verwenden. | [automaticcss.com/docs](https://automaticcss.com/docs/) (Version 3) |
| **Meta Box AIO** | `meta-box-aio` | Eigene Felder, Beitragstypen, Taxonomien, Einstellungsseiten, Relationships. Bricks liest Meta-Box-Felder nativ (Dynamic Data, Query Loops). | [docs.metabox.io](https://docs.metabox.io/) |
| **WPCodeBox 2** | `wpcodebox2` | Alle Snippets (PHP, JavaScript) werden hier angelegt. **Kein CSS** (CSS steht in den Bricks-Klassen). | [docs.wpcodebox.com](https://docs.wpcodebox.com/) |
| **Duplicator Pro** | `duplicator-pro` | Backup und Migration (lokal → Staging → Live). | [duplicator.com/knowledge-base](https://duplicator.com/knowledge-base/) |

## Bricks-Ergänzungen (je Projekt)

Bewertung und Einsatzregeln stehen in [plugins.md](plugins.md).

| Baustein | Slug | Kurz |
| --- | --- | --- |
| BricksExtras | `bricksextras` | Zusätzliche Bricks-Elemente (u. a. Modal, OffCanvas, Pro Slider, Pro Accordion/Tabs, Lightbox, Inhaltsverzeichnis, Media Player) und Bedingungen |
| Frames | `frames-plugin` | Wireframe-/Section-Bibliothek und Widgets von den ACSS-Machern, auf ACSS 3 abgestimmt |
| WP Grid Builder + Bricks-/Meta-Box-/Caching-Add-on | `wp-grid-builder`, `wp-grid-builder-bricks`, `wp-grid-builder-meta-box`, `wp-grid-builder-caching` | Facetten (Filter, Suche, Sortierung, Pagination) für Bricks Query Loops |
| HappyFiles Pro | `happyfiles-pro` | Ordner in der Mediathek (vom Bricks-Team) |
| Motion.page | `motionpage` | Animationen mit Zeitleiste (GSAP) |
| BricksLabs Bricks Navigator | `brickslabs-bricks-navigator` | Schnellzugriff auf Bricks-Bereiche in der Admin-Leiste (nur Arbeitshilfe) |
| WS Form Pro | `ws-form-pro` | Formulare mit Bricks-Element |
| Admin Columns Pro | `admin-columns-pro` | Spalten und Filter in Backend-Listen, auch für Meta-Box-Felder |
| User Role Editor Pro | `user-role-editor-pro` | Benutzerrollen und Capabilities |

**Nicht im Standard:** Bricks Forge – überschneidet sich weitgehend mit BricksExtras. Nicht zusätzlich installieren; wenn ein Projekt es braucht, BricksExtras-Elemente mit gleicher Funktion abschalten.

## Plugin-Bestand prüfen

Zu Beginn eines Projekts (und nach Übernahme einer bestehenden Seite) den Bestand mit Status und Version festhalten und mit [plugins.md](plugins.md) abgleichen:

```bash
wp plugin list --fields=name,status,version --format=table
wp theme list --fields=name,status,version
wp option get bricks_global_settings --format=json   # Bricks-Einstellungen (nur lesen)
```

Ergebnis in die Projekt-Doku übernehmen: welche Plugins aktiv sind, welche ungenutzt (→ deaktivieren nach Rückfrage) und welche sich überschneiden (z. B. mehrere SEO-, Schema- oder Formular-Plugins).

## Updates

- Automatische Updates sind für alle Plugins und das Bricks-Theme aus. Updates von Hand, vorher Backup.
- Nach Updates von Bricks, ACSS, BricksExtras oder Frames im Frontend und im Builder prüfen: Header (auch mobil), Popups/Modals, Slider, Akkordeons, Formulare, Query Loops mit Facetten.
- Nach einem ACSS-Update die ACSS-Einstellungen einmal speichern (CSS neu erzeugen); nach einem Bricks-Update unter Bricks › Einstellungen › Performance das CSS neu erzeugen, wenn „Externe Dateien“ eingestellt ist.
