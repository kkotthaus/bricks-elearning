// Erzeugt die Sections der Seite „Referenzen-neu“:
// - bricks/referenzen-neu-*.json            Bricks-Clipboard-JSON (Strg+V im Builder)
// - bricks/templates/referenzen-neu-*.json  Bricks-Section-Templates (Bricks › Vorlagen › Importieren, per Drag & Drop)
// Aufruf: node tools/referenzen-neu.mjs [ausgabeordner-für-gesamtdatei]
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'bricks');
const TPL = join(OUT, 'templates');
// Vorhandene Klassen (eyebrow, check-list …) – für die Templates mitgeliefert, falls sie auf der Zielseite fehlen
const VORHANDEN = JSON.parse(readFileSync(join(ROOT, 'tools', 'referenzen-neu-vorhandene-klassen.json'), 'utf8'));
const VERSION = '2.4.2';
const SITE = 'http://weka-e.local';

// Klassen-ID aus dem Namen ableiten (gleicher Name = gleiche ID)
const cid = (name) => BigInt('0x' + createHash('sha1').update(name).digest('hex').slice(0, 12)).toString(36).slice(0, 6).padStart(6, 'k');

// Vorhandene Klassen der Installation (nicht mitliefern, nur referenzieren)
const EXISTING = {
  eyebrow: 'aq6l6g', 'check-list': 'i49kq7', 'check-list__item': '1n8mtz', 'check-list__icon': 'x272hp', 'check-list__text': 'oevb9o',
};
const acss = (n) => 'acss_import_' + n;

const classDefs = new Map(); // name -> settings
const cls = (name, settings) => { classDefs.set(name, settings); return name; };
const ref = (n) => (EXISTING[n] ? EXISTING[n] : n.startsWith('acss:') ? acss(n.slice(5)) : cid(n));

// ---------- Icons: Bricks-Icon-Element mit Font Awesome 6 (keine Code-Signatur nötig, auf Live übertragbar) ----------
const FA = {
  building: 'fa-building', cap: 'fa-graduation-cap', users: 'fa-users', shield: 'fa-shield-halved',
  factory: 'fa-industry', leaf: 'fa-leaf', landmark: 'fa-building-columns',
  award: 'fa-award', gear: 'fa-gear', monitor: 'fa-desktop', chart: 'fa-chart-column', check: 'fa-check', badge: 'fa-check',
};
const fa = (name, classes = {}) => ({ icon: { library: 'fontawesomeSolid', icon: 'fas ' + FA[name] }, ...classes });

// ---------- Element-Bausteine ----------
function builder(prefix) {
  let n = 0;
  const content = [];
  const id = () => prefix + String(++n).padStart(3, '0');
  const add = (parent, name, label, settings = {}, extra = {}) => {
    const e = { id: id(), name, parent: parent ? parent.id : 0, children: [], settings, label, ...extra };
    if (settings._cssGlobalClasses) settings._cssGlobalClasses = settings._cssGlobalClasses.map(ref);
    if (parent) parent.children.push(e.id);
    content.push(e);
    return e;
  };
  return { content, add };
}
const C = (...names) => ({ _cssGlobalClasses: names });
const img = (id, file) => ({ id, filename: file, size: 'full', full: `${SITE}/wp-content/uploads/${file}`, url: `${SITE}/wp-content/uploads/${file}` });
const btnLink = (url, newTab = false) => (newTab ? { type: 'external', url, newTab: true } : { type: 'external', url });
const arrow = { icon: { library: 'fontawesomeSolid', icon: 'fas fa-arrow-right' }, iconPosition: 'right' };

// ---------- Gemeinsame Klassen ----------
cls('eyebrow--light', { _typography: { color: { raw: 'var(--white)' } } });
cls('icon-circle', {
  _display: 'flex', _alignItems: 'center', _justifyContent: 'center', _flexShrink: '0',
  _background: { color: { raw: 'var(--primary)' } }, _typography: { color: { raw: 'var(--white)' } },
  _border: { radius: { top: '50%', right: '50%', bottom: '50%', left: '50%' } },
  _cssCustom: '.icon-circle {\n  width: var(--icon-circle-size, 4.4rem);\n  height: var(--icon-circle-size, 4.4rem);\n}\n\n/* Font-Awesome-Symbol im Kreis, Größe relativ zum Kreis */\n.icon-circle > .brxe-icon {\n  font-size: calc(var(--icon-circle-size, 4.4rem) * 0.45);\n  line-height: 1;\n}',
});
cls('icon-circle--white', { _background: { color: { raw: 'var(--white)' } }, _typography: { color: { raw: 'var(--primary-dark)' } }, _cssCustom: '.icon-circle--white {\n  box-shadow: 0 0.4rem 1.6rem var(--black-trans-10);\n}' });
cls('icon-circle--soft', { _background: { color: { raw: 'var(--primary-trans-10)' } }, _typography: { color: { raw: 'var(--primary-dark)' } } });
cls('icon-circle--rating', { _background: { color: { raw: 'var(--warning-semi-dark)' } }, _typography: { color: { raw: 'var(--white)' } } });

