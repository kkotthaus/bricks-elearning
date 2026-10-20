// Erzeugt die Sections der Seite „Zielgruppe“ (Vorlage: docs/vorlagen/zielgruppe/):
// - bricks/zielgruppe-*.json            Bricks-Clipboard-JSON (Strg+V im Builder)
// - bricks/templates/zielgruppe-*.json  Bricks-Section-Templates (Bricks › Templates › Importieren)
// Aufruf: node tools/zielgruppe.mjs [ausgabeordner-für-gesamtdatei]
//
// Nutzt die Klassen office-* der Seite „Büro-Verwaltung“ mit (Definition aus bricks/buero-verwaltung-*.json,
// vorher node tools/buero-verwaltung.mjs). Neue Klassen beginnen mit audience-.
// Die Symbole der Zielgruppen-Karten sind SVG-Elemente mit Code – sie brauchen eine Bricks-Code-Signatur.
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHRIFT, schrift } from './schrift.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'bricks');
const TPL = join(OUT, 'templates');
const VORHANDEN = JSON.parse(readFileSync(join(ROOT, 'tools', 'referenzen-neu-vorhandene-klassen.json'), 'utf8'));
const VERSION = '2.4.2';
const SITE = 'http://weka-e.local';

const WEKA = 'https://www.weka-elearning.de/';
const KONTAKT = 'https://www.weka-elearning.de/kontakt/';
const FLAT = 'https://lernen.weka.de/de/e/weka-ecampus-flatrate-unterweisungen-140';
const ECAMPUS = 'https://lernen.weka.de/de';
// Seite „Büro-Verwaltung“ ist Unterseite von „Zielgruppe“ (wie im Entwurf)
const BUERO = '/zielgruppe/buero-verwaltung/';

const cid = (name) => BigInt('0x' + createHash('sha1').update(name).digest('hex').slice(0, 12)).toString(36).slice(0, 6).padStart(6, 'k');
const EXISTING = { eyebrow: 'aq6l6g' };
const classDefs = new Map();
const cls = (name, settings) => { classDefs.set(name, settings); return name; };
const ref = (n) => (EXISTING[n] ? EXISTING[n] : n.startsWith('acss:') ? 'acss_import_' + n.slice(5) : cid(n));

// Klassen der Seite „Büro-Verwaltung“ übernehmen (gleiche Namen = gleiche IDs)
for (const f of readdirSync(OUT).filter((f) => /^buero-verwaltung-.*\.json$/.test(f))) {
  for (const k of JSON.parse(readFileSync(join(OUT, f), 'utf8')).globalClasses) classDefs.set(k.name, k.settings);
}
const OFFICE = new Set(classDefs.keys());

function builder(prefix) {
  let n = 0;
  const content = [];
  const id = () => prefix + String(++n).padStart(3, '0');
  const add = (parent, name, label, settings = {}) => {
    const e = { id: id(), name, parent: parent ? parent.id : 0, children: [], settings, label };
    if (settings._cssGlobalClasses) {
      for (const c of settings._cssGlobalClasses) if (!c.startsWith('acss:') && !EXISTING[c] && !classDefs.has(c)) throw new Error('Klasse fehlt: ' + c);
      settings._cssGlobalClasses = settings._cssGlobalClasses.map(ref);
    }
    if (settings._attributes) settings._attributes = settings._attributes.map(([name, value], i) => ({ id: e.id + 'a' + i, name, value }));
    if (parent) parent.children.push(e.id);
    content.push(e);
    return e;
  };
  return { content, add };
}
const C = (...names) => ({ _cssGlobalClasses: names });
const link = (url) => ({ type: 'external', url });
const arrow = { icon: { library: 'fontawesomeSolid', icon: 'fas fa-arrow-right' }, iconPosition: 'right' };
const NULL4 = { top: '0', right: '0', bottom: '0', left: '0' };
const P = (v) => ({ top: v, right: v, bottom: v, left: v });
const m0 = { _margin: { top: '0', bottom: '0' } };
const muted = { color: { raw: 'var(--text-dark-muted)' } };
const up = (s) => s.toLocaleUpperCase('de-DE');
const files = {};

