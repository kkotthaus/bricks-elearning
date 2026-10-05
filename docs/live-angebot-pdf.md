# Angebotskonfigurator mit PDF-Preisauskunft – Übernahme auf die Live-Seite

Stand: 05.10.2026, gebaut und getestet auf dem Staging (weka-e.kotthaus-bs.de). Seit 05.10.2026 mit Preisen: Das PDF ist eine unverbindliche **Preisauskunft**, die Interessenten ihrem Vorgesetzten zur Freigabe vorlegen können (siehe [Preise](#preise)).

Auf der Live-Seite gibt es nur Zugriff über HTTPS (WordPress-Backend und Bricks-Builder), kein SSH/FTP. Deshalb läuft alles über Export/Import im Backend; die PDF-Vorlage schreibt ein WPCodeBox-Snippet selbst auf den Server.

## Was gebaut wurde

| Baustein | Staging | Aufgabe |
| --- | --- | --- |
| Seite „Angebotskonfigurator (Prototyp)“ | Seite 10801 (Bricks) | 4 Schritte: Kurse → Teilnehmer → Kontaktdaten → Bestätigung. Das Skript des Konfigurators steckt in der Seite (Bricks-Seiteneinstellungen › Eigener Code, Footer-Skripte), zeigt die Preise ab Schritt 2 und füllt die versteckten Formularfelder. Kopie: `snippets/weka-angebot-konfigurator.js` (in den Seiteneinstellungen mit `<script>…</script>` umschlossen). |
| WS-Form-Formular „eCampus Angebotsanfrage“ | Formular 31 | Kontaktdaten + versteckte Felder, 4 Aktionen (siehe unten) |
| Snippet „WEKA Angebot – Kursübersicht“ (JS) | WPCodeBox 81 | schreibt die gewählten Kurse mit Preisen lesbar in das Feld `kurs_uebersicht` (für die Mails) → `snippets/weka-angebot-kursuebersicht.js` |
| Snippet „WEKA Angebot – PDF-Vorlage“ (PHP) | WPCodeBox 80 | legt die PDF-Vorlage „Preisauskunft eCampus“ mit Logo, Preistabelle und Freigabefeld an (`uploads/ws-form/pdf/templates/<form_id>.html`) → `snippets/weka-angebot-pdf.php` |
| Snippet „WEKA Angebot – Preise“ (PHP) | WPCodeBox 82 | Preise und Rabatte an einer Stelle; rechnet die Preisauskunft serverseitig für das PDF (Variablen `#weka_preisauskunft`, `#weka_preisauskunft_gueltig_bis`) und gibt die Werte als `window.wekaPreise` an den Konfigurator → `snippets/weka-angebot-preise.php` |
| Snippet „WEKA Staging – Mails abfangen“ (PHP) | WPCodeBox 79 | **nur Staging**, verschickt nichts → `snippets/weka-staging-mail-abfangen.php` – **nicht live übernehmen** |
| Logo | Mediathek 2362 (`WEKA-Logo4c.png`) | Logo im PDF |
| Sicherung alter Stand | Formular 32 | Kopie von Formular 31 vor den Änderungen, kann nach der Übernahme gelöscht werden |

### Formular-Felder (Staging-IDs)

| Feld | ID | Herkunft |
| --- | --- | --- |
| Firma | 925 | Kunde |
| Vorname / Nachname | 918 / 919 | Kunde |
| E-Mail | 920 | Kunde |
| Telefon | 921 | Kunde |
| Datenschutz | 923 | Kunde |
| `auswahl_json` | 926 | Konfigurator-Skript |
| `kurs_ids` | 927 | Konfigurator-Skript |
| `teilnehmer_modus` | 928 | Konfigurator-Skript |
| `teilnehmer_gesamt` | 929 | Konfigurator-Skript |
| `anfrage_id` | 930 | Konfigurator-Skript |
| `kurs_uebersicht` | 943 | Snippet „Kursübersicht“ |

### Aktionen des Formulars

1. Einsendung speichern (90 Tage)
2. Nachricht anzeigen
3. **E-Mail an Kunden (mit PDF)** – an `#field(920)`, Betreff „Ihre eCampus-Angebotsanfrage #field(930)“, „Attach PDF“ an, Dateiname `eCampus-Anfrage-#field(930)`
4. **E-Mail an WEKA intern (mit PDF)** – an `#blog_admin_email` (Staging: Admin-Adresse), „Antworten an“ `#field(920)`, Betreff „Neue eCampus-Angebotsanfrage #field(930) – #field(925)“, „Attach PDF“ an

## Voraussetzungen live

- [ ] WS Form PRO mindestens 1.12.12 (wie Staging)
- [ ] Add-on **WS Form PRO – PDF** installiert (Plugins › Installieren › Plugin hochladen, ZIP aus dem WS-Form-Kundenkonto) und unter WS Form › Einstellungen › PDF lizenziert; Papierformat A4, Hochformat
- [ ] WPCodeBox 2 aktiv
- [ ] **Mailversand funktioniert** (SMTP o. Ä.). Vorher mit einer Testmail prüfen – ohne Mailversand gibt es kein PDF, weil es nur als Mail-Anhang entsteht.
- [ ] Empfänger der internen Mail festgelegt (Postfach des Vertriebs statt Admin-Adresse)
- [ ] Vorher eine Sicherung der Live-Seite (Duplicator: Backup erstellen)

## Schritte

### 1. Logo bereitstellen

1. Live in der Mediathek prüfen, ob `WEKA-Logo4c.png` vorhanden ist; sonst hochladen.
2. Die **Anhang-ID** notieren (Mediathek › Bild öffnen › Zahl in der Adresse `post=…` bzw. `item=…`).

### 2. Formular übernehmen

1. Staging: WS Form › Formulare › „eCampus Angebotsanfrage“ (31) › **Export** → JSON-Datei.
2. Live: WS Form › Formulare › **Importieren** → JSON-Datei hochladen.
3. Live: Formular öffnen und **neue IDs notieren** – Formular-ID und alle Feld-IDs aus der Tabelle oben (Feld anklicken, die ID steht in den Feldeinstellungen bzw. im Feld-Badge). Beim Import vergibt WS Form neue IDs.
4. Aktionen öffnen und prüfen, dass die `#field(…)`-Variablen in beiden E-Mail-Aktionen auf die **neuen** IDs zeigen; sonst anpassen.
5. Aktion „E-Mail an WEKA intern“: Empfänger von `#blog_admin_email` auf das Vertriebspostfach ändern. Absender (Von-Adresse) auf eine Adresse der Live-Domain setzen, die der Mailserver verschicken darf.
6. Formular **veröffentlichen**.

### 3. Seite übernehmen

1. Staging: Seite 10801 im Bricks-Builder öffnen, alle Elemente markieren und kopieren (Strg+A, Strg+C) – die globalen Klassen kommen mit.
2. Live: neue Seite anlegen (Titel z. B. „Angebot erstellen“), im Builder einfügen (Strg+V).
3. Staging: Bricks-Seiteneinstellungen › Eigener Code öffnen, das Footer-Skript („eCampus Angebotskonfigurator – Prototyp“) kopieren und live in die Seiteneinstellungen der neuen Seite einfügen.
4. Im Skript die Feld-IDs anpassen:
   ```js
   var FIELD = { json: 926, ids: 927, mode: 928, total: 929, reqId: 930 };
   ```
   → durch die neuen IDs ersetzen.
5. Im Builder das WS-Form-Element bzw. den Shortcode auf die **neue Formular-ID** stellen.
6. Seite speichern. Falls Bricks „Code-Signaturen“ verlangt: Bricks › Einstellungen › Eigener Code › Signaturen neu erzeugen.
7. Seiten-ID der neuen Seite notieren.

### 4. Snippets anlegen (WPCodeBox)

Jeweils WPCodeBox › Neues Snippet, Code aus dem Repo einfügen, Werte anpassen, speichern, aktivieren.

**a) „WEKA Angebot – Preise“** – PHP, Ausführung „Always“, Einfügepunkt **Root**, Priorität **5** (vor der PDF-Vorlage), Code `snippets/weka-angebot-preise.php`:

```php
defined( 'WEKA_ANGEBOT_FORM_ID' ) || define( 'WEKA_ANGEBOT_FORM_ID', 31 ); // → neue Formular-ID
define( 'WEKA_ANGEBOT_SEITE_ID', 10801 );   // → Seiten-ID des Konfigurators live
define( 'WEKA_ANGEBOT_FELD_JSON', 926 );    // → neue ID von auswahl_json
```

**b) „WEKA Angebot – PDF-Vorlage“** – PHP, Ausführung „Always“, Einfügepunkt **Root**, Code `snippets/weka-angebot-pdf.php`:

