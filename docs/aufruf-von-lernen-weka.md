# Angebotskonfigurator von lernen.weka.de aufrufen

Stand: 05.10.2026 – Konzept, noch nicht umgesetzt.

**Frage:** Kann der Angebotskonfigurator (PDF-Preisauskunft) von der Website lernen.weka.de aus aufgerufen werden?

**Antwort:** Ja. lernen.weka.de („WEKA eCampus“) ist **kein WordPress**, sondern die Lernplattform selbst: eine Nuxt-Anwendung (Vue.js), Dateien vom CDN `cdnlernen.weka.de/f/<build>-prdwekal-…/` mit eigenem Plattform-Stylesheet (geprüft am 05.10.2026; keine `wp-content`-Spuren, `/wp-json/` leitet nur auf `/de/…` um). Wir haben dort keinen Zugriff; was sich einfügen lässt, bestimmt die Plattform bzw. ihr Anbieter. Der Konfigurator bleibt deshalb auf der WEKA-E-Learning-Seite (Staging: Seite 10801) und wird von lernen.weka.de nur aufgerufen. Formular, PDF, Preise und Mails bleiben an einer Stelle.

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
- lernen.weka.de: nur Links/Buttons setzen – in der Regel ohne Programmierung über die Inhaltspflege der Plattform möglich (mit dem Betreiber klären).

### 2. Einbetten per iframe

Der Konfigurator erscheint innerhalb einer Seite von lernen.weka.de.

- Technisch möglich: Die WEKA-E-Learning-Seite sendet derzeit weder `X-Frame-Options` noch `frame-ancestors` (geprüft am 05.10.2026 auf dem Staging). Live vor dem Einbau prüfen und ggf. `frame-ancestors https://lernen.weka.de` erlauben.
- Nachteile:
  - Die Höhe des iframes passt sich nicht von selbst an; nötig ist ein kleines Skript auf beiden Seiten (`postMessage`).
  - Cookie-Banner und Datenschutzhinweise müssen auf beiden Seiten zusammenpassen; Cookies im iframe gelten als Drittanbieter-Cookies.
  - Auf lernen.weka.de muss eigenes HTML (iframe + Skript) eingefügt werden können. Ob die Plattform das erlaubt, muss der Betreiber bzw. Anbieter klären – eher unwahrscheinlich.

### 3. Nachbau auf lernen.weka.de – entfällt

lernen.weka.de ist kein WordPress; WS Form, PDF-Add-on und WPCodeBox lassen sich dort nicht installieren. Ein Nachbau hieße Entwicklung in der Plattform und doppelte Pflege von Preisen und Vorlage.

## Empfehlung

Möglichkeit 1 mit Vorauswahl per Link: wenig Aufwand, eine Stelle für Preise, PDF und Mails.

## Offen

- [ ] Wer betreibt lernen.weka.de (Anbieter der Plattform) und setzt die Links? Lassen sich Links/Buttons je Kurs pflegen, eigenes HTML (iframe) einfügen?
- [ ] Ziel-Adresse: die spätere **Live**-Adresse der Konfigurator-Seite (nicht das Staging).
- [ ] Vorauswahl per Link (`?kurse=…&tn=…`) im Konfigurator umsetzen – erst auf dem Staging, dann mit der Übernahme nach [live-angebot-pdf.md](live-angebot-pdf.md).
- [ ] Liste der Kurs-Slugs für die Redaktion von lernen.weka.de (aus den Kurskarten der Konfigurator-Seite).