function intro(b, parent, { eyebrow, title, lede, ledeClass = 'office-lede' }) {
  const box = b.add(parent, 'block', 'Einleitung', C('office-intro'));
  b.add(box, 'text-basic', 'Dachzeile', { text: up(eyebrow), tag: 'p', ...C('eyebrow') });
  b.add(box, 'heading', 'Überschrift', { text: title, tag: 'h2', ...C('office-title') });
  if (lede) b.add(box, 'text-basic', 'Einleitung', { text: lede, tag: 'p', ...C(ledeClass) });
  return box;
}

// ---------- 1. Hero ----------
{
  const b = builder('zgh');
  cls('audience-breadcrumb', {
    _margin: NULL4, _typography: muted,
    _cssCustom: '.audience-breadcrumb a {\n  color: var(--primary-dark);\n  text-decoration: underline;\n  text-underline-offset: 0.3em;\n}\n\n.audience-breadcrumb span {\n  margin-inline: 0.5em;\n}',
  });
  // Einstiegskarte wie die Lernplan-Karte, aber gerade (Vorlage)
  // Brotkrumen dicht über dem Raster (Container-Abstand wäre --container-gap)
  cls('audience-hero__inner', { _rowGap: 'var(--space-m)' });
  cls('office-plan--straight', { _cssCustom: '.office-plan.office-plan--straight {\n  transform: none;\n}' });
  // Nummern im Einstieg größer als in der Lernplan-Karte (Vorlage: 24px)
  cls('office-plan__number--large', { _cssCustom: '.office-plan__number.office-plan__number--large {\n  font-size: var(--h3);\n  line-height: 1;\n}' });

  const sec = b.add(null, 'section', 'Hero – Zielgruppen', C('office-hero'));
  const con = b.add(sec, 'container', 'Inhaltsbereich', C('audience-hero__inner'));
  const crumb = b.add(con, 'block', 'Brotkrumen', { tag: 'nav', _attributes: [['aria-label', 'Brotkrumen']], ...C('audience-breadcrumb') });
  b.add(crumb, 'text-basic', 'Pfad', { text: `<a href="/">Startseite</a><span aria-hidden="true">›</span>Zielgruppen`, tag: 'p', ...m0 });
  const grid = b.add(con, 'block', 'Raster', C('office-hero__grid'));
  const content = b.add(grid, 'block', 'Inhalt', C('office-hero__content'));
  b.add(content, 'text-basic', 'Dachzeile', { text: up('E-Learning nach Zielgruppe'), tag: 'p', ...C('eyebrow') });
  b.add(content, 'heading', 'Überschrift', { text: 'Passendes Wissen.<br>Für die Menschen<br>in Ihrem Unternehmen.', tag: 'h1', ...C('office-title', 'office-hero__title') });
  b.add(content, 'text-basic', 'Einleitung', { text: 'Ob Büro, Werkstatt oder Führungsaufgabe: Unterschiedliche Tätigkeiten brauchen unterschiedliches Wissen. Finden Sie passende Lernthemen für Ihr Team – und den richtigen Weg, Lernen zu organisieren.', tag: 'p', ...C('office-lede') });
  const act = b.add(content, 'block', 'Button-Gruppe', C('office-hero__actions'));
  b.add(act, 'button', 'Button: Zielgruppe auswählen', { text: 'Zielgruppe auswählen', link: link('#mitarbeitende'), ...arrow, ...C('acss:btn--primary') });

  const guide = b.add(grid, 'block', 'Einstiegskarte', { tag: 'aside', _attributes: [['aria-label', 'Ihr Einstieg']], ...C('office-plan', 'office-plan--straight') });
  b.add(guide, 'text-basic', 'Dachzeile', { text: up('Ihr Einstieg'), tag: 'p', ...C('eyebrow', 'office-plan__eyebrow') });
  b.add(guide, 'heading', 'Überschrift', { text: 'Vom Arbeitsalltag<br>zum passenden Lernen.', tag: 'h2', ...C('office-plan__title') });
  const ol = b.add(guide, 'block', 'Schritte', { tag: 'ol', ...C('office-plan__list') });
  for (const [nr, title, text] of [
    ['01', 'Zielgruppe wählen', 'Für wen möchten Sie Lernen ermöglichen?'],
    ['02', 'Passende Themen entdecken', 'Unterweisung, Sensibilisierung, Weiterbildung.'],
    ['03', 'Lösung finden', 'Direkt buchen oder persönlich beraten lassen.'],
  ]) {
    const li = b.add(ol, 'block', `Schritt ${nr}: ${title}`, { tag: 'li', ...C('office-plan__item') });
    b.add(li, 'text-basic', 'Nummer', { text: nr, tag: 'span', _attributes: [['aria-hidden', 'true']], ...C('office-plan__number', 'office-plan__number--large') });
    const t = b.add(li, 'div', 'Text', {});
    b.add(t, 'text-basic', 'Titel', { text: title, tag: 'p', ...C('office-plan__item-title') });
    b.add(t, 'text-basic', 'Text', { text, tag: 'p', ...C('office-plan__item-text') });
  }
  files['zielgruppe-1-hero'] = b.content;
}