```php
defined( 'WEKA_ANGEBOT_FORM_ID' ) || define( 'WEKA_ANGEBOT_FORM_ID', 31 ); // → neue Formular-ID
define( 'WEKA_ANGEBOT_LOGO_ID', 2362 );         // → Anhang-ID des Logos live
```

Außerdem in der Vorlage die Feld-IDs in `#field(930)`, `#field(925)`, `#field(918)`, `#field(919)`, `#field(920)`, `#field(921)` durch die neuen ersetzen. Die Vorlagendatei wird beim nächsten Aufruf des Backends geschrieben.

**c) „WEKA Angebot – Kursübersicht“** – JavaScript, Einfügepunkt **Frontend Footer**, Bedingung „Aktueller Beitrag ist <neue Seiten-ID>“, Code `snippets/weka-angebot-kursuebersicht.js`:

```js
var JSON_FELD = 926;             // → neue ID von auswahl_json
var KURS_UEBERSICHT_FELD = 943;  // → neue ID von kurs_uebersicht
```

**Nicht übernehmen:** „WEKA Staging – Mails abfangen“. (Es wirkt zwar nur auf der Staging-Domain, gehört aber nicht auf die Live-Seite.)

### 5. Prüfen

1. Backend einmal aufrufen, dann `https://<live-domain>/wp-content/uploads/ws-form/pdf/templates/<form_id>.html` öffnen – die Vorlage muss erscheinen (mit Logo).
2. Konfigurator durchklicken: Kurse wählen, Teilnehmerzahl, Kontaktdaten mit **eigener** E-Mail-Adresse, absenden.
3. Prüfen: In Schritt 2 und 3 stehen Preise und Summen. Kundenmail und interne Mail kommen an, beide mit PDF `eCampus-Anfrage-<Nr>.pdf`; im PDF Logo, Datum, Kontaktdaten, Preistabelle, Summen, Flatrate-Vergleich, Gültigkeit und Freigabefeld. Beispiel zum Vergleich: [beispiel-preisauskunft.pdf](beispiel-preisauskunft.pdf).
4. WS Form › Einsendungen: Testeinsendung löschen.
5. Seite erst danach im Menü verlinken bzw. veröffentlichen; „(Prototyp)“ aus dem Titel nehmen.

