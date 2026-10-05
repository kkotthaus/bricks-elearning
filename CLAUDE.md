# bricks-nodes – gemeinsame Standards für Bricks-/WordPress-Projekte

Diese Datei wird aus einem Projekt importiert (`@bricks-nodes/CLAUDE.md`). Alle Verweise sind relativ zu diesem Ordner.

**Die Standards in bricks-nodes sind führend** für alle Bricks-Projekte: Stack, Konventionen, Technik, Barrierefreiheit und Betrieb gelten so, wie sie hier stehen. Ein Projekt weicht nur bei Projektspezifischem ab (Namen, Domains, Prefix, Plugin-Versionen, Inhalte) – das steht in der CLAUDE.md des Projekts und hat dort Vorrang. Widerspricht eine Projekt-Doku einem Standard, gilt der Standard; die Projekt-Doku wird angepasst. **Design** (Farben, Farbregeln, Kontraste, Schriften, Schatten, Rundungen, Abstands- und Größenwerte, ACSS-Einstellungswerte, Logo, Bildsprache, Gestaltung der Sections) steht nie hier, sondern immer lokal im Projekt – jede Website hat ihr eigenes Design. `<prefix>` bzw. `<PREFIX>` steht für das Kürzel des Projekts.

## Stack und Regeln

@docs/development-environment.md
@docs/konventionen.md
@docs/plugins.md
@docs/betrieb.md

## Arbeitsweise

- Antworte auf Deutsch.
- Bricks Builder mit **Automatic.css 3.x**. Primär mit den Variablen, Klassen und Einstellungen von ACSS arbeiten; eigene Werte nur, wenn ACSS es nicht abdeckt (siehe [docs/konventionen.md](docs/konventionen.md#acss-3x)).
- **Klassen nach BEM** (`block__element--modifier`), in Bricks als **globale Klassen**.
- **CSS gehört in die Klasse des Elements:** Stil-Felder der globalen Klasse, was dort fehlt ins Custom-CSS-Feld **derselben** Klasse. Kein separates CSS-File, kein CSS in WPCodeBox, im Child-Theme oder in der Seite, keine ID- oder Element-Styles. Siehe [docs/konventionen.md](docs/konventionen.md#css-in-der-klasse).
- Interaktive Bausteine nicht selbst bauen: zuerst Bricks-Elemente, dann BricksExtras (siehe [docs/plugins.md](docs/plugins.md#reihenfolge)).
- Felder, Beitragstypen und Einstellungsseiten mit Meta Box; Ausgabe über Bricks Dynamic Data und Query Loops.
- **Snippets (PHP, JavaScript) werden in WPCodeBox angelegt** – nie in `functions.php`, mu-plugins, im Bricks-Code-Element oder in den Bricks-Code-Einstellungen. WPCodeBox-tauglich schreiben (`define()` statt `const`, kein `__DIR__`). Siehe [docs/betrieb.md](docs/betrieb.md#php-und-javascript-als-wpcodebox-snippets).
- Gestaltung (Farben, Schriften, Look) nach der Design-Doku des Projekts.
- Vor dem Speichern im Builder Ergebnis in allen Breakpoints prüfen (Screenshot); gespeichert wird nach Freigabe.
- Dieser Ordner ist ein git subtree (siehe [README.md](README.md)). Änderungen hier nur, wenn sie für alle Bricks-Projekte gelten, und generisch formuliert – ohne Projektnamen, URLs, Prefixe oder Pfade eines Projekts.