// ---------- 2. Zielgruppen (Mitarbeitende) ----------
{
  const b = builder('zgm');
  const border = (w, color) => ({ width: P(w), style: 'solid', color: { raw: color }, radius: P('var(--radius-xs)') });
  cls('audience-cards', { _margin: { top: 'var(--space-l)', right: '0', bottom: '0', left: '0' }, _padding: NULL4, _alignItems: 'stretch', _columnGap: 'var(--space-s)', _rowGap: 'var(--space-s)', _cssCustom: '.audience-cards {\n  list-style: none;\n}' });
  cls('audience-card', {
    _display: 'flex', _direction: 'column', _margin: { top: '0', bottom: '0' }, _overflow: 'hidden',
    _background: { color: { raw: 'var(--white)' } }, _border: border('1px', 'var(--border-color-dark)'),
  });
  cls('audience-card--featured', { _border: border('2px', 'var(--primary-dark)') });
  cls('audience-card__top', {
    _display: 'flex', _direction: 'row', _justifyContent: 'space-between', _alignItems: 'center',
    _padding: { top: 'var(--space-s)', right: 'var(--space-m)', bottom: 'var(--space-s)', left: 'var(--space-m)' },
    _width: '100%', _heightMin: '11.2rem', '_heightMin:mobile_landscape': '9rem',
    _background: { color: { raw: 'var(--primary-ultra-light)' } },
  });
  cls('audience-card__icon', { _width: '6rem', _height: '6rem', '_width:mobile_landscape': '5rem', '_height:mobile_landscape': '5rem', _typography: { color: { raw: 'var(--primary-dark)' } } });
  cls('audience-card__number', { ...m0, _typography: { 'font-size': 'var(--h2)', 'font-weight': '700', 'line-height': '1', color: { raw: 'var(--primary-trans-30)' } } });
  cls('audience-card__body', { _width: '100%', _display: 'flex', _direction: 'column', _flexGrow: '1', _rowGap: 'var(--space-xs)', _padding: P('var(--space-m)') });
  cls('audience-card__title', { ...m0 });
  cls('audience-card__text', { ...m0, _typography: muted });
  cls('audience-card__list', { _margin: { top: 'var(--space-xs)', right: '0', bottom: 'var(--space-s)', left: '0' } });
  cls('audience-card__button', { _width: '100%', _margin: { top: 'auto' } });
  cls('audience-card__note', { ...m0, _typography: muted });

  const ICON_ATTR = 'viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" focusable="false"';
  const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" ${ICON_ATTR}>${inner}</svg>`;

  const sec = b.add(null, 'section', 'Zielgruppen – Mitarbeitende', { _cssId: 'mitarbeitende' });
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  intro(b, con, { eyebrow: 'Für Ihre Mitarbeitenden', title: 'Wen möchten Sie schulen?', lede: 'Starten Sie bei den Aufgaben Ihrer Mitarbeitenden. So wird aus einem großen Angebot eine Auswahl, die zu ihrem Arbeitsalltag passt.' });
  const ul = b.add(con, 'block', 'Zielgruppen', { tag: 'ul', ...C('audience-cards', 'acss:grid--3', 'acss:grid--m-1') });
  [
    {
      title: 'Büro & Verwaltung', featured: true,
      icon: svg('<rect x="8" y="8" width="48" height="32" rx="3"/><path d="M8 33h48M32 40v12M21 53h22M24 21l5 5 11-12"/>'),
      text: 'Für Mitarbeitende am Bildschirm, in der Sachbearbeitung, im Kundenkontakt und im mobilen Büro.',
      list: ['Arbeitsschutz & Bildschirmarbeit', 'Datenschutz & Informationssicherheit', 'Compliance & sicherer KI-Einsatz'],
      btn: 'Themen & Lernpakete entdecken', url: BUERO, note: '5, 10 oder 15 Themen als Orientierung für Ihren Lernplan.',
    },
    {
      title: 'Produktion & Werkstatt',
      icon: svg('<path d="M12 41v-7a20 20 0 0 1 40 0v7M8 41h48v7H8zM27 11v18M37 11v18M18 49v6h28v-6"/>'),
      text: 'Für gewerblich tätige Mitarbeitende, die mit Arbeitsmitteln, Maschinen und betrieblichen Gefährdungen umgehen.',
      list: ['Arbeitsschutz & sicheres Verhalten', 'Umgang mit Maschinen & Arbeitsmitteln', 'Risiken erkennen & Unfälle vermeiden'],
      btn: 'Arbeitsschutzkurse ansehen', url: 'https://www.weka-elearning.de/betriebliche-unterweisungen/arbeitsschutz/', note: 'Passende Inhalte aus dem Bereich Arbeitsschutz.',
    },
    {
      title: 'Führungskräfte',
      icon: svg('<circle cx="32" cy="15" r="7"/><path d="M20 36v-3a12 12 0 0 1 24 0v3M32 36v8M13 45h38M13 45v7M51 45v7"/><circle cx="13" cy="56" r="4"/><circle cx="51" cy="56" r="4"/>'),
      text: 'Für Menschen mit Personal- und Führungsverantwortung, die Orientierung geben und Zusammenarbeit gestalten.',
      list: ['Führung & Kommunikation', 'Verantwortung & Compliance', 'Zusammenarbeit & Veränderung'],
      btn: 'Passende Weiterbildung anfragen', url: KONTAKT, note: 'Gemeinsam die passenden Lernthemen auswählen.',
    },
  ].forEach((z, i) => {
    const nr = String(i + 1).padStart(2, '0');
    const li = b.add(ul, 'block', `Zielgruppe ${nr}: ${z.title}`, { tag: 'li', ...C('audience-card', ...(z.featured ? ['audience-card--featured'] : [])) });
    const top = b.add(li, 'div', 'Kopf', C('audience-card__top'));
    b.add(top, 'svg', 'Symbol', { source: 'code', code: z.icon, ...C('audience-card__icon') });
    b.add(top, 'text-basic', 'Nummer', { text: nr, tag: 'span', _attributes: [['aria-hidden', 'true']], ...C('audience-card__number') });
    const body = b.add(li, 'div', 'Inhalt', C('audience-card__body'));
    b.add(body, 'heading', 'Titel', { text: z.title, tag: 'h3', ...C('audience-card__title') });
    b.add(body, 'text-basic', 'Text', { text: z.text, tag: 'p', ...C('audience-card__text') });
    const list = b.add(body, 'block', 'Themen', { tag: 'ul', ...C('office-ticks', 'audience-card__list') });
    for (const t of z.list) b.add(list, 'text-basic', `Thema: ${t}`, { text: t, tag: 'li' });
    b.add(body, 'button', `Button: ${z.btn}`, { text: z.btn, link: link(z.url), ...arrow, ...C('acss:btn--primary', ...(z.featured ? [] : ['acss:btn--outline']), 'audience-card__button') });
    b.add(body, 'text-basic', 'Hinweis', { text: z.note, tag: 'p', ...C('audience-card__note') });
  });
  files['zielgruppe-2-mitarbeitende'] = b.content;
}