## Preise

Alle Werte stehen nur in `weka_preise_config()` im Snippet „WEKA Angebot – Preise“ (Preise in Cent). Seite und PDF lesen dieselben Werte; nach einer Änderung nichts weiter anpassen.

| Wert | Stand 05.10.2026 |
| --- | --- |
| Einzelkurs | 59,00 € netto je Teilnehmendem, alle Kurse gleich |
| Laufzeit Einzelkurs | 90 Tage |
| MwSt. | 19 % |
| Mengenrabatt **je Kurs** nach Teilnehmenden in diesem Kurs | ab 5: 5 % · ab 10: 10 % · ab 20: 20 % · ab 30: 35 % · ab 50: 40 % |
| Flatrate | 199,00 € netto je Mitarbeitendem und Jahr |
| Gültigkeit der Preisauskunft | 30 Tage ab Erstellung |

- Rechnung in ganzen Cent: Preis je TN = Listenpreis × (100 − Rabatt) / 100, gerundet; Kurssumme = Preis je TN × Teilnehmende; MwSt. auf die Nettosumme, gerundet.
- **Verbindlich rechnet der Server.** Das PDF nimmt aus `auswahl_json` nur Kurs-IDs und Teilnehmerzahlen und rechnet neu; Kurstitel kommen aus WordPress. Die Preise, die das Skript mitschickt, landen nur in der Mail-Übersicht.
- Flatrate-Vergleich: Als Zahl der Mitarbeitenden gilt die größte Teilnehmerzahl eines Kurses (die tatsächliche Personenzahl kann abweichen; das steht auch im PDF). Der Vergleich steht immer im PDF, mit Hinweis, welche Variante günstiger ist.
- An den Stufengrenzen kann mehr Teilnehmende billiger sein (19 TN = 1.008,90 €, 20 TN = 944,00 €). Das ergibt sich aus den Stufen und ist so gewollt bzw. mit dem Vertrieb zu klären.

## Hinweise

- **Datenschutz:** Die Anfrage wird 90 Tage in WS Form gespeichert und per Mail versendet. Datenschutzhinweise der Seite entsprechend prüfen.
- Die Vorlagendatei unter `uploads/ws-form/pdf/templates/` ist öffentlich abrufbar, enthält aber nur Platzhalter und das Logo, keine Kundendaten.
- Ändert sich die PDF-Gestaltung, nur das Snippet „PDF-Vorlage“ ändern; die Datei wird beim nächsten Backend-Aufruf neu geschrieben.
- Die neuen Zeilen in Seitenleiste und Zusammenfassung nutzen die vorhandenen Klassen (`selection__item`, `selection__qty`, `summary__item`, `qty__info`); die Summenzeilen haben zusätzlich den Modifier `--total` (`selection__item--total`, `summary__item--total`). Soll die Summe hervorgehoben werden: Stil in diesen Bricks-Klassen anlegen.
- Abweichung vom Standard: Das Konfigurator-Skript steckt noch in den Bricks-Seiteneinstellungen statt in WPCodeBox (bricks-nodes: Snippets nur in WPCodeBox). Beim Übertragen auf live kann es als WPCodeBox-JS-Snippet (Frontend Footer, Bedingung Seite) angelegt werden.
- In der PDF-Vorlage stehen feste Farbwerte, weil der PDF-Erzeuger (dompdf) keine ACSS-Variablen kennt.
