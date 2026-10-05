/* eCampus Angebotskonfigurator – Prototyp
   Steuert Kursauswahl (Schritt 1), Teilnehmerzahlen (2), Übergabe an WS Form (3) und Bestätigung (4).
   WS-Form-Felder: 926 auswahl_json, 927 kurs_ids, 928 teilnehmer_modus, 929 teilnehmer_gesamt, 930 anfrage_id */
(function () {
  'use strict';
  var root = document.querySelector('.konfigurator');
  if (!root) return;

  var FIELD = { json: 926, ids: 927, mode: 928, total: 929, reqId: 930 };
  var PAGE_SIZE = 12;
  var STORE_KEY = 'ecampusKonfigurator';
  var MAX_QTY = 99999;

  var $ = function (sel, ctx) { return (ctx || root).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || root).querySelectorAll(sel)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, ' ').trim(); };

  /* ---------- Zustand ---------- */
  var state = { selected: [], mode: 'gleich', total: 20, perCourse: {}, step: 1, requestId: '' };
  try { var saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null'); if (saved && Array.isArray(saved.selected)) state = Object.assign(state, saved); } catch (e) {}
  var save = function () { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} };
  var isSelected = function (id) { return state.selected.some(function (c) { return c.id === id; }); };

  /* ---------- Suchfeld (per Skript, da Bricks keine Input-Elemente hat) ---------- */
  var searchWrap = $('.course-filter__search');
  if (searchWrap && !$('.course-filter__input')) searchWrap.innerHTML = '<label class="course-filter__label" for="course-search">Kurs suchen</label><input class="course-filter__input" id="course-search" type="search" placeholder="Kurs suchen, z. B. Brandschutz" autocomplete="off">';

  /* ---------- Kurskarten ---------- */
  var cards = $$('.course-card').map(function (el) {
    var themes = (el.dataset.themes || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    return {
      el: el,
      id: String(el.dataset.courseId),
      slug: el.dataset.courseSlug || '',
      title: el.dataset.courseTitle || ($('.course-card__title', el) || {}).textContent || '',
      themes: themes.map(norm),
      haystack: norm([el.dataset.courseTitle, ($('.course-card__text', el) || {}).textContent, themes.join(' ')].join(' '))
    };
  });

  /* ---------- Themen-Chips aus den Themen der aktiven Kurse ---------- */
  var chipBox = $('.course-filter__chips');
  if (chipBox) {
    var names = {};
    cards.forEach(function (c) { (c.el.dataset.themes || '').split(',').forEach(function (t) { t = t.trim(); if (t) names[t] = (names[t] || 0) + 1; }); });
    Object.keys(names).sort(function (a, b) { return a.localeCompare(b, 'de'); }).forEach(function (t) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'course-filter__chip'; b.dataset.theme = t; b.setAttribute('aria-pressed', 'false'); b.textContent = t; chipBox.appendChild(b);
    });
  }

  if (chipBox && !$('.course-filter__count')) {
    var cnt = document.createElement('p'); cnt.className = 'course-filter__count'; cnt.setAttribute('aria-live', 'polite');
    chipBox.insertAdjacentElement('afterend', cnt);
  }

  var filter = { q: '', theme: '', limit: PAGE_SIZE };
  var countEl = $('.course-filter__count'), emptyEl = $('.course-grid__empty'), moreBtn = $('.course-grid__more');

  function renderCards() {
    var q = norm(filter.q), theme = norm(filter.theme), matches = 0;
    cards.forEach(function (c) {
      var ok = (!q || c.haystack.indexOf(q) > -1) && (!theme || c.themes.indexOf(theme) > -1);
      if (ok) matches++;
      c.el.hidden = !ok || matches > filter.limit;
      var sel = isSelected(c.id), btn = $('.course-card__add', c.el);
      c.el.classList.toggle('is-selected', sel);
      if (btn) { btn.setAttribute('aria-pressed', String(sel)); btn.textContent = sel ? 'Hinzugefügt' : 'Hinzufügen'; btn.setAttribute('aria-label', (sel ? 'Entfernen: ' : 'Hinzufügen: ') + c.title); }
    });
    if (countEl) countEl.textContent = matches + (matches === 1 ? ' Kurs' : ' Kurse') + (filter.theme || filter.q ? ' gefunden' : ' · nach Themen filterbar');
    if (emptyEl) emptyEl.hidden = matches > 0;
    if (moreBtn) moreBtn.hidden = matches <= filter.limit;
  }

  function toggleCourse(id) {
    if (isSelected(id)) {
      state.selected = state.selected.filter(function (c) { return c.id !== id; });
      delete state.perCourse[id];
    } else {
      var c = cards.find(function (x) { return x.id === id; });
      if (c) state.selected.push({ id: c.id, slug: c.slug, title: c.title });
    }
    save(); renderCards(); renderSelection();
    if (!state.selected.length && state.step > 1 && state.step < 4) goTo(1);
    else if (state.step === 2) renderQty();
    else if (state.step === 3) { renderSummary(); fillForm(); }
  }

  /* ---------- Seitenleiste ---------- */
  function qtyFor(id) { return state.mode === 'je_kurs' ? (state.perCourse[id] || state.total) : state.total; }

  function renderSelection() {
    var list = $('.selection__list'), n = state.selected.length;
    var countSpan = $('.selection__count'); if (countSpan) countSpan.textContent = n;
    var empty = $('.selection__empty'); if (empty) empty.hidden = n > 0;
    if (list) list.innerHTML = state.selected.map(function (c) {
      var qty = state.step >= 2 ? '<span class="selection__qty">' + qtyFor(c.id) + ' Teilnehmende</span>' : '';
      var rm = state.step < 4 ? '<button type="button" class="selection__remove" data-remove="' + esc(c.id) + '" aria-label="' + esc(c.title) + ' entfernen">×</button>' : '';
      return '<li class="selection__item"><span class="selection__name">' + esc(c.title) + '</span>' + qty + rm + '</li>';
    }).join('');
    var next = $('.selection__next'), note = $('.selection__note');
    if (next) { next.disabled = n === 0; next.hidden = state.step !== 1; }
    if (note) note.hidden = state.step !== 1;
  }

  /* ---------- Schritt 2: Teilnehmerzahlen ---------- */
  var qtyBox = $('.qty');

  function stepperHtml(key, value, label) {
    return '<div class="qty__stepper"><button type="button" data-step-qty="-1" data-key="' + key + '" aria-label="Weniger">−</button>' +
      '<input type="number" inputmode="numeric" min="1" max="' + MAX_QTY + '" step="1" value="' + value + '" data-key="' + key + '" aria-label="' + esc(label) + '">' +
      '<button type="button" data-step-qty="1" data-key="' + key + '" aria-label="Mehr">+</button></div>';
  }

  function renderQty() {
    if (!qtyBox) return;
    var n = state.selected.length, per = state.mode === 'je_kurs';
    qtyBox.innerHTML =
      '<div class="qty__option"><label class="qty__radio"><input type="radio" name="qty-mode" value="gleich"' + (per ? '' : ' checked') + '> Gleiche Teilnehmerzahl für alle Kurse</label>' +
      '<div class="qty__row">' + stepperHtml('all', state.total, 'Teilnehmerzahl für alle Kurse') +
      '<p class="qty__hint">Diese Anzahl wird auf ' + (n === 1 ? 'den ausgewählten Kurs' : 'alle ' + n + ' Kurse') + ' angewendet.</p></div></div>' +
      '<div class="qty__option"><label class="qty__radio"><input type="radio" name="qty-mode" value="je_kurs"' + (per ? ' checked' : '') + '> Teilnehmerzahl je Kurs anpassen</label>' +
      '<div class="qty__rows"' + (per ? '' : ' hidden') + '>' + state.selected.map(function (c) {
        return '<div class="qty__row"><span class="qty__course">' + esc(c.title) + '</span>' + stepperHtml(c.id, state.perCourse[c.id] || state.total, 'Teilnehmerzahl für ' + c.title) + '</div>';
      }).join('') + '</div></div>' +
      '<p class="qty__info">Die Anzahl der Kursplätze ist nicht automatisch die Anzahl unterschiedlicher Personen.</p>' +
      '<p class="qty__error" role="alert" hidden></p>';
    $$('[data-key="all"]', qtyBox).forEach(function (el) { el.disabled = per; });
  }

  function setQty(key, raw) {
    var v = parseInt(raw, 10);
    if (isNaN(v)) return;
    v = Math.min(MAX_QTY, Math.max(1, v));
    if (key === 'all') state.total = v; else state.perCourse[key] = v;
    var input = $('input[data-key="' + key + '"]', qtyBox); if (input) input.value = v;
    save(); renderSelection();
  }

  function validQty() {
    var err = $('.qty__error', qtyBox), bad = [];
    $$('input[data-key]', qtyBox).forEach(function (i) {
      if (i.disabled || i.closest('[hidden]')) return;
      var ok = /^[0-9]+$/.test(i.value) && +i.value >= 1 && +i.value <= MAX_QTY;
      i.setAttribute('aria-invalid', String(!ok));
      if (!ok) bad.push(i);
    });
    if (err) { err.hidden = !bad.length; err.textContent = bad.length ? 'Bitte geben Sie eine ganze Zahl ab 1 ein.' : ''; }
    if (bad.length) bad[0].focus();
    return !bad.length;
  }

  /* ---------- Schritt 3: Zusammenfassung + WS Form ---------- */
  function renderSummary() {
    var box = $('.summary'); if (!box) return;
    box.innerHTML = '<p class="summary__title">Ihre Auswahl</p><ul class="summary__list">' + state.selected.map(function (c) {
      return '<li class="summary__item"><span>' + esc(c.title) + '</span><span>' + qtyFor(c.id) + ' Teilnehmende</span></li>';
    }).join('') + '</ul><button type="button" class="summary__edit" data-goto="2">Auswahl oder Mengen ändern</button>';
  }

  function newRequestId() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
    var rnd = (window.crypto && crypto.getRandomValues) ? Array.prototype.map.call(crypto.getRandomValues(new Uint8Array(3)), function (b) { return p(b.toString(16)); }).join('') : Math.random().toString(16).slice(2, 8);
    return 'EC-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + rnd.toUpperCase();
  }

  function setField(id, value) {
    var el = root.querySelector('[name="field_' + id + '"]');
    if (!el) return false;
    el.value = value;
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function fillForm() {
    if (!state.requestId) { state.requestId = newRequestId(); save(); }
    var payload = {
      anfrage_id: state.requestId,
      teilnehmer_modus: state.mode,
      teilnehmer_gesamt: state.mode === 'gleich' ? state.total : null,
      kurse: state.selected.map(function (c) { return { id: +c.id, slug: c.slug, titel: c.title, teilnehmer: qtyFor(c.id) }; })
    };
    setField(FIELD.json, JSON.stringify(payload));
    setField(FIELD.ids, state.selected.map(function (c) { return c.id; }).join(','));
    setField(FIELD.mode, state.mode);
    setField(FIELD.total, state.mode === 'gleich' ? String(state.total) : '');
    setField(FIELD.reqId, state.requestId);
  }

  /* ---------- Schritte ---------- */
  function goTo(step, opts) {
    opts = opts || {};
    step = +step;
    if (step >= 2 && !state.selected.length) step = 1;
    if (step === 3 && state.step === 2 && !validQty()) return;
    state.step = step; save();
    $$('[data-step-panel]').forEach(function (p) { p.hidden = +p.dataset.stepPanel !== step; });
    $$('.stepper__item').forEach(function (li) {
      var n = +li.dataset.step;
      li.classList.toggle('is-current', n === step);
      li.classList.toggle('is-done', n < step && step < 4 || (step === 4 && n < 4));
      if (n === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      var num = $('.stepper__number', li); if (num) num.textContent = (n < step) ? '✓' : n;
    });
    if (step === 2) renderQty();
    if (step === 3) { renderSummary(); fillForm(); }
    if (step === 4) { var r = $('.konfigurator__request-id'); if (r) r.textContent = state.requestId; }
    renderSelection();
    if (!opts.silent) {
      if (!opts.fromHistory) try { history.pushState({ konfStep: step }, ''); } catch (e) {}
      var panel = $('[data-step-panel="' + step + '"]');
      var heading = panel && $('.konfigurator__step-title', panel);
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
      var top = root.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  /* ---------- Ereignisse ---------- */
  root.addEventListener('click', function (e) {
    var t = e.target.closest('button, .stepper__item');
    if (!t || !root.contains(t)) return;
    if (t.classList.contains('course-card__add')) { toggleCourse(String(t.closest('.course-card').dataset.courseId)); return; }
    if (t.classList.contains('course-card__details-toggle')) {
      var d = $('.course-card__details', t.closest('.course-card')), open = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!open)); if (d) d.hidden = open; return;
    }
    if (t.classList.contains('course-filter__chip')) {
      $$('.course-filter__chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === t)); });
      filter.theme = t.dataset.theme || ''; filter.limit = PAGE_SIZE; renderCards(); return;
    }
    if (t.classList.contains('course-grid__more')) { filter.limit += PAGE_SIZE; renderCards(); return; }
    if (t.dataset.remove) { toggleCourse(t.dataset.remove); return; }
    if (t.dataset.stepQty) { var inp = $('input[data-key="' + t.dataset.key + '"]', qtyBox); setQty(t.dataset.key, (+inp.value || 0) + (+t.dataset.stepQty)); return; }
    if (t.dataset.goto) { goTo(t.dataset.goto); return; }
    if (t.classList.contains('stepper__item') && t.classList.contains('is-done') && state.step < 4) { goTo(t.dataset.step); }
  });

  var search = $('.course-filter__input'), timer;
  if (search) search.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { filter.q = search.value; filter.limit = PAGE_SIZE; renderCards(); }, 150);
  });

  if (qtyBox) {
    qtyBox.addEventListener('change', function (e) {
      if (e.target.name === 'qty-mode') {
        state.mode = e.target.value;
        if (state.mode === 'je_kurs') state.selected.forEach(function (c) { if (!state.perCourse[c.id]) state.perCourse[c.id] = state.total; });
        save(); renderQty(); renderSelection(); return;
      }
      if (e.target.dataset.key) setQty(e.target.dataset.key, e.target.value);
    });
  }

  // Sicherheitsnetz: Felder direkt vor dem Absenden noch einmal füllen
  root.addEventListener('submit', function () { fillForm(); }, true);

  // WS Form meldet erfolgreichen Versand → Schritt 4
  var done = false;
  function onSuccess() {
    if (done) return; done = true;
    goTo(4);
    var keepId = state.requestId;
    state = { selected: [], mode: 'gleich', total: 20, perCourse: {}, step: 4, requestId: keepId };
    try { sessionStorage.removeItem(STORE_KEY); } catch (e) {}
  }
  if (window.jQuery) window.jQuery(document).on('wsf-submit-success', function () { onSuccess(); });
  var formWrap = $('[data-step-panel="3"]');
  if (formWrap && 'MutationObserver' in window) new MutationObserver(function () {
    if (formWrap.querySelector('.wsf-alert-success, .wsf-alert.wsf-alert-success')) onSuccess();
  }).observe(formWrap, { childList: true, subtree: true });

  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.konfStep && state.step < 4) goTo(e.state.konfStep, { fromHistory: true });
  });

  /* ---------- Start ---------- */
  state.selected = state.selected.filter(function (s) { return cards.some(function (c) { return c.id === s.id; }); });
  renderCards();
  var startStep = state.step === 4 ? 1 : state.step;
  if (state.step === 4) state.step = 1;
  goTo(startStep, { silent: true });
  try { history.replaceState({ konfStep: state.step }, ''); } catch (e) {}
})();
