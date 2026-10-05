# Angebotskonfigurator mit PDF-Versand – Übernahme auf die Live-Seite

Stand: 05.10.2026, gebaut und getestet auf dem Staging (weka-e.kotthaus-bs.de).

Auf der Live-Seite gibt es nur Zugriff über HTTPS (WordPress-Backend und Bricks-Builder), kein SSH/FTP. Deshalb läuft alles über Export/Import im Backend; die PDF-Vorlage schreibt ein WPCodeBox-Snippet selbst auf den Server.

## Was gebaut wurde

| Baustein | Staging | Aufgabe |
| --- | --- | --- |
| Seite „Angebotskonfigurator (Prototyp)“ | Seite 10801 (Bricks) | 4 Schritte: Kurse → Teilnehmer → Kontaktdaten → Bestätigung. Das Skript des Konfigurators steckt in der Seite (Bricks-Seiteneinstellungen › Eigener Code, Footer-Skripte) und füllt die versteckten Formularfelder. |
| WS-Form-Formular „eCampus Angebotsanfrage“ | Formular 31 | Kontaktdaten + versteckte Felder, 4 Aktionen (siehe unten) |
| Snippet „WEKA Angebot – Kursübersicht“ (JS) | WPCodeBox 81 | schreibt die gewählten Kurse lesbar in das Feld `kurs_uebersicht` → `snippets/weka-angebot-kursuebersicht.js` |
| Snippet „WEKA Angebot – PDF-Vorlage“ (PHP) | WPCodeBox 80 | legt die PDF-Vorlage mit Logo an (`uploads/ws-form/pdf/templates/<form_id>.html`) → `snippets/weka-angebot-pdf.php` |
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

**a) „WEKA Angebot – PDF-Vorlage“** – PHP, Ausführung „Always“, Einfügepunkt **Root**, Code `snippets/weka-angebot-pdf.php`:

```php
define( 'WEKA_ANGEBOT_FORM_ID', 31 );           // → neue Formular-ID
define( 'WEKA_ANGEBOT_LOGO_ID', 2362 );         // → Anhang-ID des Logos live
define( 'WEKA_ANGEBOT_FELD_UEBERSICHT', 943 );  // → neue ID von kurs_uebersicht
```

Außerdem in der Vorlage die Feld-IDs in `#field(930)`, `#field(925)`, `#field(918)`, `#field(919)`, `#field(920)`, `#field(921)` durch die neuen ersetzen. Die Vorlagendatei wird beim nächsten Aufruf des Backends geschrieben.

**b) „WEKA Angebot – Kursübersicht“** – JavaScript, Einfügepunkt **Frontend Footer**, Bedingung „Aktueller Beitrag ist <neue Seiten-ID>“, Code `snippets/weka-angebot-kursuebersicht.js`:

```js
var JSON_FELD = 926;             // → neue ID von auswahl_json
var KURS_UEBERSICHT_FELD = 943;  // → neue ID von kurs_uebersicht
```

**Nicht übernehmen:** „WEKA Staging – Mails abfangen“. (Es wirkt zwar nur auf der Staging-Domain, gehört aber nicht auf die Live-Seite.)

### 5. Prüfen

1. Backend einmal aufrufen, dann `https://<live-domain>/wp-content/uploads/ws-form/pdf/templates/<form_id>.html` öffnen – die Vorlage muss erscheinen (mit Logo).
2. Konfigurator durchklicken: Kurse wählen, Teilnehmerzahl, Kontaktdaten mit **eigener** E-Mail-Adresse, absenden.
3. Prüfen: Kundenmail und interne Mail kommen an, beide mit PDF `eCampus-Anfrage-<Nr>.pdf`; im PDF Logo, Datum, Kontaktdaten und Kursliste.
4. WS Form › Einsendungen: Testeinsendung löschen.
5. Seite erst danach im Menü verlinken bzw. veröffentlichen; „(Prototyp)“ aus dem Titel nehmen.

## Hinweise

- **Datenschutz:** Die Anfrage wird 90 Tage in WS Form gespeichert und per Mail versendet. Datenschutzhinweise der Seite entsprechend prüfen.
- Die Vorlagendatei unter `uploads/ws-form/pdf/templates/` ist öffentlich abrufbar, enthält aber nur Platzhalter und das Logo, keine Kundendaten.
- Ändert sich die PDF-Gestaltung, nur das Snippet „PDF-Vorlage“ ändern; die Datei wird beim nächsten Backend-Aufruf neu geschrieben.
- In der PDF-Vorlage stehen feste Farbwerte, weil der PDF-Erzeuger (dompdf) keine ACSS-Variablen kennt.
