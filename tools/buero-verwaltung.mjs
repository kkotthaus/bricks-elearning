// Erzeugt die Sections der Seite „Büro-Verwaltung“ (Vorlage: docs/vorlagen/buero-verwaltung/):
// - bricks/buero-verwaltung-*.json            Bricks-Clipboard-JSON (Strg+V im Builder)
// - bricks/templates/buero-verwaltung-*.json  Bricks-Section-Templates (Bricks › Templates › Importieren)
// Aufruf: node tools/buero-verwaltung.mjs [ausgabeordner-für-gesamtdatei]
//
// Auswahlfelder, Empfehlung und Themenfilter steuert das WPCodeBox-Snippet snippets/weka-buero-verwaltung.js
// (Datenattribute data-office-*). Aufklappen von Themen und Fragen: natives <details>/<summary>, ohne Skript.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHRIFT, schrift } from './schrift.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'bricks');
const TPL = join(OUT, 'templates');
const VORHANDEN = JSON.parse(readFileSync(join(ROOT, 'tools', 'referenzen-neu-vorhandene-klassen.json'), 'utf8'));
const VERSION = '2.4.2';
const SITE = 'http://weka-e.local';

const SHOP = 'https://lernen.weka.de/de/t/schulungen-f%C3%BCr-b%C3%BCromitarbeitende';
const FLAT = 'https://lernen.weka.de/de/e/weka-ecampus-flatrate-unterweisungen-140';
const KONTAKT = 'https://www.weka-elearning.de/kontakt/';
// Hero-Foto (assets/bilder/Gemeinsam-online-lernen-im-modernen-Buero.png) – lokale Anhang-ID; auf Live nach dem Hochladen im Builder neu wählen
const HERO_BILD = { id: 10867, filename: 'Gemeinsam-online-lernen-im-modernen-Buero.png', url: SITE + '/wp-content/uploads/2026/11/Gemeinsam-online-lernen-im-modernen-Buero.png' };

// Klassen-ID aus dem Namen ableiten (gleicher Name = gleiche ID)
const cid = (name) => BigInt('0x' + createHash('sha1').update(name).digest('hex').slice(0, 12)).toString(36).slice(0, 6).padStart(6, 'k');
const EXISTING = { eyebrow: 'aq6l6g' };
const classDefs = new Map();
const cls = (name, settings) => { classDefs.set(name, settings); return name; };
const ref = (n) => (EXISTING[n] ? EXISTING[n] : n.startsWith('acss:') ? 'acss_import_' + n.slice(5) : cid(n));

function builder(prefix) {
  let n = 0;
  const content = [];
  const id = () => prefix + String(++n).padStart(3, '0');
  const add = (parent, name, label, settings = {}) => {
    const e = { id: id(), name, parent: parent ? parent.id : 0, children: [], settings, label };
    if (settings._cssGlobalClasses) settings._cssGlobalClasses = settings._cssGlobalClasses.map(ref);
    if (settings._attributes) settings._attributes = settings._attributes.map(([name, value], i) => ({ id: e.id + 'a' + i, name, value }));
    if (parent) parent.children.push(e.id);
    content.push(e);
    return e;
  };
  return { content, add };
}
const C = (...names) => ({ _cssGlobalClasses: names });
const link = (url) => ({ type: 'external', url });
const custom = (tag) => ({ tag: 'custom', customTag: tag });
const arrow = { icon: { library: 'fontawesomeSolid', icon: 'fas fa-arrow-right' }, iconPosition: 'right' };
const NULL4 = { top: '0', right: '0', bottom: '0', left: '0' };
const m0 = { _margin: { top: '0', bottom: '0' } };
const muted = { color: { raw: 'var(--text-dark-muted)' } };
const files = {};
// Dachzeilen in Großbuchstaben wie auf „Referenzen-neu“ (die Klasse eyebrow formt nicht um)
const up = (s) => s.toLocaleUpperCase('de-DE');

// ---------- Gemeinsame Klassen ----------
cls('office-intro', { _display: 'flex', _direction: 'column', _rowGap: 'var(--space-s)', _widthMax: '76ch' });
cls('office-title', { ...m0, _widthMax: '100%', _cssCustom: '.office-title {\n  overflow-wrap: break-word;\n  hyphens: manual;\n  letter-spacing: -0.02em;\n}' });
cls('office-lede', { ...m0, _typography: muted });
cls('office-text', { ...m0, _typography: muted });
cls('office-ticks', {
  _display: 'flex', _direction: 'column', _rowGap: 'var(--space-xs)', _margin: NULL4, _padding: NULL4,
  _cssCustom: '.office-ticks {\n  list-style: none;\n}\n\n.office-ticks > li {\n  position: relative;\n  padding-left: 1.4em;\n}\n\n/* Häkchen wie Vorlage */\n.office-ticks > li::before {\n  content: "✓";\n  position: absolute;\n  left: 0;\n  color: var(--action-dark);\n  font-weight: 700;\n}',
});
cls('office-label', { _display: 'block', _margin: { top: '0', bottom: 'var(--space-xs)' }, _typography: { 'font-weight': '700', color: { raw: 'var(--text-dark)' } } });
// Auswahlfeld: im Builder eine Liste, im Frontend macht das Snippet daraus ein <select> mit derselben Klasse
cls('office-select', {
  _display: 'block', _width: '100%',
  _padding: { top: '0.75em', right: '1em', bottom: '0.75em', left: '1em' },
  _background: { color: { raw: 'var(--white)' } },
  _border: { width: { top: '1px', right: '1px', bottom: '1px', left: '1px' }, style: 'solid', color: { raw: 'var(--shade-light)' }, radius: { top: 'var(--radius-xs)', right: 'var(--radius-xs)', bottom: 'var(--radius-xs)', left: 'var(--radius-xs)' } },
  _typography: { 'font-size': 'var(--text-m)', color: { raw: 'var(--text-dark)' } },
  _cssCustom: '.office-select {\n  font-family: inherit;\n  list-style: none;\n}\n\n/* Liste ohne Skript (Builder): Einträge untereinander */\n.office-select > li {\n  margin: 0;\n}\n\n.office-select:focus-visible {\n  outline: 2px solid var(--primary);\n  outline-offset: 2px;\n}',
});

// Grüne Dachzeile auf dunklem Grund (Lösungsfinder, Lernplan-Karte auf „Zielgruppe“)
  cls('office-plan__eyebrow', { _typography: { color: { raw: 'var(--action-light)' } } });