// ---------- 3. Verantwortliche ----------
{
  const b = builder('zgv');
  cls('audience-orgs', { _margin: { top: 'var(--space-l)', right: '0', bottom: '0', left: '0' }, _padding: NULL4, _alignItems: 'stretch', _columnGap: 'var(--space-m)', _rowGap: 'var(--space-m)', _cssCustom: '.audience-orgs {\n  list-style: none;\n}' });
  cls('audience-org', {
    _display: 'flex', _direction: 'column', _alignItems: 'flex-start', _rowGap: 'var(--space-xs)', _margin: { top: '0', bottom: '0' },
    _padding: P('var(--space-l)'), '_padding:mobile_landscape': P('var(--space-m)'),
    _background: { color: { raw: 'var(--white)' } },
    _border: { width: { top: '4px' }, style: 'solid', color: { raw: 'var(--action)' } },
  });
  cls('audience-org__title', { ...m0 });
  cls('audience-self', {
    _display: 'flex', _direction: 'row', _justifyContent: 'space-between', _alignItems: 'center', _columnGap: 'var(--space-l)', _rowGap: 'var(--space-s)',
    '_direction:mobile_landscape': 'column', '_alignItems:mobile_landscape': 'flex-start',
    _margin: { top: 'var(--space-l)' }, _padding: { top: 'var(--space-m)' },
    _border: { width: { top: '1px' }, style: 'solid', color: { raw: 'var(--border-color-dark)' } },
    _cssCustom: '.audience-self > .brxe-button {\n  flex-shrink: 0;\n}\n\n@media (max-width: 767px) {\n  .audience-self > .brxe-button {\n    width: 100%;\n  }\n}',
  });
  cls('audience-self__text', { _display: 'flex', _direction: 'column', _rowGap: 'var(--space-xs)', _widthMax: '72ch' });
  cls('audience-self__title', { ...m0 });

  const sec = b.add(null, 'section', 'Verantwortliche', { _cssId: 'verantwortliche', ...C('acss:bg--primary-ultra-light') });
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  intro(b, con, { eyebrow: 'Für die Organisation dahinter', title: 'Sie planen und organisieren Lernen?', lede: 'Dann geht es um mehr als einzelne Kurse: um passende Inhalte, eine geeignete Lernumgebung und die Umsetzung im Unternehmen.' });
  const ul = b.add(con, 'block', 'Rollen', { tag: 'ul', ...C('audience-orgs', 'acss:grid--2', 'acss:grid--m-1') });
  for (const [title, text, linkText, url] of [
    ['Personalentwicklung & HR', 'Sie möchten Weiterbildung koordinieren, Mitarbeitende entwickeln und Lernen im Unternehmen organisieren? Finden Sie den passenden Einstieg in Ihre Lernplattform.', 'Lernplattform für Ihr Unternehmen entdecken →', 'https://www.weka-elearning.de/lms-fuer-unternehmen/'],
    ['Fachverantwortliche & Beauftragte', 'Sie betreuen Arbeitsschutz, Datenschutz, Informationssicherheit oder Compliance? Steigen Sie über Ihr Fachthema ein und wählen Sie passende Inhalte für Ihre Mitarbeitenden aus.', 'Unterweisungen nach Thema ansehen →', 'https://www.weka-elearning.de/betriebliche-unterweisungen/'],
  ]) {
    const li = b.add(ul, 'block', `Rolle: ${title}`, { tag: 'li', ...C('audience-org') });
    b.add(li, 'heading', 'Titel', { text: title, tag: 'h3', ...C('audience-org__title') });
    b.add(li, 'text-basic', 'Text', { text, tag: 'p', ...C('office-text') });
    b.add(li, 'text-link', `Link: ${linkText}`, { text: linkText, link: link(url), ...C('office-path__link') });
  }
  const self = b.add(con, 'block', 'Selbst weiterbilden', C('audience-self'));
  const t = b.add(self, 'div', 'Text', C('audience-self__text'));
  b.add(t, 'heading', 'Titel', { text: 'Sie möchten sich selbst weiterbilden?', tag: 'h3', ...C('audience-self__title') });
  b.add(t, 'text-basic', 'Text', { text: 'Entdecken Sie im WEKA eCampus Kurse für Ihren eigenen Lernbedarf und buchen Sie direkt online.', tag: 'p', ...C('office-text') });
  b.add(self, 'button', 'Button: Zum WEKA eCampus', { text: 'Zum WEKA eCampus', link: link(ECAMPUS), ...arrow, ...C('acss:btn--primary', 'acss:btn--outline') });
  files['zielgruppe-3-verantwortliche'] = b.content;
}

