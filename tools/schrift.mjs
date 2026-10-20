// Schriftgrößen der Seite „Zielgruppe“ und ihrer Unterseiten (z. B. Büro-Verwaltung)
//
// Je Größe eine Klasse: audience-h1 … audience-h6 und audience-text-l / -m / -s / -xs.
// Sie steht an jedem Überschriften- und Text-Element als erste Klasse und ist die einzige,
// die dort die Schriftgröße setzt. Ändert man im Builder die Größe dieser Klasse,
// ändert sie sich auf allen Zielgruppen-Seiten.
//
// Die Klasse richtet sich nach der Größe, nicht nach dem Tag: Ein <h3>, das wie eine
// h4-Überschrift aussieht, bekommt audience-h4.
//
// Nicht erfasst (behalten ihre eigene Größe): Dachzeilen (eyebrow, seitenweit), Zahlen als
// Gestaltung (Nummern, Paketgröße), Buttons (ACSS) und das Auswahlfeld des Lösungsfinders.

export const SCHRIFT = {
  'audience-h1': 'calc(var(--h1) * 1.2)',
  'audience-h2': 'var(--h2)',
  'audience-h3': 'var(--h3)',
  'audience-h4': 'var(--h4)',
  'audience-h5': 'var(--h5)',
  'audience-h6': 'var(--h6)',
  'audience-text-l': 'var(--text-l)',
  'audience-text-m': 'var(--text-m)',
  'audience-text-s': 'var(--text-s)',
  'audience-text-xs': 'var(--text-xs)',
};

// Größe der Texte in Elementen mit dieser Klasse (gilt auch für Kinder, z. B. Listeneinträge)
export const GROESSE = {
  'office-hero__title': 'audience-h1',
  'office-plan__title': 'audience-h3',
  'office-risks__title': 'audience-h4',
  'office-package__title': 'audience-h4',
  'office-finder__result-title': 'audience-h4',
  'office-path__title': 'audience-h4',
  'audience-card__title': 'audience-h3',
  'audience-org__title': 'audience-h3',
  'audience-self__title': 'audience-h3',
  'office-lede': 'audience-text-l',
  'office-finder__result-text': 'audience-text-m',
  'office-label': 'audience-text-s',
  'office-hero__note': 'audience-text-s',
  'office-plan__item-text': 'audience-text-s',
  'office-plan__note': 'audience-text-s',
  'office-strip__list': 'audience-text-s',
  'office-package__caption': 'audience-text-s',
  'office-package__includes': 'audience-text-s',
  'office-package__list': 'audience-text-s',
  'office-packages__hint': 'audience-text-s',
  'office-course': 'audience-text-s',
  'audience-breadcrumb': 'audience-text-s',
  'audience-card__text': 'audience-text-s',
  'audience-card__list': 'audience-text-s',
  'audience-card__note': 'audience-text-xs',
};

// Größe nur für das Element selbst (Klasse setzt keine Schriftgröße, Eltern-Klasse wäre falsch)
const SELBST = {
  'office-summary': 'audience-text-m', // Thementitel in office-course (dort gilt text-s nur für Beschreibung und Link)
};

const AUSNAHMEN = new Set([
  'eyebrow', 'office-plan__number', 'office-plan__number--large', 'audience-card__number', 'office-package__count', 'office-select',
]);
const TEXT = new Set(['heading', 'text-basic', 'text', 'text-link']);

/**
 * Legt die Schrift-Klassen an und setzt sie als erste Klasse an alle Überschriften und Texte.
 * files: { name: content[] } mit Klassen-IDs, classDefs: Map name → settings,
 * cid: Name → ID, cls: Klasse anlegen, existing: { name: id } bereits vorhandener Klassen.
 */
export function schrift({ files, classDefs, cid, cls, existing = {} }) {
  for (const [name, size] of Object.entries(SCHRIFT)) cls(name, { _typography: { 'font-size': size } });

  // Nur die Schrift-Klassen setzen Schriftgrößen
  for (const name of Object.keys(GROESSE)) {
    const s = classDefs.get(name);
    if (!s) continue;
    if (s._typography && 'font-size' in s._typography) throw new Error(`Schriftgröße in ${name} – gehört in die Schrift-Klasse`);
    if (/font-size/.test(s._cssCustom || '')) throw new Error(`Schriftgröße im Custom-CSS von ${name}`);
  }

  const nameById = new Map([...classDefs.keys()].map((n) => [cid(n), n]));
  for (const [n, id] of Object.entries(existing)) nameById.set(id, n);
  const names = (e) => (e.settings._cssGlobalClasses || []).map((id) => nameById.get(id) || id);

  for (const content of Object.values(files)) {
    const byId = new Map(content.map((e) => [e.id, e]));
    for (const e of content) {
      if (!TEXT.has(e.name)) continue;
      const own = names(e);
      if (own.some((n) => AUSNAHMEN.has(n) || SCHRIFT[n])) continue;
      let size = own.map((n) => SELBST[n] || GROESSE[n]).find(Boolean);
      for (let p = byId.get(e.parent); !size && p; p = byId.get(p.parent)) size = names(p).map((n) => GROESSE[n]).find(Boolean);
      if (!size) size = e.name === 'heading' ? `audience-${e.settings.tag || 'h3'}` : 'audience-text-m';
      if (!SCHRIFT[size]) throw new Error(`Keine Schrift-Klasse für ${e.id} (${size})`);
      e.settings._cssGlobalClasses = [cid(size), ...(e.settings._cssGlobalClasses || [])];
    }
  }
}