function intro(b, parent, { eyebrow, title, tag = 'h2', lede, ledeClass = 'office-lede' }) {
  const box = b.add(parent, 'block', 'Einleitung', C('office-intro'));
  b.add(box, 'text-basic', 'Dachzeile', { text: up(eyebrow), tag: 'p', ...C('eyebrow') });
  b.add(box, 'heading', 'Überschrift', { text: title, tag, ...C('office-title') });
  if (lede) b.add(box, 'text-basic', 'Einleitung', { text: lede, tag: 'p', ...C(ledeClass) });
  return box;
}
function select(b, parent, { name, id, label, options }) {
  b.add(parent, 'text-basic', `Beschriftung: ${label}`, { text: label, ...custom('label'), _attributes: [['for', id]], ...C('office-label') });
  const ul = b.add(parent, 'block', `Auswahlfeld (${name})`, { tag: 'ul', _attributes: [['data-office-select', name], ['data-office-id', id], ['data-office-label', label]], ...C('office-select') });
  for (const [value, text] of options) b.add(ul, 'text-basic', `Option: ${text}`, { text, tag: 'li', _attributes: [['data-value', value]] });
}

// ---------- 1. Hero ----------
// Nachbau des Entwurfs vom 04.11.2026 (docs/vorlagen/buero-verwaltung/hero-2026-11-04.png, 1672 px = Ansicht 1536 px,
// Inhalt 1440 px). Eigener Block office-cover, damit der Hero von „Zielgruppe“ (office-hero) unverändert bleibt.
// Schriften, Abstände und Rundungen wachsen mit der Spaltenbreite (Container-Einheit cqi) – so stimmen die
// Proportionen des Entwurfs auf jeder Desktop-Breite. Schriftgrößen stehen in tools/schrift.mjs (audience-cover-*).
{
  const b = builder('bvh');
  cls('office-cover', {
    _padding: { top: 'calc(var(--section-space-xs) * 1.1)', bottom: 'calc(var(--section-space-xs) * 1.2)' },
    _cssCustom: '/* Sehr helles Blau, nach rechts fast weiß (Entwurf) */\n.office-cover {\n  background: linear-gradient(90deg, color-mix(in srgb, var(--primary-ultra-light) 45%, var(--white)), color-mix(in srgb, var(--primary-ultra-light) 15%, var(--white)));\n}',
  });
  // Spalten wie im Entwurf: Text 715,5 px, Foto 694,5 px, Abstand 30 px (bei 1440 px Inhalt)
  cls('office-cover__grid', {
    _display: 'grid', _gridTemplateColumns: 'minmax(0, 715.5fr) minmax(0, 694.5fr)', '_gridTemplateColumns:tablet_portrait': 'minmax(0, 1fr)',
    _alignItems: 'center', _columnGap: 'var(--space-m)', _rowGap: 'var(--space-xl)',
  });
  cls('office-cover__content', {
    _display: 'flex', _direction: 'column', _alignItems: 'flex-start', _alignSelf: 'start', _rowGap: '0',
    _cssCustom: '/* Bezugsgröße für cqi: die Textspalte */\n.office-cover__content {\n  container-type: inline-size;\n}',
  });
  cls('office-cover__eyebrow', {
    // Abstand oben: Text beginnt im Entwurf 22 px unter der Oberkante des Fotos (nicht mittig)
    // Flex: bricht der Text auf dem Handy um, steht die zweite Zeile eingerückt neben dem Balken
    _display: 'flex', _alignItems: 'flex-start',
    _margin: { top: '3.63cqi', bottom: '0' }, _typography: { 'font-weight': '700', 'line-height': '1.25', 'letter-spacing': '0.02em', color: { raw: 'var(--primary-ultra-dark)' } },
    _cssCustom: '/* Grüner Balken links (Entwurf: 12 × 36 px) */\n.office-cover__eyebrow::before {\n  content: "";\n  flex-shrink: 0;\n  width: 0.42em;\n  height: 1.25em;\n  margin-right: 0.77em;\n  vertical-align: top;\n  transform: translateY(-0.084em);\n  background: var(--action);\n  border-radius: 999px;\n}',
  });
  cls('office-cover__title', {
    _margin: { top: '5.4cqi', bottom: '0' }, _widthMax: '100%',
    _typography: { 'font-weight': '700', 'line-height': '1.1', 'letter-spacing': '0' },
    _cssCustom: '/* Etwas dunkler als die globale Überschriftenfarbe (Entwurf) */\n.office-cover__title {\n  color: color-mix(in srgb, var(--primary-dark) 70%, var(--primary-ultra-dark));\n}',
  });
  cls('office-cover__lede', { _margin: { top: '2.53cqi', bottom: '0' }, _typography: { 'line-height': '1.2', color: { raw: 'var(--primary-ultra-dark)' } } });
  cls('office-cover__actions', {
    _display: 'flex', _direction: 'row', _flexWrap: 'wrap', _columnGap: '2.5cqi', _rowGap: '2.5cqi', _margin: { top: '6.26cqi', bottom: '0' },
    _cssCustom: '/* Mobil: Buttons volle Breite */\n@media (max-width: 767px) {\n  .office-cover__actions {\n    width: 100%;\n  }\n\n  .office-cover__actions > .brxe-button {\n    width: 100%;\n  }\n}',
  });
  // Buttons wie im Entwurf: fett, abgerundet, größer als die ACSS-Buttons (Farben bleiben ACSS)
  cls('office-cover__button', {
    _padding: { top: '0.616em', right: '0.97em', bottom: '0.616em', left: '1.15em' }, _columnGap: '0.47em',
    _typography: { 'font-size': 'clamp(var(--text-m), 3.58cqi, 2.56rem)', 'font-weight': '700', 'line-height': '1.2' },
    _border: { radius: { top: '0.48em', right: '0.48em', bottom: '0.48em', left: '0.48em' } },
  });
  cls('office-cover__note', { _margin: { top: '4.08cqi', bottom: '0' }, _typography: { 'line-height': '1.3', color: { raw: 'var(--primary-ultra-dark)' } } });

  // Foto mit Bildunterschrift; dahinter eine hellgrüne Fläche, die nach rechts höher wird (Maske als SVG)
  const FORM = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 738 774' preserveAspectRatio='none'%3E%3Cpath d='M0 76.3 L696.2 4.3 Q738 0 738 42 L738 732.1 Q738 774.1 696.1 771.7 L0 732.2 Z'/%3E%3C/svg%3E\")";
  cls('office-cover__media', {
    _position: 'relative', _margin: NULL4, _rowGap: '0', _width: '100%', '_widthMax:tablet_portrait': '64rem',
    _cssCustom: `.office-cover__media {\n  isolation: isolate;\n  container-type: inline-size;\n}\n\n/* Grüne Fläche: rechts 22 px breiter, oben 39 px und unten 49 px höher als das Foto (Entwurf) */\n.office-cover__media::before {\n  content: "";\n  position: absolute;\n  inset: -5.72% -2.9% -7.1% 5.3%;\n  z-index: -1;\n  background: var(--action-light);\n  -webkit-mask: ${FORM} center / 100% 100% no-repeat;\n  mask: ${FORM} center / 100% 100% no-repeat;\n}`,
  });
  // Rundung 37,6 px bei 694,5 px Breite (Entwurf) – größer als die ACSS-Radien, daher relativ zur Fotobreite
  cls('office-cover__image', {
    _display: 'block', _width: '100%', _height: 'auto', _objectFit: 'cover',
    _border: { radius: { top: '5.4cqi', right: '5.4cqi', bottom: '0', left: '0' } },
    _cssCustom: '/* Ausschnitt wie im Entwurf: volle Breite, oben bündig */\n.office-cover__image {\n  aspect-ratio: 694.5 / 512.6;\n  object-position: center top;\n}',
  });
  cls('office-cover__caption', {
    _display: 'flex', _direction: 'column', _alignItems: 'center', _rowGap: '0', _margin: NULL4,
    _padding: { top: '3.44cqi', right: '3cqi', bottom: '2.98cqi', left: '3cqi' },
    _border: { radius: { top: '0', right: '0', bottom: '5.4cqi', left: '5.4cqi' } },
    _typography: { 'text-align': 'center', color: { raw: 'var(--white)' } },
    _cssCustom: '/* Verlauf von Blau nach Dunkelblau (Entwurf) */\n.office-cover__caption {\n  background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 75%, var(--primary-dark)), var(--primary-dark));\n}',
  });
  cls('office-cover__caption-title', { ...m0, _typography: { 'font-weight': '700', 'line-height': '1.022', color: { raw: 'var(--white)' } } });
  cls('office-cover__caption-text', { ...m0, _typography: { 'line-height': '1.3', color: { raw: 'var(--white)' } } });

  const sec = b.add(null, 'section', 'Hero – Büro & Verwaltung', C('office-cover'));
  const con = b.add(sec, 'container', 'Inhaltsbereich', C('office-cover__grid'));
  const content = b.add(con, 'block', 'Inhalt', C('office-cover__content'));
  b.add(content, 'text-basic', 'Dachzeile', { text: up('Für Mitarbeitende in Büro & Verwaltung'), tag: 'p', ...C('office-cover__eyebrow') });
  b.add(content, 'heading', 'Überschrift', { text: 'Sicher arbeiten.<br>Bewusst handeln.<br>Einfach online lernen.', tag: 'h1', ...C('office-cover__title') });
  b.add(content, 'text-basic', 'Einleitung', { text: 'Unterweisen Sie Ihr Team zu den Themen, die im Büroalltag zählen – von Arbeitsschutz und Datenschutz bis zum sicheren Umgang mit E-Mails und KI.', tag: 'p', ...C('office-cover__lede') });
  const act = b.add(content, 'block', 'Button-Gruppe', C('office-cover__actions'));
  b.add(act, 'button', 'Button: Passende Lösung finden', { text: 'Passende Lösung finden', link: link('#loesung'), ...arrow, ...C('acss:btn--primary', 'office-cover__button') });
  b.add(act, 'button', 'Button: Lernpakete entdecken', { text: 'Lernpakete entdecken', link: link('#pakete'), ...C('acss:btn--primary', 'acss:btn--outline', 'office-cover__button') });
  b.add(content, 'text-basic', 'Hinweis', { text: 'Für einzelne Mitarbeitende, kleine Teams und ganze Unternehmen.', tag: 'p', ...C('office-cover__note') });

  const media = b.add(con, 'block', 'Foto mit Bildunterschrift', { ...custom('figure'), ...C('office-cover__media') });
  b.add(media, 'image', 'Foto', { image: { id: HERO_BILD.id, filename: HERO_BILD.filename, size: 'full', url: HERO_BILD.url }, loading: 'eager',
    // Anzeigebreite statt 100vw, damit der Browser eine passende Größe lädt (Desktop ca. 700 px, bis 991 px max. 640 px)
    _attributes: [['sizes', '(max-width: 991px) min(100vw, 640px), 700px']], ...C('office-cover__image') });
  const cap = b.add(media, 'block', 'Bildunterschrift', { ...custom('figcaption'), ...C('office-cover__caption') });
  b.add(cap, 'text-basic', 'Titel', { text: 'Sicheres Wissen für Ihren Büroalltag', tag: 'p', ...C('office-cover__caption-title') });
  b.add(cap, 'text-basic', 'Themen', { text: 'Arbeitsschutz&nbsp;&nbsp;·&ensp;Datenschutz&nbsp;&nbsp;·&ensp;Compliance', tag: 'p', ...C('office-cover__caption-text') });
  files['buero-verwaltung-1-hero'] = b.content;
}

