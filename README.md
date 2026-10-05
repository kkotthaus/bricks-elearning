# bricks-nodes

Gemeinsame Standards für WordPress-Projekte mit Bricks Builder, Automatic.css 3.x, Meta Box und WPCodeBox: Stack, Konventionen, Plugins und Betrieb. Die Inhalte sind generisch und enthalten keine Projektdaten und kein Design. Das Design (Farben, Schriften, Look) legt jede Website lokal ab.

| Datei | Inhalt |
| --- | --- |
| [CLAUDE.md](CLAUDE.md) | Einstieg für Claude Code, importiert die Doku |
| [docs/development-environment.md](docs/development-environment.md) | Stack, Updates, Plugin-Bestand prüfen |
| [docs/konventionen.md](docs/konventionen.md) | BEM, CSS in der Klasse, ACSS 3.x, Responsive, Icons, Benennung, Meta Box, Barrierefreiheit |
| [docs/plugins.md](docs/plugins.md) | Bricks-relevante Plugins: wofür und wie sie eingesetzt werden |
| [docs/betrieb.md](docs/betrieb.md) | Arbeiten im Builder, Clipboard-JSON, WPCodeBox, Duplicator, Caching |

## In ein Projekt einbinden (git subtree)

Das Repo liegt im Projekt unter `<projekt>/bricks-nodes/`. Einmalig im Projekt-Root:

```bash
git remote add bricks-nodes https://github.com/kkotthaus/bricks-nodes.git
git subtree add --prefix=bricks-nodes bricks-nodes main --squash
```

Danach in der `CLAUDE.md` des Projekts importieren:

```markdown
@bricks-nodes/CLAUDE.md
```

Bei allen späteren `pull`/`push` ebenfalls `--squash` verwenden bzw. konsequent weglassen – nicht mischen.

## Aktualisieren

```bash
git fetch bricks-nodes
git subtree pull --prefix=bricks-nodes bricks-nodes main --squash
```

## Änderungen zurückgeben

Am besten direkt in diesem Repo ändern und in den Projekten `subtree pull` ausführen. Wurde doch im Projekt unter `bricks-nodes/` geändert:

```bash
git subtree push --prefix=bricks-nodes bricks-nodes <branch>
```

Dann einen Pull Request von `<branch>` nach `main` stellen.

## Regeln für dieses Repo

- Die Standards hier sind **führend** für alle Bricks-Projekte. Neue allgemeine Regeln entstehen hier und werden per `subtree pull` übernommen.
- Kein Design: keine Farben, Schriften, Schatten, konkreten Abstands- oder Größenwerte, ACSS-Einstellungswerte, Logos oder Gestaltungsvorgaben.
- Generisch formulieren: keine Projektnamen, Domains, Prefixe, Pfade, IDs oder Versionsstände (außer der vorgegebenen Hauptversion ACSS 3.x). Platzhalter `<prefix>` / `<PREFIX>`.
- Verweise immer relativ innerhalb von `bricks-nodes/`.
