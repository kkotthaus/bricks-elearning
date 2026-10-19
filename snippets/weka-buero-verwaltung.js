/* WEKA Büro & Verwaltung – Lösungsfinder und Themenfilter
   WPCodeBox: JavaScript, Footer, auf allen Seiten (tut nichts, wenn die Sections fehlen).

   Bricks erlaubt <select>/<option> nicht als eigenes Tag. Die Auswahlfelder stehen deshalb im Builder als Liste:
     <ul data-office-select="size" data-office-id="office-size" data-office-label="…">
       <li data-value="small">Bis zu 50 Mitarbeitende</li> …
   Das Skript ersetzt jede Liste durch ein echtes <select> (Texte und Werte bleiben im Builder pflegbar).

   Lösungsfinder (Section „Ihr Weg zur passenden Lösung“):
     - Empfehlungen [data-office-result="flat|single|advice"], es wird genau eine gezeigt.
       advice = mehr als 50 Mitarbeitende, eigenes LMS oder Beratung; single = einzelner Kurs; sonst flat.
     - [data-office-lms] im Beratungstext nur bei „Inhalte für unser eigenes LMS“.
     - Buttons [data-office-need="flat"] in den Lernpaketen stellen „Mehrere Themen“ ein (der Link springt zu #loesung).
   Themenfilter (Section „Die Themen im Überblick“):
     - Themen [data-office-level="5|10|15"]; gezeigt werden alle mit Stufe ≤ Auswahl. */
(function () {
  'use strict';

  // Liste → <select>
  function toSelect(list) {
    var select = document.createElement('select');
    select.id = list.getAttribute('data-office-id') || '';
    // Klassen übernehmen (Bricks schreibt das Klassen-CSS als .office-select.brxe-block), ohne bricks-lazy-hidden u. ä.
    select.className = Array.prototype.filter.call(list.classList, function (c) { return c.indexOf('bricks-') !== 0; }).join(' ');
    select.setAttribute('data-office-select', list.getAttribute('data-office-select'));
    var label = list.getAttribute('data-office-label');
    if (label && !document.querySelector('label[for="' + select.id + '"]')) select.setAttribute('aria-label', label);
    list.querySelectorAll('[data-value]').forEach(function (item) {
      var option = document.createElement('option');
      option.value = item.getAttribute('data-value');
      option.textContent = item.textContent.trim();
      select.appendChild(option);
    });
    list.replaceWith(select);
    return select;
  }
  document.querySelectorAll('ul[data-office-select]').forEach(toSelect);

  var field = function (name) { return document.querySelector('select[data-office-select="' + name + '"]'); };

  // ---------- Lösungsfinder ----------
  var size = field('size'), need = field('need');
  var results = document.querySelectorAll('[data-office-result]');
  function recommend() {
    if (!size || !need) return;
    var n = need.value;
    var key = size.value === 'large' || n === 'lms' || n === 'advice' ? 'advice' : n === 'single' ? 'single' : 'flat';
    results.forEach(function (r) { r.hidden = r.getAttribute('data-office-result') !== key; });
    document.querySelectorAll('[data-office-lms]').forEach(function (s) { s.hidden = n !== 'lms'; });
  }
  if (size && need) {
    size.addEventListener('change', recommend);
    need.addEventListener('change', recommend);
    document.querySelectorAll('[data-office-need]').forEach(function (b) {
      b.addEventListener('click', function () { need.value = b.getAttribute('data-office-need'); recommend(); });
    });
    recommend();
  }

  // ---------- Themenfilter ----------
  var filter = field('filter');
  function filterCourses() {
    var max = Number(filter.value) || 99;
    document.querySelectorAll('[data-office-level]').forEach(function (c) {
      c.hidden = Number(c.getAttribute('data-office-level')) > max;
    });
  }
  if (filter) { filter.addEventListener('change', filterCourses); filterCourses(); }
})();