// ---------- 2. Vorteilsleiste ----------
{
  const b = builder('bvl');
  // Dunkelblaue Leiste mit grünen Häkchen (Entwurf 04.11.2026). Häkchen: Font Awesome 6 „check“ als Maske.
  const HAKEN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 96 448 320'%3E%3Cpath d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'/%3E%3C/svg%3E\")";
  cls('office-strip', { _padding: { top: '0', bottom: '0' }, _background: { color: { raw: 'var(--primary-dark)' } } });
  cls('office-strip__list', {
    _display: 'flex', _direction: 'row', _flexWrap: 'wrap', _justifyContent: 'space-between', _columnGap: 'var(--space-m)', _rowGap: 'var(--space-xs)',
    '_justifyContent:mobile_landscape': 'flex-start', '_direction:mobile_landscape': 'column',
    _margin: NULL4, _padding: { top: 'var(--space-m)', right: '0', bottom: 'var(--space-l)', left: '0' },
    _typography: { 'font-weight': '700', color: { raw: 'var(--white)' } },
    _cssCustom: `/* Bezugsgröße für cqi der Schrift: die Leiste */\n.office-strip__list {\n  list-style: none;\n  container-type: inline-size;\n}\n\n.office-strip__list > li {\n  display: flex;\n  align-items: center;\n}\n\n/* Grünes Häkchen 33 × 26 px (Entwurf) */\n.office-strip__list > li::before {\n  content: "";\n  flex-shrink: 0;\n  width: 1.32em;\n  height: 1.03em;\n  margin-right: 0.7em;\n  background: var(--action);\n  -webkit-mask: ${HAKEN} center / contain no-repeat;\n  mask: ${HAKEN} center / contain no-repeat;\n}`,
  });
  const sec = b.add(null, 'section', 'Vorteilsleiste', C('office-strip'));
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  const ul = b.add(con, 'block', 'Vorteile', { tag: 'ul', ...C('office-strip__list') });
  for (const t of ['Praxisnahe E-Learnings', 'Bedarfsgerechte Themenauswahl', 'Einzelkurse, Flatrate oder Unternehmenslösung']) {
    b.add(ul, 'text-basic', `Vorteil: ${t}`, { text: t, tag: 'li' });
  }
  files['buero-verwaltung-2-leiste'] = b.content;
}