cls('image-banner', { _position: 'relative', _overflow: 'hidden', _padding: { top: 'var(--section-space-xs)', bottom: 'var(--section-space-xs)' }, _cssCustom: '.image-banner {\n  isolation: isolate;\n}' });
cls('image-banner__image', {
  _position: 'absolute', _top: '0', _right: '0', _bottom: '0', _width: '52%', _height: '100%', _objectFit: 'cover', _zIndex: '0',
  '_position:tablet_portrait': 'relative', '_width:tablet_portrait': '100%', '_height:tablet_portrait': '36rem',
  '_margin:tablet_portrait': { bottom: 'var(--space-m)' }, '_height:mobile_landscape': '28rem',
  _cssCustom: '/* Weicher Übergang vom Foto in die Fläche (Maske, keine Farbe) */\n.image-banner__image {\n  -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 35%);\n  mask-image: linear-gradient(to right, transparent 0%, #000 35%);\n}\n\n/* Ab Tablet: Foto über dem Text, damit weiße Schrift nicht auf dem Foto liegt */\n@media (max-width: 991px) {\n  .image-banner__image {\n    -webkit-mask-image: none;\n    mask-image: none;\n    border-radius: var(--radius);\n  }\n}',
});
cls('image-banner__inner', { _position: 'relative', _zIndex: '1' });
cls('image-banner__content', {
  _display: 'flex', _direction: 'column', _rowGap: 'var(--space-m)', _width: '50%',
  '_width:tablet_portrait': '100%',
});
cls('image-banner__title', {
  _margin: { top: '0', bottom: '0' }, _widthMax: '100%', _typography: { 'font-size': 'var(--h1)', 'line-height': '1.15' },
  _cssCustom: '.image-banner__title {\n  overflow-wrap: break-word;\n  hyphens: manual;\n}\n\n/* Hero-Titel laut Vorlage deutlich größer als h1 */\n.image-banner h1.image-banner__title {\n  font-size: calc(var(--h1) * 1.45);\n}',
});
cls('image-banner__lede', { _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--text-l)' }, _widthMax: '60ch' });
cls('image-banner__quote', {
  _position: 'absolute', _top: '12%', _right: '4%', _zIndex: '2', _widthMax: '13ch',
  _typography: { 'font-size': 'var(--h4)', 'font-weight': '600', 'font-style': 'italic', 'line-height': '1.3', color: { raw: 'var(--primary-dark)' } },
  '_display:tablet_portrait': 'none',
  _cssCustom: '.image-banner__quote {\n  transform: rotate(-8deg);\n  hyphens: manual;\n}\n\n/* Schwung unter dem Zitat wie in der Vorlage */\n.image-banner__quote::after {\n  content: "";\n  display: block;\n  width: 85%;\n  height: 0.12em;\n  margin-top: 0.35em;\n  margin-left: auto;\n  background: var(--primary);\n  border-radius: 50%;\n  transform: rotate(-4deg);\n}',
});
cls('image-banner__actions', { _display: 'flex', _direction: 'row', _flexWrap: 'wrap', _columnGap: 'var(--space-s)', _rowGap: 'var(--space-s)', _cssCustom: '/* Mobil: CTA-Buttons volle Breite */\n@media (max-width: 767px) {\n  .image-banner__actions > .brxe-button {\n    width: 100%;\n  }\n}' });

function imageBanner(b, { label, imageId, imageFile, eyebrow, title, tag, lede, quote }) {
  const sec = b.add(null, 'section', label, C('image-banner', 'acss:bg--primary-dark'));
  b.add(sec, 'image', 'Foto (Platzhalter)', { image: img(imageId, imageFile), ...C('image-banner__image') });
  b.add(sec, 'text-basic', 'Zitat', { text: quote, tag: 'p', ...C('image-banner__quote') }, { });
  const inner = b.add(sec, 'container', 'Inhaltsbereich', C('image-banner__inner'));
  const content = b.add(inner, 'block', 'Inhalt', C('image-banner__content'));
  b.add(content, 'text-basic', 'Dachzeile', { text: eyebrow, tag: 'p', ...C('eyebrow', 'eyebrow--light') });
  b.add(content, 'heading', 'Überschrift', { text: title, tag, ...C('image-banner__title', 'acss:text--white') });
  b.add(content, 'text-basic', 'Einleitung', { text: lede, tag: 'p', ...C('image-banner__lede', 'acss:text--white') });
  return { sec, content };
}

const files = {};
const usedClasses = (content) => {
  const ids = new Set(content.flatMap((e) => e.settings._cssGlobalClasses || []));
  return [...classDefs].filter(([name]) => ids.has(cid(name))).map(([name, settings]) => ({ id: cid(name), name, settings }));
};

// ---------- 1. Hero ----------
{
  const b = builder('rha');
  const { content } = imageBanner(b, {
    label: 'Hero – Referenzen', imageId: 10833, imageFile: '2026/10/referenzen-hero.jpg',
    eyebrow: 'REFERENZEN', title: 'In starken Unternehmen im Einsatz', tag: 'h1',
    lede: 'Unternehmen aus unterschiedlichsten Branchen setzen auf WEKA E-Learning, um Wissen rechtssicher zu vermitteln, Mitarbeitende zu qualifizieren und Compliance sicherzustellen.',
    quote: '„Wissen wirksam vermitteln. In jeder Branche.“',
  });
  cls('stat-list', {
    _display: 'grid', _gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', '_gridTemplateColumns:tablet_portrait': 'repeat(2, minmax(0, 1fr))', _columnGap: 'var(--space-s)', _rowGap: 'var(--space-m)',
    _margin: { top: 'var(--space-s)', right: '0', bottom: '0', left: '0' }, _padding: { top: '0', right: '0', bottom: '0', left: '0' },
    _cssCustom: '.stat-list {\n  list-style: none;\n}',
  });
  cls('stat-list__item', { _display: 'flex', _direction: 'row', _flexWrap: 'nowrap', _alignItems: 'center', _columnGap: 'var(--space-xs)', _margin: { top: '0', bottom: '0' } });
  cls('stat-list__value', { _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--text-l)', 'font-weight': '700', 'line-height': '1.2', color: { raw: 'var(--white)' } } });
  cls('stat-list__label', { _cssCustom: '.stat-list__label {\n  hyphens: manual;\n}', _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--text-xs)', 'line-height': '1.3', color: { raw: 'var(--white-trans-80)' } } });
  const list = b.add(content, 'block', 'Kennzahlen', { tag: 'ul', ...C('stat-list') });
  for (const [icon, value, label] of [
    ['building', '6.000+', 'Unternehmen vertrauen auf uns'], ['cap', '430+', 'E-Learning Inhalte'],
    ['users', '800+', 'E-Learning-Projekte'], ['shield', '25+', 'Jahre Erfahrung'],
  ]) {
    const li = b.add(list, 'block', `Kennzahl: ${value}`, { tag: 'li', ...C('stat-list__item') });
    const ic = b.add(li, 'div', 'Icon', C('icon-circle'));
    b.add(ic, 'icon', 'Symbol', fa(icon));
    const txt = b.add(li, 'div', 'Text', {});
    b.add(txt, 'text-basic', 'Wert', { text: value, tag: 'p', ...C('stat-list__value') });
    b.add(txt, 'text-basic', 'Beschriftung', { text: label, tag: 'p', ...C('stat-list__label') });
  }
  files['referenzen-neu-1-hero'] = b.content;
}

// ---------- 2. Kundenlogos ----------
{
  const b = builder('rkl');
  cls('customer-logos', { _padding: { top: 'var(--section-space-xs)', bottom: 'var(--section-space-xs)' } });
  cls('customer-logos__title', { _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--h3)' } });
  cls('customer-logos__list', {
    _display: 'grid', _gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', '_gridTemplateColumns:tablet_portrait': 'repeat(3, minmax(0, 1fr))', '_gridTemplateColumns:mobile_portrait': 'repeat(2, minmax(0, 1fr))', _alignItems: 'center', _justifyItems: 'center', _columnGap: 'var(--space-l)', _rowGap: 'var(--space-m)',
    _margin: { top: '0', right: '0', bottom: '0', left: '0' }, _padding: { top: '0', right: '0', bottom: '0', left: '0' },
    _cssCustom: '.customer-logos__list {\n  list-style: none;\n}',
  });
  cls('customer-logos__item', { _width: 'auto', _display: 'flex', _alignItems: 'center', _justifyContent: 'center', _margin: { top: '0', bottom: '0' } });
  cls('customer-logos__logo', { _height: '6.4rem', _width: 'auto', _widthMax: '100%', _objectFit: 'contain' });
  cls('customer-logos__note', { _margin: { top: '0', bottom: '0' }, _widthMax: '110ch', _typography: { 'font-size': 'var(--text-m)', 'text-align': 'center', color: { raw: 'var(--text-dark-muted)' } }, _cssCustom: '.customer-logos__note {\n  margin-inline: auto;\n}' });
  const sec = b.add(null, 'section', 'Kundenlogos', C('customer-logos'));
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  b.add(con, 'heading', 'Überschrift', { text: 'Eine Auswahl unserer Kunden', tag: 'h2', ...C('customer-logos__title') });
  const list = b.add(con, 'block', 'Logo-Liste', { tag: 'ul', ...C('customer-logos__list') });
  const item = b.add(list, 'block', 'Logo (Loop: 6 ausgewählte Referenzen)', {
    tag: 'li', hasLoop: true,
    query: { objectType: 'post', post_type: ['referenzen'], posts_per_page: '6', post__in: ['4120', '9298', '9297', '9283', '2750', '2751'], orderby: 'post__in', meta_query: [{ id: 'rklmq1', key: 'aktiv', value: '1' }] },
    ...C('customer-logos__item'),
  });
  b.add(item, 'image', 'Logo', { image: { useDynamicData: '{mb_referenzen_logo}', size: 'medium' }, altText: '{post_title}', ...C('customer-logos__logo') });
  b.add(con, 'text-basic', 'Hinweis', { text: 'Darüber hinaus vertrauen zahlreiche weitere Unternehmen aus Industrie, Energie, öffentlicher Verwaltung, Gesundheitswesen, Finanzdienstleistungen und vielen weiteren Branchen auf WEKA E-Learning.', tag: 'p', ...C('customer-logos__note') });
  files['referenzen-neu-2-kunden'] = b.content;
}

// ---------- 3. Branchenlösungen ----------
{
  const b = builder('rbr');
  cls('industry-section__header', { _display: 'flex', _direction: 'column', _rowGap: 'var(--space-s)' });
  cls('industry-section__title', { _margin: { top: '0', bottom: '0' }, _widthMax: '100%', _typography: { 'font-size': 'var(--h1)', 'line-height': '1.15' }, _cssCustom: '.industry-section__title {\n  overflow-wrap: break-word;\n  hyphens: manual;\n}' });
  cls('industry-section__lede', { _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--text-l)' } });
  cls('industry-cards', { _alignItems: 'stretch', _columnGap: 'var(--space-s)', _rowGap: 'var(--space-s)', _margin: { top: '0', right: '0', bottom: '0', left: '0' }, _padding: { top: '0', right: '0', bottom: '0', left: '0' }, _cssCustom: '.industry-cards {\n  list-style: none;\n}' });
  cls('industry-card', {
    _display: 'flex', _direction: 'column', _rowGap: '0', _overflow: 'hidden', _margin: { top: '0', bottom: '0' },
    _background: { color: { raw: 'var(--white)' } },
    _border: { radius: { top: 'var(--radius)', right: 'var(--radius)', bottom: 'var(--radius)', left: 'var(--radius)' } },
    _cssCustom: '.industry-card {\n  box-shadow: 0 0.4rem 2.4rem var(--black-trans-10);\n}',
  });
  cls('industry-card__image', { _width: '100%', _height: 'auto', _objectFit: 'cover', _cssCustom: '.industry-card__image {\n  aspect-ratio: 3 / 2;\n}' });
  cls('industry-card__icon', { _position: 'relative', _zIndex: '1', _alignSelf: 'flex-start', _margin: { top: '-5.2rem', left: 'var(--space-m)' }, _cssCustom: '/* Kreis links, mittig auf der Unterkante des Fotos (Vorlage) */\n.industry-card__icon {\n  --icon-circle-size: 10.4rem;\n  border: 0.2rem solid var(--primary-trans-20);\n}' });
  cls('industry-card__body', { _display: 'flex', _direction: 'column', _rowGap: 'var(--space-s)', _flexGrow: '1', _padding: { top: 'var(--space-xs)', right: 'var(--space-m)', bottom: 'var(--space-m)', left: 'var(--space-m)' } });
  cls('industry-card__title', { _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--text-l)', 'font-weight': '700' } });
  cls('industry-card__button', { _width: '100%', _margin: { top: 'auto' } });
  cls('check-list__icon--plain', { _display: 'flex', _alignItems: 'center', _justifyContent: 'center', _background: { color: { raw: 'transparent' } }, _typography: { color: { raw: 'var(--primary-dark)' } }, _padding: { top: '0', right: '0', bottom: '0', left: '0' } });
  cls('industry-card__list', { _flexGrow: '1', _cssCustom: '/* Aufzählung in den Karten enger und dunkler als die gemeinsame .check-list (Vorlage) */\n.industry-card__body .industry-card__list.check-list {\n  row-gap: 0.15em;\n}\n\n.industry-card__list .check-list__item.brxe-block {\n  flex-wrap: nowrap;\n  align-items: center;\n  column-gap: 0.8em;\n}\n\n.industry-card__list .check-list__item .check-list__icon {\n  width: 1.1em;\n  height: 1.1em;\n  font-size: var(--text-m);\n  color: var(--primary-ultra-dark);\n}\n\n.industry-card__list .check-list__item .check-list__text {\n  padding-top: 0;\n  min-width: 0;\n  font-size: var(--text-l);\n  line-height: 1.3;\n  color: var(--base);\n  overflow-wrap: break-word;\n}\n\n/* Schmale Karten (2 Spalten auf Tablet hoch, Handy): kleinere Schrift */\n@media (max-width: 767px) {\n  .industry-card__list .check-list__item .check-list__text {\n    font-size: var(--text-m);\n  }\n}' });

  const sec = b.add(null, 'section', 'Branchenlösungen', C('industry-section', 'acss:bg--primary-ultra-light'));
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  const head = b.add(con, 'block', 'Kopf', C('industry-section__header'));
  b.add(head, 'text-basic', 'Dachzeile', { text: 'BRANCHENLÖSUNGEN', tag: 'p', ...C('eyebrow') });
  b.add(head, 'heading', 'Überschrift', { text: 'So unterschiedlich Unternehmen sind, so individuell sind die Anforderungen', tag: 'h2', ...C('industry-section__title') });
  b.add(head, 'text-basic', 'Einleitung', { text: 'Entdecken Sie, wie Unternehmen aus verschiedenen Branchen mit WEKA E-Learning typische Herausforderungen lösen – von Pflichtunterweisungen und Compliance bis zur digitalen Personalentwicklung.', tag: 'p', ...C('industry-section__lede') });
  const grid = b.add(con, 'block', 'Branchen-Karten', { tag: 'ul', ...C('industry-cards', 'acss:grid--4', 'acss:grid--l-2', 'acss:grid--s-1') });
  for (const [title, icon, imgId, file, items] of [
    ['Produktion & Industrie', 'factory', 10835, '2026/10/branche-produktion.jpg', ['Arbeitsschutz', 'Elektrosicherheit', 'Gefahrstoffe', 'Maschinen & Anlagen']],
    ['Verwaltung & Büro', 'users', 10836, '2026/10/branche-verwaltung.jpg', ['Datenschutz', 'Compliance', 'KI', 'IT-Sicherheit']],
    ['Energie & Infrastruktur', 'leaf', 10837, '2026/10/branche-energie.jpg', ['Sicherheitskultur', 'Regelwerke', 'Pflichtunterweisungen', 'Technische Inhalte']],
    ['Banken & Versicherungen', 'landmark', 10838, '2026/10/branche-banken.jpg', ['Compliance', 'Datenschutz', 'Informationssicherheit', 'Führung & Soft Skills']],
  ]) {
    const card = b.add(grid, 'block', `Karte: ${title}`, { tag: 'li', ...C('industry-card') });
    b.add(card, 'image', 'Foto (Platzhalter)', { image: img(imgId, file), ...C('industry-card__image') });
    const ic = b.add(card, 'div', 'Icon', C('icon-circle', 'icon-circle--white', 'industry-card__icon'));
    b.add(ic, 'icon', 'Symbol', fa(icon));
    const body = b.add(card, 'block', 'Inhalt', C('industry-card__body'));
    b.add(body, 'heading', 'Titel', { text: title, tag: 'h3', ...C('industry-card__title') });
    const ul = b.add(body, 'block', 'Häkchen-Liste', { tag: 'ul', ...C('check-list', 'industry-card__list') });
    for (const t of items) {
      const li = b.add(ul, 'block', `Listenpunkt: ${t}`, { tag: 'li', ...C('check-list__item') });
      b.add(li, 'icon', 'Häkchen', fa('check', C('check-list__icon', 'check-list__icon--plain')));
      b.add(li, 'text-basic', 'Listentext', { text: t, tag: 'span', ...C('check-list__text') });
    }
    b.add(body, 'button', 'Button: Mehr erfahren', { text: 'Mehr erfahren', link: btnLink('#'), ...arrow, ...C('acss:btn--action', 'industry-card__button') });
  }
  files['referenzen-neu-3-branchen'] = b.content;
}

// ---------- 4. Vorteile ----------
{
  const b = builder('rvt');
  cls('trust-benefits', { _padding: { top: '0', bottom: 'var(--section-space-xs)' } });
  cls('industry-section', { _padding: { top: 'var(--section-space-xs)', bottom: 'var(--section-space-xs)' } });
  cls('trust-benefits__title', { _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--h3)' } });
  cls('trust-benefits__list', { _alignItems: 'stretch', _margin: { top: '0', right: '0', bottom: '0', left: '0' }, _padding: { top: '0', right: '0', bottom: '0', left: '0' }, _cssCustom: '.trust-benefits__list {\n  list-style: none;\n}' });
  cls('trust-benefits__item', { _display: 'flex', _direction: 'row', _flexWrap: 'nowrap', _alignItems: 'flex-start', _columnGap: 'var(--space-s)', _margin: { top: '0', bottom: '0' }, _cssCustom: '.trust-benefits__item {\n  --icon-circle-size: 6.4rem;\n}' });
  cls('trust-benefits__item-title', { _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--text-m)', 'font-weight': '700', color: { raw: 'var(--primary-dark)' } } });
  cls('trust-benefits__text', { _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--text-s)', color: { raw: 'var(--text-dark-muted)' } } });
  const sec = b.add(null, 'section', 'Warum WEKA E-Learning', C('trust-benefits', 'acss:bg--primary-ultra-light'));
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  b.add(con, 'heading', 'Überschrift', { text: 'Warum Unternehmen auf WEKA E-Learning setzen', tag: 'h2', ...C('trust-benefits__title') });
  const ul = b.add(con, 'block', 'Vorteile', { tag: 'ul', ...C('trust-benefits__list', 'acss:grid--4', 'acss:grid--l-2', 'acss:grid--s-1') });
  for (const [icon, title, text] of [
    ['award', 'Praxisnahe Inhalte', 'Didaktisch hochwertig und direkt im Arbeitsalltag anwendbar.'],
    ['gear', 'Rechtssicher & aktuell', 'Inhalte zu gesetzlichen Anforderungen und aktuellen Themen.'],
    ['monitor', 'Flexible Nutzung', 'In bestehenden Lernsystemen oder als komplette Lösung.'],
    ['chart', 'Nachweisbare Ergebnisse', 'Transparente Dokumentation und messbare Lernfortschritte.'],
  ]) {
    const li = b.add(ul, 'block', `Vorteil: ${title}`, { tag: 'li', ...C('trust-benefits__item') });
    const ic = b.add(li, 'div', 'Icon', C('icon-circle', 'icon-circle--soft'));
    b.add(ic, 'icon', 'Symbol', fa(icon));
    const t = b.add(li, 'div', 'Text', {});
    b.add(t, 'text-basic', 'Titel', { text: title, tag: 'p', ...C('trust-benefits__item-title') });
    b.add(t, 'text-basic', 'Text', { text, tag: 'p', ...C('trust-benefits__text') });
  }
  files['referenzen-neu-4-vorteile'] = b.content;
}

// ---------- 5. Bewertungen ----------
{
  const b = builder('rbw');
  cls('rating-bar', { _padding: { top: 'var(--section-space-xs)', bottom: 'var(--section-space-xs)' } });
  cls('rating-bar__inner', { _display: 'flex', _direction: 'row', _flexWrap: 'wrap', _alignItems: 'center', _justifyContent: 'space-between', _columnGap: 'var(--space-l)', _rowGap: 'var(--space-m)', _cssCustom: '/* Mobil: Button volle Breite */\n@media (max-width: 767px) {\n  .rating-bar__inner > .brxe-button {\n    width: 100%;\n  }\n}' });
  cls('rating-bar__summary', { _width: 'auto', _display: 'flex', _direction: 'row', _flexWrap: 'nowrap', _alignItems: 'center', _columnGap: 'var(--space-m)', _rowGap: 'var(--space-s)', '_alignItems:mobile_landscape': 'flex-start' });
  cls('rating-bar__badge', { _cssCustom: '.rating-bar__badge {\n  --icon-circle-size: 8rem;\n}\n\n@media (max-width: 767px) {\n  .rating-bar__badge {\n    --icon-circle-size: 5.6rem;\n  }\n}' });
  cls('rating-bar__text', { _width: 'auto', _display: 'flex', _direction: 'column', _rowGap: 'var(--space-xs)' });
  cls('rating-bar__title', { _margin: { top: '0', bottom: '0' }, _widthMax: '18ch', _typography: { 'font-size': 'var(--h3)', 'line-height': '1.2' } });
  cls('rating-bar__score', { _width: 'auto', _display: 'flex', _direction: 'row', _flexWrap: 'wrap', _alignItems: 'center', _columnGap: 'var(--space-m)', _rowGap: 'var(--space-xs)' });
  cls('rating-bar__stars-wrap', { _width: 'auto', _display: 'flex', _direction: 'column', _alignItems: 'center' });
  cls('rating-bar__stars', {
    _typography: { 'font-size': 'var(--h2)', 'line-height': '1', 'letter-spacing': '0.08em' },
    _cssCustom: '/* --rating kommt per Attribut aus {echo:weka_pe_rating(\'prozent\')} */\n.rating-bar__stars {\n  display: inline-block;\n  background: linear-gradient(90deg, var(--warning) var(--rating, 100%), var(--shade-light) var(--rating, 100%));\n  -webkit-background-clip: text;\n  background-clip: text;\n  color: transparent;\n}',
  });
  cls('rating-bar__grade', { _typography: { 'font-size': 'var(--text-s)', 'font-weight': '700', 'text-transform': 'uppercase', 'letter-spacing': '0.06em', color: { raw: 'var(--primary-dark)' } } });
  cls('rating-bar__value', { _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--text-m)', color: { raw: 'var(--primary-dark)' } }, _cssCustom: '.rating-bar__value strong {\n  font-size: var(--text-xl);\n}' });
  cls('rating-bar__count', { _margin: { top: '0', bottom: '0' }, _typography: { 'font-size': 'var(--text-s)', color: { raw: 'var(--text-dark-muted)' } } });
  cls('rating-bar__seals', {
    _width: 'auto', _display: 'flex', _direction: 'row', _alignItems: 'center', _columnGap: 'var(--space-m)',
    _padding: { left: 'var(--space-l)' },
    _border: { width: { left: '1px' }, style: 'solid', color: { raw: 'var(--border-color-dark)' } },
    '_padding:tablet_portrait': { left: '0' }, '_border:tablet_portrait': { width: { left: '0' } },
  });
  cls('rating-bar__seal', { _height: '11rem', _width: 'auto' });

  const sec = b.add(null, 'section', 'Bewertungen', C('rating-bar'));
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  const inner = b.add(con, 'block', 'Bewertungsleiste', C('rating-bar__inner'));
  const sum = b.add(inner, 'block', 'Zusammenfassung', C('rating-bar__summary'));
  const badge = b.add(sum, 'div', 'Icon', C('icon-circle', 'icon-circle--rating', 'rating-bar__badge'));
  b.add(badge, 'icon', 'Symbol', fa('badge'));
  const txt = b.add(sum, 'block', 'Text', C('rating-bar__text'));
  b.add(txt, 'heading', 'Überschrift', { text: 'Kundenbewertungen auf Proven Expert', tag: 'h2', ...C('rating-bar__title') });
  const score = b.add(txt, 'block', 'Wertung', C('rating-bar__score'));
  const sw = b.add(score, 'div', 'Sterne', C('rating-bar__stars-wrap'));
  b.add(sw, 'text-basic', 'Sterne (Breite aus Proven Expert)', {
    text: '★★★★★', tag: 'span', ...C('rating-bar__stars'),
    _attributes: [
      { id: 'rbwat1', name: 'style', value: "--rating: {echo:weka_pe_rating('prozent')}%" },
      { id: 'rbwat2', name: 'role', value: 'img' },
      { id: 'rbwat3', name: 'aria-label', value: "{echo:weka_pe_rating('note')} von 5 Sternen" },
    ],
  });
  b.add(sw, 'text-basic', 'Urteil', { text: "{echo:weka_pe_rating('text')}", tag: 'span', ...C('rating-bar__grade') });
  const val = b.add(score, 'div', 'Note', {});
  b.add(val, 'text-basic', 'Note', { text: "<strong>{echo:weka_pe_rating('note')}</strong> von 5", tag: 'p', ...C('rating-bar__value') });
  b.add(val, 'text-basic', 'Anzahl', { text: "{echo:weka_pe_rating('anzahl')} Bewertungen", tag: 'p', ...C('rating-bar__count') });
  b.add(inner, 'button', 'Button: Bewertungen ansehen', { text: 'Bewertungen ansehen', link: btnLink('https://www.provenexpert.com/de-de/weka-e-learning/', true), ...arrow, ...C('acss:btn--primary', 'acss:btn--outline') });
  const seals = b.add(inner, 'block', 'Siegel', C('rating-bar__seals'));
  b.add(seals, 'image', 'Siegel: Comenius EduMedia 2025', { image: img(8663, '2026/01/Logo-Comenius-Siegel-2025-CMYK-002.png'), ...C('rating-bar__seal') });
  b.add(seals, 'image', 'Siegel: Proven Expert', { image: img(8667, '2026/01/ProvenExpert-Bewertungssiegel.png'), ...C('rating-bar__seal') });
  files['referenzen-neu-5-bewertungen'] = b.content;
}

// ---------- 6. Beratung ----------
{
  const b = builder('rbt');
  const { content } = imageBanner(b, {
    label: 'Beratung', imageId: 10834, imageFile: '2026/10/referenzen-beratung.jpg',
    eyebrow: 'PERSÖNLICHE BERATUNG', title: 'Finden Sie die passende E-Learning Lösung für Ihr Unternehmen.', tag: 'h2',
    lede: 'Unsere Expertinnen und Experten beraten Sie gerne und zeigen Ihnen, welche Lösung zu Ihren Anforderungen passt.',
    quote: 'Gemeinsam die beste Lösung finden.',
  });
  const act = b.add(content, 'block', 'Button-Gruppe', C('image-banner__actions'));
  b.add(act, 'button', 'Button: Jetzt beraten lassen', { text: 'Jetzt beraten lassen', link: btnLink('/kontakt/'), ...arrow, ...C('acss:btn--action') });
  files['referenzen-neu-6-beratung'] = b.content;
}

// ---------- Schreiben ----------
const TITEL = {
  'referenzen-neu-1-hero': 'Referenzen-neu 1 – Hero', 'referenzen-neu-2-kunden': 'Referenzen-neu 2 – Kundenlogos',
  'referenzen-neu-3-branchen': 'Referenzen-neu 3 – Branchenlösungen', 'referenzen-neu-4-vorteile': 'Referenzen-neu 4 – Vorteile',
  'referenzen-neu-5-bewertungen': 'Referenzen-neu 5 – Bewertungen', 'referenzen-neu-6-beratung': 'Referenzen-neu 6 – Beratung',
};
// Für Templates: eigene Klassen + mitbenutzte vorhandene Klassen (ACSS-Klassen gibt es auf jeder ACSS-Seite)
const templateClasses = (content) => {
  const ids = new Set(content.flatMap((e) => e.settings._cssGlobalClasses || []));
  return [...usedClasses(content), ...VORHANDEN.filter((k) => ids.has(k.id))];
};
mkdirSync(TPL, { recursive: true });
const all = [];
for (const [name, content] of Object.entries(files)) {
  const out = { content, source: 'bricksCopiedElements', sourceUrl: SITE, version: VERSION, globalClasses: usedClasses(content), globalElements: [] };
  writeFileSync(join(OUT, name + '.json'), JSON.stringify(out, null, 1) + '\n');
  const tpl = { title: TITEL[name], templateType: 'section', content, pageSettings: [], templateSettings: [], global_classes: templateClasses(content) };
  writeFileSync(join(TPL, name + '.json'), JSON.stringify(tpl, null, 1) + '\n');
  all.push(...content);
  console.log(name, content.length, 'Elemente,', tpl.global_classes.length, 'Klassen im Template');
}
// Gesamtdatei nur zum Einfügen (nicht im Repo)
writeFileSync(join(process.argv[2] || OUT, 'referenzen-neu-gesamt.json'), JSON.stringify({ content: all, source: 'bricksCopiedElements', sourceUrl: SITE, version: VERSION, globalClasses: usedClasses(all), globalElements: [] }));
// Kollisionsprüfung der abgeleiteten IDs
const ids = [...classDefs.keys()].map(cid); if (new Set(ids).size !== ids.length) throw new Error('Klassen-ID doppelt');
console.log('Klassen gesamt:', classDefs.size);