// ---------- 4. Buchungsweg ----------
{
  const b = builder('zgb');
  const sec = b.add(null, 'section', 'Buchungsweg', { _cssId: 'buchungsweg' });
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  intro(b, con, { eyebrow: 'So geht es weiter', title: 'Der Buchungsweg folgt Ihrem Bedarf.', lede: 'Die Zielgruppe hilft Ihnen bei der Themenauswahl. Unternehmensgröße, Lernumgebung und Schulungsumfang bestimmen anschließend die passende Lösung.', ledeClass: 'office-text' });
  const paths = b.add(con, 'block', 'Wege', { tag: 'ul', ...C('office-paths', 'acss:grid--3', 'acss:grid--m-1') });
  for (const [title, text, linkText, url] of [
    ['Unternehmenslösung', 'Für mehr als 50 Mitarbeitende im Unternehmen, ein eigenes LMS oder individuelle Anforderungen: Inhalte und Einsatz persönlich abstimmen.', 'Mit dem Vertrieb sprechen →', KONTAKT],
    ['Flatrate', 'Für kleinere Teams mit mehreren Unterweisungsthemen: Prüfen Sie im eCampus den enthaltenen Katalog und die aktuellen Konditionen.', 'Unterweisungs-Flatrate ansehen →', FLAT],
    ['Einzelkurs', 'Für einen konkreten Lernbedarf: Ein passendes Thema im eCampus auswählen und direkt online buchen.', 'Kurse im eCampus entdecken →', ECAMPUS],
  ]) {
    const li = b.add(paths, 'block', `Weg: ${title}`, { tag: 'li', ...C('office-path') });
    b.add(li, 'heading', 'Titel', { text: title, tag: 'h3', ...C('office-path__title') });
    b.add(li, 'text-basic', 'Text', { text, tag: 'p', ...C('office-text') });
    b.add(li, 'text-link', `Link: ${linkText}`, { text: linkText, link: link(url), ...C('office-path__link') });
  }
  files['zielgruppe-4-buchungsweg'] = b.content;
}