// ---------- 3. Risiken / Themenbereiche ----------
{
  const b = builder('bvr');
  cls('office-risks__grid', { _margin: { top: 'var(--space-l)', right: '0', bottom: '0', left: '0' }, _padding: NULL4, _columnGap: 'var(--space-l)', _rowGap: 'var(--space-l)', _cssCustom: '.office-risks__grid {\n  list-style: none;\n}' });
  cls('office-risks__item', { _display: 'flex', _direction: 'column', _rowGap: 'var(--space-xs)', _margin: { top: '0', bottom: '0' }, _padding: { top: 'var(--space-s)' }, _border: { width: { top: '3px' }, style: 'solid', color: { raw: 'var(--action)' } } });
  cls('office-risks__title', { ...m0 });
  const sec = b.add(null, 'section', 'Risiken im Büro', { _cssId: 'themen', ...C('office-risks') });
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  intro(b, con, { eyebrow: 'Welche Unterweisungen spielen eine Rolle?', title: 'Auch im Büro gibt es Risiken.<br>Das passende Wissen hilft.', lede: 'Ein falsch eingerichteter Arbeitsplatz, eine täuschend echte E-Mail oder sensible Daten im falschen Verteiler: Sicherheit beginnt bei alltäglichen Entscheidungen.' });
  const ul = b.add(con, 'block', 'Themenbereiche', { tag: 'ul', ...C('office-risks__grid', 'acss:grid--3', 'acss:grid--m-1') });
  for (const [title, text] of [
    ['Arbeitsschutz & Gesundheit', 'Erstunterweisung und Büro- und Bildschirmarbeit legen die Grundlage. Je nach Arbeitsumgebung ergänzen Themen wie mobiles Arbeiten, Stolpergefahren oder Desk-Sharing die Auswahl.'],
    ['Datenschutz & IT-Sicherheit', 'Wer mit Kunden-, Personal- oder Unternehmensdaten arbeitet, braucht Orientierung. Sensibilisieren Sie für den Umgang mit Daten, verdächtige E-Mails und Informationssicherheit unterwegs.'],
    ['Zusammenarbeit & Compliance', 'Gleichbehandlung und klare Verhaltensregeln unterstützen ein respektvolles Miteinander. KI-Nutzung und Hinweisgeberschutz ergänzen das Wissen passend zur Tätigkeit.'],
  ]) {
    const li = b.add(ul, 'block', `Bereich: ${title}`, { tag: 'li', ...C('office-risks__item') });
    b.add(li, 'heading', 'Titel', { text: title, tag: 'h3', ...C('office-risks__title') });
    b.add(li, 'text-basic', 'Text', { text, tag: 'p', ...C('office-text') });
  }
  files['buero-verwaltung-3-risiken'] = b.content;
}

// ---------- Themen (für Lernpakete und Themenliste) ----------
const COURSES = [
  ['Erstunterweisung', 'Sicher in den Arbeitsalltag starten und grundlegende Verhaltensweisen kennenlernen. Betriebliche Abläufe und Ansprechpartner ergänzen die allgemeinen Inhalte.'],
  ['Büro- und Bildschirmarbeit', 'Für Beschäftigte am Schreibtisch: den Arbeitsplatz bewusst gestalten und Belastungen im Büroalltag erkennen.'],
  ['Grundlagen der Informationssicherheit', 'Unternehmensinformationen schützen und typische Sicherheitsrisiken im täglichen Umgang mit digitalen Informationen erkennen.', 'https://lernen.weka.de/de/e/grundlagen-informationssicherheit-173'],
  ['Grundlagen des Datenschutzes – Büro & Verwaltung', 'Für alle, die personenbezogene Daten verarbeiten: einen bewussten Umgang mit Kunden-, Personal- und Kontaktdaten fördern.', 'https://lernen.weka.de/de/e/datenschutz-b%C3%BCro-verwaltung-175'],
  ['Allgemeines Gleichbehandlungsgesetz', 'Für ein respektvolles Arbeitsumfeld sensibilisieren und Benachteiligung im beruflichen Alltag erkennen.'],
  ['Phishingattacken abwehren: Sicheres Arbeiten mit E-Mails', 'Verdächtige Nachrichten bewusster prüfen und Risiken durch Links, Anhänge und Täuschungsversuche erkennen.'],
  ['Mobiles Arbeiten', 'Für wechselnde Arbeitsorte sensibilisieren und Sicherheit sowie gesundes Arbeiten auch außerhalb des Büros mitdenken.'],
  ['Code of Conduct', 'Gemeinsame Verhaltensmaßstäbe verstehen und verantwortliches Handeln im Unternehmen stärken.', 'https://lernen.weka.de/de/e/code-of-conduct-156'],
  ['KI-Anwendungen sicher einsetzen', 'Für Mitarbeitende, die KI nutzen: Chancen und Risiken im Arbeitsalltag reflektieren und interne Regeln berücksichtigen.'],
  ['Whistleblowing und Hinweisgeberschutz', 'Für den verantwortungsvollen Umgang mit Hinweisen auf Missstände sensibilisieren. Betriebliche Meldewege ergänzen das Wissen.'],
  ['Energieeffizientes Verhalten in Büro & Verwaltung', 'Möglichkeiten erkennen, im Arbeitsalltag Energie bewusster einzusetzen und Ressourcen zu schonen.'],
  ['Stolpern, Rutschen, Stürzen', 'Unfallrisiken auf Wegen und am Arbeitsplatz wahrnehmen und zu einem sicheren Büroumfeld beitragen.'],
  ['Desk-Sharing', 'Für gemeinsam genutzte Arbeitsplätze: sichere, geordnete und auf den jeweiligen Nutzer abgestimmte Arbeitsbedingungen mitdenken.'],
  ['Informationssicherheit beim mobilen Arbeiten', 'Sensible Informationen auch unterwegs und an wechselnden Arbeitsorten schützen.'],
  ['Alkohol, Drogen und Medikamente', 'Für mögliche Auswirkungen auf Aufmerksamkeit und sicheres Verhalten bei der Arbeit sensibilisieren.'],
];
const PACKAGES = [
  ['Basisschutz', 'Die Grundlage für den Büroalltag.'],
  ['Erweiterter Schutz', 'Mehr Orientierung für digitale und mobile Arbeit.'],
  ['Rundum-Paket', 'Breiter aufgestellt für vielfältige Arbeitssituationen.'],
];

