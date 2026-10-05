# Angebotskonfigurator von lernen.weka.de aufrufen

Stand: 05.10.2026 – Konzept, noch nicht umgesetzt.

**Frage:** Kann der Angebotskonfigurator (PDF-Preisauskunft) von der Website lernen.weka.de aus aufgerufen werden?

**Antwort:** Ja. lernen.weka.de („WEKA eCampus“) ist eine eigene WordPress-Installation, auf die wir keinen Zugriff haben. Der Konfigurator bleibt deshalb auf der WEKA-E-Learning-Seite (Staging: Seite 10801) und wird von lernen.weka.de nur aufgerufen. Formular, PDF, Preise und Mails bleiben an einer Stelle.

## Möglichkeiten

### 1. Link bzw. Button – empfohlen

Auf lernen.weka.de ein Button, z. B. „Preisauskunft erstellen“, der auf die Konfigurator-Seite führt.

**Erweiterung: Vorauswahl per Link.** Der Link gibt Kurse und Teilnehmerzahl mit, der Besucher landet direkt in Schritt 2:

```
https://<live-domain>/<konfigurator-seite>/?kurse=alkohol-drogen-und-medikamente,allgemeines-gleichbehandlungsgesetz-agg&tn=12
```

| Parameter | Inhalt | Beispiel |
| --- | --- | --- |
| `kurse` | Kurs-Slugs, mit Komma getrennt (wie `data-course-slug` der Kurskarten) | `alkohol-drogen-und-medikamente` |
| `tn` | Teilnehmerzahl für alle Kurse (optional, Standard 20) | `12` |

- Slugs statt IDs, weil sie lesbar sind und zwischen Staging und Live gleich bleiben (IDs ändern sich beim Übertragen).
- Unbekannte Slugs werden ignoriert; bleibt kein Kurs übrig, startet der Konfigurator normal in Schritt 1.
- Ein Link mit Parametern ersetzt eine angefangene Auswahl im Browser (sessionStorage).
- So kann z. B. jede Kursseite auf lernen.weka.de einen Button haben, der genau diesen Kurs vorauswählt.

**Aufwand:**
- Konfigurator-Skript (`snippets/weka-angebot-konfigurator.js`): beim Start `kurse`/`tn` aus der Adresse lesen, Kurse auswählen, zu Schritt 2 springen.
- lernen.weka.de: nur Links/Buttons setzen.

### 2. Einbetten per iframe

Der Konfigurator erscheint innerhalb einer Seite von lernen.weka.de.

- Technisch möglich: Die WEKA-E-Learning-Seite sendet derzeit weder `X-Frame-Options` noch `frame-ancestors` (geprüft am 05.10.2026 auf dem Staging). Live vor dem Einbau prüfen und ggf. `frame-ancestors https://lernen.weka.de` erlauben.
- Nachteile:
  - Die Höhe des iframes passt sich nicht von selbst an; nötig ist ein kleines Skript auf beiden Seiten (`postMessage`).
  - Cookie-Banner und Datenschutzhinweise müssen auf beiden Seiten zusammenpassen; Cookies im iframe gelten als Drittanbieter-Cookies.
  - Auf lernen.weka.de muss jemand Code einfügen.

### 3. Nachbau auf lernen.weka.de – nicht empfohlen

Zweite Installation mit Formular, PDF-Add-on und Preisen. Preise, Rabatte und Vorlage müssten doppelt gepflegt werden.

## Empfehlung

Möglichkeit 1 mit Vorauswahl per Link: wenig Aufwand, eine Stelle für Preise, PDF und Mails.

## Offen

- [ ] Wer pflegt lernen.weka.de und setzt die Links?
- [ ] Ziel-Adresse: die spätere **Live**-Adresse der Konfigurator-Seite (nicht das Staging).
- [ ] Vorauswahl per Link (`?kurse=…&tn=…`) im Konfigurator umsetzen – erst auf dem Staging, dann mit der Übernahme nach [live-angebot-pdf.md](live-angebot-pdf.md).
- [ ] Liste der Kurs-Slugs für die Redaktion von lernen.weka.de (aus den Kurskarten der Konfigurator-Seite).