// ---------- 5. Abschluss ----------
{
  const b = builder('zga');
  // Breite nach Inhalt, damit der Button daneben passt (Bricks-Block hat sonst 100 %)
  cls('audience-closing__text', { _display: 'flex', _direction: 'column', _rowGap: 'var(--space-xs)', _width: 'auto', _flexShrink: '1' });
  cls('audience-closing__lede', { ...m0, _typography: { color: { raw: 'var(--white-trans-80)' } } });
  const sec = b.add(null, 'section', 'Abschluss', C('office-closing', 'acss:bg--primary-dark'));
  const con = b.add(sec, 'container', 'Inhaltsbereich', C('office-closing__inner'));
  const t = b.add(con, 'block', 'Text', C('audience-closing__text'));
  b.add(t, 'heading', 'Überschrift', { text: 'Ihr Team passt in keine Schublade?', tag: 'h2', ...C('office-title', 'office-closing__title') });
  b.add(t, 'text-basic', 'Text', { text: 'Wir unterstützen Sie bei einer passenden Themen- und Lösungsauswahl.', tag: 'p', ...C('audience-closing__lede') });
  b.add(con, 'button', 'Button: Bedarf gemeinsam klären', { text: 'Bedarf gemeinsam klären', style: 'primary', link: link(KONTAKT), ...arrow, ...C('acss:btn--action') });
  files['zielgruppe-5-abschluss'] = b.content;
}