// ---------- 4. Lernpakete ----------
{
  const b = builder('bvp');
  cls('office-packages__grid', { _margin: { top: 'var(--space-l)', right: '0', bottom: '0', left: '0' }, _padding: NULL4, _alignItems: 'stretch', _columnGap: 'var(--space-s)', _rowGap: 'var(--space-s)', _cssCustom: '.office-packages__grid {\n  list-style: none;\n}' });
  cls('office-package', {
    _display: 'flex', _direction: 'column', _rowGap: 'var(--space-xs)', _margin: { top: '0', bottom: '0' },
    _padding: { top: 'var(--space-m)', right: 'var(--space-m)', bottom: 'var(--space-m)', left: 'var(--space-m)' },
    _background: { color: { raw: 'var(--white)' } },
    _border: { width: { top: '1px', right: '1px', bottom: '1px', left: '1px' }, style: 'solid', color: { raw: 'var(--border-color-dark)' }, radius: { top: 'var(--radius-xs)', right: 'var(--radius-xs)', bottom: 'var(--radius-xs)', left: 'var(--radius-xs)' } },
  });
  cls('office-package--featured', { _border: { width: { top: '2px', right: '2px', bottom: '2px', left: '2px' }, style: 'solid', color: { raw: 'var(--primary-dark)' }, radius: { top: 'var(--radius-xs)', right: 'var(--radius-xs)', bottom: 'var(--radius-xs)', left: 'var(--radius-xs)' } } });
  cls('office-package__count', {
    _margin: { top: 'var(--space-s)', bottom: 'var(--space-xs)' },
    _typography: { 'font-size': 'calc(var(--h1) * 1.1)', 'font-weight': '800', 'line-height': '1', color: { raw: 'var(--primary-dark)' } },
    _cssCustom: '.office-package__count span {\n  font-size: var(--text-m);\n  font-weight: 400;\n}',
  });
  cls('office-package__title', { ...m0 });
  cls('office-package__caption', { ...m0, _typography: muted });
  cls('office-package__includes', {
    _margin: { top: 'var(--space-xs)', bottom: '0' }, _padding: { top: '0.7em', right: '0.8em', bottom: '0.7em', left: '0.8em' },
    _background: { color: { raw: 'var(--primary-ultra-light)' } }, _border: { radius: { top: 'var(--radius-xs)', right: 'var(--radius-xs)', bottom: 'var(--radius-xs)', left: 'var(--radius-xs)' } },
    _typography: { color: { raw: 'var(--primary-dark)' } },
  });
  cls('office-package__list', { _margin: { top: 'var(--space-xs)', right: '0', bottom: 'var(--space-s)', left: '0' } });
  cls('office-package__button', { _width: '100%', _margin: { top: 'auto' } });
  cls('office-packages__hint', { _margin: { top: 'var(--space-m)', bottom: '0' }, _typography: muted });

  const sec = b.add(null, 'section', 'Lernpakete', { _cssId: 'pakete', ...C('office-packages', 'acss:bg--primary-ultra-light') });
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  intro(b, con, { eyebrow: 'Drei aufeinander aufbauende Lernpakete', title: 'So viel Basis wie nötig.<br>So viel Vertiefung wie sinnvoll.', lede: 'Nutzen Sie die Pakete als Orientierung für Ihren Lernplan. Jedes größere Paket enthält alle Themen der vorherigen Stufe. Welche Inhalte Ihr Team benötigt, richtet sich nach den Aufgaben und Bedingungen im Betrieb.', ledeClass: 'office-text' });
  const ul = b.add(con, 'block', 'Pakete', { tag: 'ul', ...C('office-packages__grid', 'acss:grid--3', 'acss:grid--m-1') });
  PACKAGES.forEach(([name, caption], i) => {
    const n = (i + 1) * 5;
    const li = b.add(ul, 'block', `Paket: ${name}`, { tag: 'li', ...C('office-package', ...(i === 1 ? ['office-package--featured'] : [])) });
    b.add(li, 'text-basic', 'Stufe', { text: up(`Stufe 0${i + 1}`), tag: 'p', ...C('eyebrow') });
    b.add(li, 'text-basic', 'Anzahl', { text: `${n} <span>E-Learnings</span>`, tag: 'p', ...C('office-package__count') });
    b.add(li, 'heading', 'Name', { text: name, tag: 'h3', ...C('office-package__title') });
    b.add(li, 'text-basic', 'Beschreibung', { text: caption, tag: 'p', ...C('office-package__caption') });
    b.add(li, 'text-basic', 'Umfang', { text: i ? `Alle Themen aus ${PACKAGES[i - 1][0]} +` : 'Diese fünf Themen bilden die Basis:', tag: 'p', ...C('office-package__includes') });
    const list = b.add(li, 'block', 'Themen', { tag: 'ul', ...C('office-ticks', 'office-package__list') });
    for (const [t] of COURSES.slice(i * 5, i * 5 + 5)) b.add(list, 'text-basic', `Thema: ${t}`, { text: t, tag: 'li' });
    b.add(li, 'button', `Button: Lösung für ${n} Themen finden`, {
      text: `Lösung für ${n} Themen finden`, link: link('#loesung'), ...arrow, _attributes: [['data-office-need', 'flat'], ['data-office-filter', String(n)]],
      ...C('acss:btn--primary', ...(i === 1 ? [] : ['acss:btn--outline']), 'office-package__button'),
    });
  });
  b.add(con, 'text-basic', 'Hinweis', { text: 'Die Lernpakete beschreiben eine Themenauswahl, keinen gesonderten Pauschaltarif. Den passenden Buchungs- oder Lizenzweg wählen Sie im nächsten Schritt. „Rundum“ bedeutet hier 15 ausgewählte Themen, keine vollständige Abdeckung aller betrieblichen Pflichten.', tag: 'p', ...C('office-packages__hint') });
  files['buero-verwaltung-4-lernpakete'] = b.content;
}

