# Google Tag Manager: Tags nur auf der Live-Seite auslösen

In Google Ads tauchte die Adresse der Testkopie `weka-e.local` auf. Der Grund: Die Website lädt den Google Tag Manager (Container `GTM-MD9SN2K`) über zwei Snippets in WPCodeBox, und diese Snippets kamen mit jeder Kopie der Website mit. Wer eine Testkopie im Browser geöffnet hat, hat dadurch Seitenaufrufe und Conversions an Google Ads gemeldet.

**Auf der Website ist das seit 06.11.2026 behoben:** Die Snippets „GTM Header“ und „GTM footer“ geben den Container nur noch aus, wenn die Adresse auf `weka-elearning.de` endet. Lokale Kopien und das Staging (`weka-e.kotthaus-bs.de`) laden ihn nicht mehr. Auf der Live-Seite ändert sich nichts.

**Diese Anleitung ist die zweite Sicherung im Tag Manager selbst:** Die Tags lösen nur noch aus, wenn die Seite unter der Live-Adresse läuft. Das greift auch, wenn der Container künftig irgendwo anders eingebunden wird (neue Testkopie, Agentur, Vorschau-Umgebung).

Zeitaufwand: etwa 15 bis 30 Minuten, je nach Zahl der Tags. Nötig ist ein Zugang zum Container mit dem Recht „Veröffentlichen“.

## Vorher klären

- [ ] Läuft der Container `GTM-MD9SN2K` nur auf weka-elearning.de oder auch auf anderen WEKA-Seiten (z. B. einem Shop oder einer Lernplattform)? Dann gehören deren Adressen mit in die Bedingung (siehe Schritt 2).
- [ ] Wer im Team ändert den Container? Am besten eine Person, damit sich die Änderungen nicht überschneiden.

## 1. Variable „Page Hostname“ einschalten

1. Im Tag Manager den Container `GTM-MD9SN2K` öffnen.
2. Links **Variablen** › Bereich „Integrierte Variablen“ › **Konfigurieren**.
3. Unter „Seiten“ **Page Hostname** anhaken (ist oft schon an).

## 2. Die Bedingung für die Live-Adresse

Alle folgenden Schritte nutzen dieselbe Bedingung:

| Variable | Vergleich | Wert |
| --- | --- | --- |
| Page Hostname | entspricht RegEx | `^(www\.)?weka-elearning\.de$` |

Sie trifft auf `weka-elearning.de` und `www.weka-elearning.de` zu, aber nicht auf Testkopien wie `weka-e.local` oder `weka-e.kotthaus-bs.de`.

Läuft der Container auch auf anderen WEKA-Seiten, deren Adressen ergänzen, getrennt durch `|`, zum Beispiel:

```
^(www\.)?(weka-elearning\.de|beispiel-weka\.de)$
```

Punkte im Wert immer mit `\.` schreiben.

## 3. Trigger für alle Seiten (nur live) anlegen

Die eingebauten Trigger „All Pages“ und „Initialization – All Pages“ lassen sich nicht ändern. Deshalb je einen eigenen Trigger mit der Bedingung anlegen:

1. Links **Trigger** › **Neu**.
2. Name: **Live – Seitenaufruf**.
3. Triggertyp: **Seitenaufruf**.
4. „Dieser Trigger wird ausgelöst bei“: **Einige Seitenaufrufe**.
5. Bedingung aus Schritt 2 eintragen: `Page Hostname` – `entspricht RegEx` – `^(www\.)?weka-elearning\.de$`.
6. Speichern.

Dasselbe noch einmal für:

- **Live – Initialisierung** (Triggertyp **Initialisierung**, „Einige Initialisierungsereignisse“) – für den Google-Tag und andere Tags, die bisher auf „Initialization – All Pages“ laufen.
- Nur falls verwendet: **Live – DOM bereit** bzw. **Live – Fenster geladen** (Triggertyp „DOM bereit“ bzw. „Fenster geladen“), wenn Tags bisher auf einem solchen Trigger für alle Seiten laufen.

Den Trigger für die Einwilligungs-Initialisierung (Cookie-Banner) nicht ändern – der Banner meldet nichts an Google Ads.

## 4. Tags umstellen

Links **Tags** öffnen und jeden Tag durchgehen, der Daten an Google oder andere Werbe- und Statistikdienste schickt. Typisch sind:

- Google-Tag bzw. Google Ads-Tag (`AW-…`) und GA4-Tag (`G-…`)
- Google Ads Conversion-Tracking und Google Ads Remarketing
- Conversion-Verknüpfung (Conversion Linker)
- weitere Werbe-Tags, z. B. Microsoft Advertising (Bing), LinkedIn, Meta, HubSpot

Je Tag:

1. Tag öffnen › Bereich **Trigger**.
2. Läuft er auf **All Pages** → durch **Live – Seitenaufruf** ersetzen. Läuft er auf **Initialization – All Pages** → durch **Live – Initialisierung** ersetzen. Ebenso bei „DOM bereit“ und „Fenster geladen“.
3. Läuft er auf einem **eigenen Trigger** (z. B. Klick auf „Angebot anfordern“, Formular gesendet, eigenes Ereignis wie `anfrage_gesendet`): diesen Trigger öffnen und die Bedingung aus Schritt 2 **zusätzlich** zu den vorhandenen Bedingungen eintragen. Steht dort „Alle …“, auf „Einige …“ umstellen und neben der neuen Bedingung die bisherigen beibehalten.
4. Speichern.

Tipp: In der Trigger-Liste zeigt die Spalte „Tags“ (bzw. die Anzeige im Trigger), welche Tags einen Trigger nutzen. So fällt auf, wenn ein Tag vergessen wurde – auf „All Pages“ und „Initialization – All Pages“ sollte am Ende kein Werbe- oder Statistik-Tag mehr hängen.

## 5. In der Vorschau prüfen

1. Oben rechts **Vorschau** › Adresse `https://www.weka-elearning.de/` eingeben › Verbinden.
2. Im Tag Assistant für den ersten Seitenaufruf nachsehen: Unter „Ausgelöste Tags“ stehen dieselben Tags wie vorher (Google-Tag, Ads, GA4, Conversion-Verknüpfung …).
3. Einen Vorgang auslösen, der eine Conversion meldet (z. B. eine Testanfrage oder einen Klick, der als Conversion zählt), und prüfen, dass der Conversion-Tag auslöst.
4. Wird ein Tag nicht mehr ausgelöst: Im Tag Assistant den Tag anklicken – unter „Trigger“ steht, welche Bedingung nicht erfüllt war. Meist ist der Wert in der Bedingung falsch geschrieben.

## 6. Veröffentlichen

1. **Senden** › „Version veröffentlichen und erstellen“.
2. Versionsname z. B. „Tags nur auf weka-elearning.de“, Beschreibung: „Live-Trigger mit Page Hostname, damit Testkopien nichts melden.“
3. **Veröffentlichen**.

Geht etwas schief: Links **Versionen** › vorige Version › „Als Live-Version veröffentlichen“.

## 7. weka-e.local in Google Ads

Meldungen der Testkopie, die schon in Google Ads angekommen sind, lassen sich nicht löschen. Seit dem 06.11.2026 kommen keine neuen dazu. Je nachdem, wo die Adresse auftaucht:

| Wo in Google Ads | Was tun |
| --- | --- |
| Google-Tag › **Tag-Abdeckung** bzw. Diagnose | Der Eintrag verschwindet nach einigen Wochen ohne neue Aufrufe von selbst. Gibt es beim Eintrag „Ignorieren“ oder „Ausschließen“, lässt er sich damit sofort ausblenden. |
| Google-Tag › Verwaltung › **Domains konfigurieren** | Steht `weka-e.local` (oder `weka-e.kotthaus-bs.de`) in der Liste, dort entfernen und speichern. |
| **Conversions** | Sollten nicht betroffen sein: Google Ads zählt eine Conversion nur nach einem Klick auf eine Anzeige, und den gab es auf der Testkopie nicht. Zur Sicherheit in den nächsten Tagen unter **Ziele › Conversions › Zusammenfassung** prüfen, ob die Live-Seite normal gezählt wird. |
| **Remarketing-Listen** (Zielgruppen) | Der Browser des Entwicklers kann dort als Besucher stehen. Das läuft mit der Mitgliedsdauer der Liste von selbst aus und stört die Kampagnen praktisch nicht. |

Die Bezeichnungen der Menüs können je nach Ansicht von Google Ads leicht abweichen. Steht die Adresse an einer anderen Stelle, bitte einen Screenshot an Kotthaus Business Service schicken.

## Kurz zum Abhaken

- [ ] Variable „Page Hostname“ eingeschaltet
- [ ] Trigger „Live – Seitenaufruf“ und „Live – Initialisierung“ angelegt (ggf. „DOM bereit“, „Fenster geladen“)
- [ ] Alle Werbe- und Statistik-Tags auf die Live-Trigger umgestellt
- [ ] Eigene Trigger (Klicks, Formulare, Ereignisse) um die Bedingung ergänzt
- [ ] In der Vorschau auf weka-elearning.de geprüft
- [ ] Version veröffentlicht
- [ ] In Google Ads: weka-e.local aus „Domains konfigurieren“ entfernt (falls dort), Conversions nach einigen Tagen kontrolliert
