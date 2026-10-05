/* WEKA Angebotskonfigurator – Kursübersicht für PDF/E-Mail
   WPCodeBox: JavaScript, Footer, nur Seite Angebotskonfigurator.
   Liest das JSON aus WS-Form-Feld 926 (auswahl_json, gefüllt vom Konfigurator)
   und schreibt eine lesbare Liste in das versteckte Feld KURS_UEBERSICHT_FELD. */
(function () {
  'use strict';

  var JSON_FELD = 926;
  var KURS_UEBERSICHT_FELD = 943; // WS-Form-Feld „kurs_uebersicht“

  if (!KURS_UEBERSICHT_FELD) return;

  function zahl(n) {
    return Number(n || 0).toLocaleString('de-DE');
  }

  function uebersicht(json) {
    var daten;
    try { daten = JSON.parse(json); } catch (e) { return ''; }
    var kurse = (daten && daten.kurse) || [];
    var zeilen = kurse.map(function (k, i) {
      return (i + 1) + '. ' + k.titel + ' – ' + zahl(k.teilnehmer) + ' Teilnehmende';
    });
    return zeilen.join('\n');
  }

  document.addEventListener('change', function (e) {
    var el = e.target;
    if (!el || el.name !== 'field_' + JSON_FELD) return;
    var ziel = el.form && el.form.querySelector('[name="field_' + KURS_UEBERSICHT_FELD + '"]');
    if (ziel) ziel.value = uebersicht(el.value);
  });
})();