// ---------- 5. Lösungsfinder ----------
{
  const b = builder('bvf');
  cls('office-finder__grid', { _display: 'grid', _gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', '_gridTemplateColumns:mobile_landscape': 'minmax(0, 1fr)', _alignItems: 'start', _columnGap: 'var(--space-xxl)', _rowGap: 'var(--space-l)' });
  cls('office-finder__fields', {
    _display: 'flex', _direction: 'column', _rowGap: '0',
    _padding: { top: 'var(--space-m)', right: 'var(--space-m)', bottom: 'var(--space-m)', left: 'var(--space-m)' },
    _background: { color: { raw: 'var(--primary-ultra-light)' } }, _border: { radius: { top: 'var(--radius-xs)', right: 'var(--radius-xs)', bottom: 'var(--radius-xs)', left: 'var(--radius-xs)' } },
    _cssCustom: '/* Abstand zur nächsten Frage (Bricks schreibt die Klasse als .office-select.brxe-block) */\n.office-finder__fields .office-select.brxe-block {\n  margin-bottom: var(--space-s);\n}',
  });
  cls('office-finder__result', {
    _display: 'flex', _direction: 'column', _alignItems: 'flex-start', _rowGap: 'var(--space-xs)',
    _margin: { top: 'var(--space-xs)', bottom: '0' },
    _padding: { top: 'var(--space-m)', right: 'var(--space-m)', bottom: 'var(--space-m)', left: 'var(--space-m)' },
    _background: { color: { raw: 'var(--primary-dark)' } }, _typography: { color: { raw: 'var(--white)' } },
    _border: { radius: { top: 'var(--radius-xs)', right: 'var(--radius-xs)', bottom: 'var(--radius-xs)', left: 'var(--radius-xs)' } },
    _cssCustom: '/* Das Snippet blendet nicht passende Empfehlungen aus (hidden schlägt sonst display: flex nicht) */\n.office-finder__result[hidden] {\n  display: none;\n}',
  });
  cls('office-finder__result-title', { ...m0, _typography: { color: { raw: 'var(--white)' } } });
  cls('office-finder__result-text', { ...m0 });
  cls('office-paths', { _margin: { top: 'var(--space-xl)', right: '0', bottom: '0', left: '0' }, _padding: NULL4, _columnGap: 'var(--space-l)', _rowGap: 'var(--space-m)', _cssCustom: '.office-paths {\n  list-style: none;\n}' });
  cls('office-path', { _display: 'flex', _direction: 'column', _alignItems: 'flex-start', _rowGap: 'var(--space-xs)', _margin: { top: '0', bottom: '0' }, _padding: { top: 'var(--space-s)' }, _border: { width: { top: '1px' }, style: 'solid', color: { raw: 'var(--border-color-dark)' } } });
  cls('office-path__title', { ...m0 });
  cls('office-path__link', { _margin: { top: 'auto' }, _typography: { 'font-weight': '700' }, _cssCustom: '.office-path__link {\n  text-decoration: underline;\n  text-underline-offset: 0.3em;\n}' });

  const sec = b.add(null, 'section', 'Lösungsfinder', { _cssId: 'loesung', ...C('office-finder') });
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  const grid = b.add(con, 'block', 'Raster', C('office-finder__grid'));
  const left = intro(b, grid, { eyebrow: 'Ihr Weg zur passenden Lösung', title: 'Für Ihr Team.<br>In Ihrer Lernumgebung.', lede: 'Sie möchten direkt buchen oder die Unterweisung für Ihr Unternehmen organisieren? Finden Sie den passenden nächsten Schritt.' });
  b.add(left, 'text-basic', 'Text', { text: 'Bei mehr als 50 Mitarbeitenden im Unternehmen, einem eigenen LMS oder individuellen Anforderungen unterstützt Sie unser Vertrieb bei der Auswahl.', tag: 'p', ...C('office-text') });

  const fields = b.add(grid, 'block', 'Auswahl', C('office-finder__fields'));
  select(b, fields, { name: 'size', id: 'office-size', label: 'Wie groß ist Ihr Unternehmen? (gesamte Belegschaft)', options: [['small', 'Bis zu 50 Mitarbeitende'], ['large', 'Mehr als 50 Mitarbeitende']] });
  select(b, fields, { name: 'need', id: 'office-need', label: 'Was benötigen Sie?', options: [['flat', 'Mehrere Themen / ein Lernpaket'], ['single', 'Einen einzelnen Kurs'], ['lms', 'Inhalte für unser eigenes LMS'], ['advice', 'Eine individuelle Lösung / Beratung']] });
  const out = b.add(fields, 'div', 'Empfehlung (Ausgabe)', { _attributes: [['aria-live', 'polite']] });
  for (const [key, label, eyebrow, title, text, btn, url] of [
    ['flat', 'Empfehlung: Flatrate', '', 'Mehrere Themen? Flatrate prüfen.', 'Mit der eCampus-Flatrate bündeln Sie den Schulungsbedarf Ihrer Mitarbeitenden. Preise, enthaltene Kurse und Buchung finden Sie direkt im Shop.', 'Flatrate ansehen & buchen', FLAT],
    ['single', 'Empfehlung: Einzelkurs', '', 'Gezielt einen Kurs buchen', 'Wählen Sie im eCampus das Thema, das Sie jetzt benötigen.', 'Einzelkurse auswählen', SHOP],
    ['advice', 'Empfehlung: Beratung', 'Ihre Empfehlung', 'Persönlich zur passenden Unternehmenslösung', 'Stimmen Sie Themen, Einsatz und Lizenzierung mit unserem Vertrieb ab<span data-office-lms hidden> – passend zu Ihrem bestehenden LMS</span>.', 'Beratung beim Vertrieb anfragen', KONTAKT],
  ]) {
    const r = b.add(out, 'block', label, { _attributes: [['data-office-result', key]], ...C('office-finder__result') });
    if (eyebrow) b.add(r, 'text-basic', 'Dachzeile', { text: up(eyebrow), tag: 'p', ...C('eyebrow', 'office-plan__eyebrow') });
    b.add(r, 'heading', 'Titel', { text: title, tag: 'h3', ...C('office-finder__result-title') });
    b.add(r, 'text-basic', 'Text', { text, tag: 'p', ...C('office-finder__result-text') });
    b.add(r, 'button', `Button: ${btn}`, { text: btn, style: 'primary', link: link(url), ...arrow, ...C('acss:btn--action') });
  }

  const paths = b.add(con, 'block', 'Wege', { tag: 'ul', ...C('office-paths', 'acss:grid--3', 'acss:grid--m-1') });
  for (const [title, text, linkText, url] of [
    ['Unternehmenslösung', 'Für größere Unternehmen, eigene Lernplattformen und individuelle Anforderungen: Besprechen Sie Inhalte und Einsatz mit unserem Vertrieb.', 'Beratung anfragen →', KONTAKT],
    ['Flatrate im eCampus', 'Für kleine Teams mit mehreren Schulungsthemen: Unterweisungen pro Mitarbeitendem bündeln und online buchen. Aktueller Preis und Konditionen im Shop.', 'Flatrate ansehen & buchen →', FLAT],
    ['Einzelne Kurse', 'Für einen konkreten Schulungsbedarf: Den passenden Kurs auswählen und im eCampus direkt buchen.', 'Einzelkurse im Shop ansehen →', SHOP],
  ]) {
    const li = b.add(paths, 'block', `Weg: ${title}`, { tag: 'li', ...C('office-path') });
    b.add(li, 'heading', 'Titel', { text: title, tag: 'h3', ...C('office-path__title') });
    b.add(li, 'text-basic', 'Text', { text, tag: 'p', ...C('office-text') });
    b.add(li, 'text-link', `Link: ${linkText}`, { text: linkText, link: link(url), ...C('office-path__link') });
  }
  files['buero-verwaltung-5-loesung'] = b.content;
}

// ---------- 6. Themen im Überblick ----------
{
  const b = builder('bvt');
  cls('office-catalog__head', { _display: 'flex', _direction: 'row', _flexWrap: 'wrap', _justifyContent: 'space-between', _alignItems: 'flex-end', _columnGap: 'var(--space-l)', _rowGap: 'var(--space-m)' });
  cls('office-catalog__filter', { _width: 'auto', _widthMin: '24rem', '_width:mobile_landscape': '100%' });
  cls('office-catalog__grid', { _margin: { top: 'var(--space-m)' }, _columnGap: 'var(--space-l)', _rowGap: '0' });
  cls('office-course', {
    _display: 'block', _padding: { top: 'var(--space-s)', bottom: 'var(--space-s)' },
    _border: { width: { top: '1px' }, style: 'solid', color: { raw: 'var(--border-color-dark)' } },
    _cssCustom: '/* <details>: Bricks-Block wäre flex; Filter blendet per hidden aus */\n.office-course[hidden] {\n  display: none;\n}\n\n.office-course > p {\n  margin: var(--space-xs) 0 var(--space-xs);\n  padding-left: 3.4rem;\n  color: var(--text-dark-muted);\n}\n\n.office-course > a {\n  display: inline-block;\n  margin-left: 3.4rem;\n  font-weight: 700;\n}',
  });
  cls('office-summary', {
    _display: 'flex', _alignItems: 'baseline', _columnGap: 'var(--space-xs)', _typography: { 'font-weight': '700' },
    _cssCustom: '.office-summary {\n  cursor: pointer;\n  list-style: none;\n}\n\n.office-summary::-webkit-details-marker {\n  display: none;\n}\n\n/* Plus/Minus rechts wie Vorlage */\n.office-summary::after {\n  content: "+";\n  margin-left: auto;\n  padding-left: var(--space-xs);\n  font-size: var(--text-xl);\n  line-height: 1;\n  color: var(--primary);\n}\n\ndetails[open] > .office-summary::after {\n  content: "−";\n}\n\n.office-summary small {\n  flex-shrink: 0;\n  min-width: 2.4rem;\n  font-size: var(--text-xs);\n  font-weight: 400;\n  color: var(--text-dark-muted);\n}\n\n.office-summary:focus-visible {\n  outline: 2px solid var(--primary);\n  outline-offset: 4px;\n}',
  });

  const sec = b.add(null, 'section', 'Themen im Überblick', { _cssId: 'kurse', ...C('office-catalog', 'acss:bg--primary-ultra-light') });
  const con = b.add(sec, 'container', 'Inhaltsbereich', {});
  const head = b.add(con, 'block', 'Kopf', C('office-catalog__head'));
  intro(b, head, { eyebrow: 'Die Themen im Überblick', title: '15 Themen. Nah am Arbeitsalltag.', lede: 'Öffnen Sie ein Thema und erfahren Sie, wofür es relevant ist.', ledeClass: 'office-text' });
  const filter = b.add(head, 'div', 'Filter', C('office-catalog__filter'));
  select(b, filter, { name: 'filter', id: 'office-filter', label: 'Auswahl anzeigen', options: [['15', 'Alle 15 Themen'], ['5', 'Basisschutz · 5 Themen'], ['10', 'Erweiterter Schutz · 10 Themen']] });
  const grid = b.add(con, 'block', 'Themen', C('office-catalog__grid', 'acss:grid--2', 'acss:grid--m-1'));
  COURSES.forEach(([title, text, url], i) => {
    const nr = String(i + 1).padStart(2, '0');
    const d = b.add(grid, 'block', `Thema ${nr}: ${title}`, { ...custom('details'), _attributes: [['data-office-level', String((Math.floor(i / 5) + 1) * 5)]], ...C('office-course') });
    b.add(d, 'text-basic', 'Titel (aufklappen)', { text: `<small>${nr}</small>${title}`, ...custom('summary'), ...C('office-summary') });
    b.add(d, 'text-basic', 'Beschreibung', { text, tag: 'p' });
    b.add(d, 'text-link', 'Link zum Shop', { text: url ? 'Kurs im Shop ansehen →' : 'Zur Kursauswahl im Shop →', link: link(url || SHOP) });
  });
  files['buero-verwaltung-6-themen'] = b.content;
}

// ---------- 7. Fragen ----------
{
  const b = builder('bvq');
  // Lesebreite am Inhalt, nicht am Container (sonst fehlt dem Container max-width: 100 % auf dem Handy)
  cls('office-faq', { _display: 'flex', _direction: 'column', _rowGap: '0', _cssCustom: '.office-faq > * {\n  width: 100%;\n  max-width: 85ch;\n}' });
  cls('office-faq__list', { _margin: { top: 'var(--space-m)' } });
  cls('office-faq__item', {
    _display: 'block', _padding: { top: 'var(--space-s)', bottom: 'var(--space-s)' },
    _border: { width: { bottom: '1px' }, style: 'solid', color: { raw: 'var(--border-color-dark)' } },
    _cssCustom: '.office-faq__item > p {\n  margin: var(--space-xs) 0 0;\n  color: var(--text-dark-muted);\n}',
  });
  const sec = b.add(null, 'section', 'Fragen', C('office-questions'));
  const con = b.add(sec, 'container', 'Inhaltsbereich', C('office-faq'));
  intro(b, con, { eyebrow: 'Gut zu wissen', title: 'Ihre Fragen zur Unterweisung' });
  const list = b.add(con, 'div', 'Fragen', C('office-faq__list'));
  for (const [q, a] of [
    ['Sind alle 15 Themen für alle Mitarbeitenden verpflichtend?', 'Nein. Die Pakete helfen bei der Themenplanung. Welche Unterweisungen erforderlich sind, hängt unter anderem von Tätigkeit, Gefährdungsbeurteilung und betrieblichen Vorgaben ab. Ergänzende Themen dienen der Sensibilisierung und Weiterbildung. Die Auswahl ersetzt keine Prüfung Ihres konkreten Unterweisungsbedarfs.'],
    ['Ersetzt ein E-Learning die betriebliche Unterweisung vollständig?', 'Digitale Inhalte können Unterweisungen unterstützen. Arbeitsplatzbezogene Ergänzungen, eine Verständnisprüfung und die Möglichkeit mündlicher Rückfragen müssen berücksichtigt werden. Praktische Einweisungen bleiben dort erforderlich, wo die Tätigkeit sie verlangt. <a href="https://dguv.de/fb-org/sachgebiete/themen/elektronische-unterweisung/index.jsp">Mehr dazu bei der DGUV</a>.'],
    ['Wie unterscheiden sich Lernpaket und Flatrate?', 'Das Lernpaket zeigt eine sinnvolle Zusammenstellung von Themen. Die Flatrate ist eine Buchungsform im eCampus und umfasst einen darüber hinausgehenden Katalog. Maßgeblich für enthaltene Kurse, Laufzeit und Preise ist das aktuelle Shopangebot.'],
    ['Wann ist eine Flatrate sinnvoll?', 'Wenn Mitarbeitende mehrere Themen bearbeiten sollen oder sich ihr Schulungsbedarf über das Jahr verändert. Vergleichen Sie die aktuellen Einzelkurspreise mit dem Flatrate-Angebot für die gewünschte Anzahl an Personen.'],
    ['Wir haben schon ein LMS. Können wir die Inhalte darin einsetzen?', 'Wählen Sie im Lösungsfinder „Inhalte für unser eigenes LMS“. Der Vertrieb klärt mit Ihnen die passenden Inhalte, Lizenzierung und technischen Anforderungen Ihrer Lernplattform.'],
    ['Wie starten wir mit der Themenauswahl?', 'Beginnen Sie bei Tätigkeiten und Risiken: Welche Aufgaben übernehmen Ihre Mitarbeitenden? Arbeiten sie mobil, verarbeiten sie personenbezogene Daten oder nutzen sie KI? Wählen Sie daraus relevante Themen und ergänzen Sie die betrieblichen Besonderheiten.'],
  ]) {
    const d = b.add(list, 'block', `Frage: ${q}`, { ...custom('details'), ...C('office-faq__item') });
    b.add(d, 'text-basic', 'Frage (aufklappen)', { text: q, ...custom('summary'), ...C('office-summary') });
    b.add(d, 'text-basic', 'Antwort', { text: a, tag: 'p' });
  }
  files['buero-verwaltung-7-fragen'] = b.content;
}

// ---------- 8. Abschluss ----------
{
  const b = builder('bva');
  cls('office-closing', { _padding: { top: 'var(--section-space-s)', bottom: 'var(--section-space-s)' } });
  cls('office-closing__inner', {
    _display: 'flex', _direction: 'row', _flexWrap: 'wrap', _justifyContent: 'space-between', _alignItems: 'center', _columnGap: 'var(--space-l)', _rowGap: 'var(--space-m)',
    _cssCustom: '@media (max-width: 767px) {\n  .office-closing__inner > .brxe-button {\n    width: 100%;\n  }\n}',
  });
  cls('office-closing__title', { ...m0, _widthMax: '100%', _typography: { color: { raw: 'var(--white)' } } });
  const sec = b.add(null, 'section', 'Abschluss', C('office-closing', 'acss:bg--primary-dark'));
  const con = b.add(sec, 'container', 'Inhaltsbereich', C('office-closing__inner'));
  b.add(con, 'heading', 'Überschrift', { text: 'Bringen Sie sicheres Wissen<br>in Ihren Büroalltag.', tag: 'h2', ...C('office-title', 'office-closing__title') });
  b.add(con, 'button', 'Button: Jetzt passende Lösung finden', { text: 'Jetzt passende Lösung finden', style: 'primary', link: link('#loesung'), ...arrow, ...C('acss:btn--action') });
  files['buero-verwaltung-8-abschluss'] = b.content;
}

// ---------- Schriftgrößen (tools/schrift.mjs) ----------
schrift({ files, classDefs, cid, cls, existing: EXISTING });

// ---------- Schreiben ----------
const TITEL = {
  'buero-verwaltung-1-hero': 'Büro-Verwaltung 1 – Hero', 'buero-verwaltung-2-leiste': 'Büro-Verwaltung 2 – Vorteilsleiste',
  'buero-verwaltung-3-risiken': 'Büro-Verwaltung 3 – Risiken', 'buero-verwaltung-4-lernpakete': 'Büro-Verwaltung 4 – Lernpakete',
  'buero-verwaltung-5-loesung': 'Büro-Verwaltung 5 – Lösungsfinder', 'buero-verwaltung-6-themen': 'Büro-Verwaltung 6 – Themen',
  'buero-verwaltung-7-fragen': 'Büro-Verwaltung 7 – Fragen', 'buero-verwaltung-8-abschluss': 'Büro-Verwaltung 8 – Abschluss',
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
// Gesamtdatei (Seiteninhalt + alle Klassen) – nicht im Repo
writeFileSync(join(process.argv[2] || OUT, 'buero-verwaltung-gesamt.json'), JSON.stringify({ content: all, source: 'bricksCopiedElements', sourceUrl: SITE, version: VERSION, globalClasses: templateClasses(all), globalElements: [] }));
const ids = [...classDefs.keys()].map(cid); if (new Set(ids).size !== ids.length) throw new Error('Klassen-ID doppelt');
console.log('Klassen gesamt:', classDefs.size);