// ---------- Schriftgrößen (tools/schrift.mjs) ----------
schrift({ files, classDefs, cid, cls, existing: EXISTING });

// ---------- Schreiben ----------
const TITEL = {
  'zielgruppe-1-hero': 'Zielgruppe 1 – Hero', 'zielgruppe-2-mitarbeitende': 'Zielgruppe 2 – Mitarbeitende',
  'zielgruppe-3-verantwortliche': 'Zielgruppe 3 – Verantwortliche', 'zielgruppe-4-buchungsweg': 'Zielgruppe 4 – Buchungsweg',
  'zielgruppe-5-abschluss': 'Zielgruppe 5 – Abschluss',
};
const usedClasses = (content) => {
  const ids = new Set(content.flatMap((e) => e.settings._cssGlobalClasses || []));
  // Schrift-Klassen immer mitgeben, damit alle Größen (auch ungenutzte) angelegt werden
  return [...classDefs].filter(([name]) => ids.has(cid(name)) || SCHRIFT[name]).map(([name, settings]) => ({ id: cid(name), name, settings }));
};
const templateClasses = (content) => {
  const ids = new Set(content.flatMap((e) => e.settings._cssGlobalClasses || []));
  return [...usedClasses(content), ...VORHANDEN.filter((k) => ids.has(k.id))];
};
mkdirSync(TPL, { recursive: true });
const all = [];
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name + '.json'), JSON.stringify({ content, source: 'bricksCopiedElements', sourceUrl: SITE, version: VERSION, globalClasses: usedClasses(content), globalElements: [] }, null, 1) + '\n');
  const tpl = { title: TITEL[name], templateType: 'section', content, pageSettings: [], templateSettings: [], global_classes: templateClasses(content) };
  writeFileSync(join(TPL, name + '.json'), JSON.stringify(tpl, null, 1) + '\n');
  all.push(...content);
  console.log(name, content.length, 'Elemente,', tpl.global_classes.length, 'Klassen im Template');
}
writeFileSync(join(process.argv[2] || OUT, 'zielgruppe-gesamt.json'), JSON.stringify({ content: all, source: 'bricksCopiedElements', sourceUrl: SITE, version: VERSION, globalClasses: templateClasses(all), globalElements: [] }));
const neu = [...classDefs.keys()].filter((n) => !OFFICE.has(n));
const ids = [...classDefs.keys()].map(cid); if (new Set(ids).size !== ids.length) throw new Error('Klassen-ID doppelt');
console.log('Neue Klassen:', neu.length, '–', neu.join(', '));
console.log('Genutzte office-Klassen:', usedClasses(all).filter((k) => OFFICE.has(k.name)).length);
