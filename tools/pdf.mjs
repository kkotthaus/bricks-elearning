#!/usr/bin/env node
// Erzeugt die Anleitungen für die Live-Seite als PDF in docs/pdf/ aus den Markdown-Dateien in docs/. Aufruf: node tools/pdf.mjs
// Gedruckt wird mit Chrome oder Edge ohne Fenster; Seitenformat, Ränder und Fußzeile kommen aus dem CSS (@page).
// Keine Abhängigkeiten. Verstanden wird einfaches Markdown: Überschriften, Absätze, Listen (auch eingerückt und als
// Checkliste „- [ ]“), Tabellen, Code-Blöcke, fett, Code, Links.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(wurzel, 'docs');
const ausgabe = join(docs, 'pdf');

// Was gebaut wird
const dokumente = [
  { quelle: 'referenzen-neu-auf-live.md', pdf: 'WEKA-Referenzen-neu-auf-Live.pdf', titel: 'Referenzen-neu auf Live' },
  { quelle: 'live-angebot-pdf.md', pdf: 'WEKA-Angebotskonfigurator-auf-Live.pdf', titel: 'Angebotskonfigurator auf Live' },
];

const h = (text) => String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Verweise auf andere Markdown-Dateien zeigen im PDF auf das passende PDF im selben Ordner
const ziel = (adresse) => dokumente.find((d) => d.quelle === adresse)?.pdf ?? adresse;

// Auszeichnungen innerhalb einer Zeile: `Code`, **fett**, Links
function zeile(text) {
  const code = [];
  let t = h(text).replace(/`([^`]+)`/g, (_, c) => `\u0000${code.push(c) - 1}\u0000`);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, wort, adresse) => `<a href="${ziel(adresse)}">${wort}</a>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return t.replace(/\u0000(\d+)\u0000/g, (_, n) => `<code>${code[n]}</code>`);
}

const listenpunkt = /^(\s*)(- |\d+\. )(.*)$/;

// Liste ab Zeile i mit Einrückung tiefe; liefert HTML und die nächste Zeile
function liste(zeilen, i, tiefe) {
  const art = zeilen[i].match(listenpunkt)[2] === '- ' ? 'ul' : 'ol';
  const punkte = [];
  const start = art === 'ol' ? Number(zeilen[i].match(/\d+/)[0]) : 1;
  // Eingerückte Zeilen ohne Listenzeichen (Code-Block, Text) gehören zum vorigen Punkt
  const anhaengen = (html) => { punkte[punkte.length - 1] = punkte.at(-1).replace(/<\/li>$/, `${html}</li>`); };
  while (i < zeilen.length) {
    const m = zeilen[i].match(listenpunkt);
    const einzug = zeilen[i].match(/^\s*/)[0].length;
    if (!m && punkte.length && zeilen[i].trim() && einzug > tiefe) {
      if (zeilen[i].trimStart().startsWith('```')) {
        const block = [];
        for (i++; i < zeilen.length && !zeilen[i].trimStart().startsWith('```'); i++) block.push(h(zeilen[i].slice(einzug)));
        anhaengen(`<pre>${block.join('\n')}</pre>`);
      } else {
        anhaengen(`<p>${zeile(zeilen[i].trim())}</p>`);
      }
      i++;
      continue;
    }
    if (!m || m[1].length < tiefe) break;
    if (m[1].length > tiefe) {
      // Eingerückte Liste gehört zum vorigen Punkt
      const unter = liste(zeilen, i, m[1].length);
      anhaengen(unter.html);
      i = unter.i;
      continue;
    }
    const box = m[3].match(/^\[( |x)\] (.*)$/);
    punkte.push(box ? `<li class="haken${box[1] === 'x' ? ' haken--erledigt' : ''}">${zeile(box[2])}</li>` : `<li>${zeile(m[3])}</li>`);
    i++;
  }
  const checkliste = punkte.every((p) => p.startsWith('<li class="haken'));
  return { html: `<${art}${checkliste ? ' class="checkliste"' : ''}${start > 1 ? ` start="${start}"` : ''}>${punkte.join('')}</${art}>`, i };
}

function markdown(text) {
  const zeilen = text.replace(/\r/g, '').split('\n');
  const aus = [];
  let i = 0;
  while (i < zeilen.length) {
    const z = zeilen[i];
    if (!z.trim()) { i++; continue; }
    const kopf = z.match(/^(#{1,4}) (.*)$/);
    if (kopf) { aus.push(`<h${kopf[1].length}>${zeile(kopf[2])}</h${kopf[1].length}>`); i++; continue; }
    if (z.trimStart().startsWith('```')) {
      const block = [];
      for (i++; i < zeilen.length && !zeilen[i].trimStart().startsWith('```'); i++) block.push(h(zeilen[i]));
      aus.push(`<pre>${block.join('\n')}</pre>`); i++; continue;
    }
    if (z.startsWith('|')) {
      const reihen = [];
      for (; i < zeilen.length && zeilen[i].startsWith('|'); i++) reihen.push(zeilen[i].replace(/^\||\|$/g, '').split('|').map((s) => s.trim()));
      const [spalten, , ...rest] = reihen;
      aus.push(`<table><thead><tr>${spalten.map((s) => `<th>${zeile(s)}</th>`).join('')}</tr></thead><tbody>${rest.map((r) => `<tr>${r.map((s) => `<td>${zeile(s)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }
    if (listenpunkt.test(z)) {
      const l = liste(zeilen, i, z.match(listenpunkt)[1].length);
      aus.push(l.html); i = l.i; continue;
    }
    const absatz = [];
    for (; i < zeilen.length && zeilen[i].trim() && !/^(#{1,4} |\||\s*```)/.test(zeilen[i]) && !listenpunkt.test(zeilen[i]); i++) absatz.push(zeilen[i].trim());
    const inhalt = zeile(absatz.join(' '));
    aus.push(/^Stand: /.test(inhalt) ? `<p class="stand">${inhalt}</p>` : `<p>${inhalt}</p>`);
  }
  return aus.join('\n');
}

// Datum TT.MM.JJJJ: „Stand: …“ aus dem Text, sonst Änderungsdatum der Datei
function stand(d, text) {
  const s = text.match(/^Stand: (\d{2}\.\d{2}\.\d{4})/m)?.[1];
  if (s) return s;
  const t = statSync(join(docs, d.quelle)).mtime;
  return `${String(t.getDate()).padStart(2, '0')}.${String(t.getMonth() + 1).padStart(2, '0')}.${t.getFullYear()}`;
}

// Farben aus dem Projekt: Blau --primary, Überschriften #003580, Grün --action (projekt.md)
const seite = (d, inhalt) => `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>WEKA E-Learning – ${h(d.titel)}</title>
<style>
@page {
  size: A4; margin: 18mm 17mm 20mm;
  @bottom-left { content: "WEKA E-Learning – ${d.titel} · Stand ${d.stand}"; font: 8pt "Segoe UI", Arial, sans-serif; color: #5e6670; }
  @bottom-right { content: "Seite " counter(page) " von " counter(pages); font: 8pt "Segoe UI", Arial, sans-serif; color: #5e6670; }
}
* { box-sizing: border-box; }
body { margin: 0; font: 10pt/1.5 "Segoe UI", Arial, sans-serif; color: #1e2a36; }
.kopf { display: flex; justify-content: space-between; font-size: 8.5pt; color: #5e6670; margin-bottom: 5mm; }
h1 { font-size: 19pt; line-height: 1.25; margin: 0 0 6mm; padding-bottom: 3mm; border-bottom: 1.2mm solid #99cc00; color: #003580; }
h2 { font-size: 13.5pt; margin: 8mm 0 2.5mm; color: #003580; break-after: avoid; }
h3 { font-size: 11pt; margin: 5mm 0 1.5mm; color: #0052c2; break-after: avoid; }
h4 { font-size: 10pt; margin: 4mm 0 1mm; break-after: avoid; }
p { margin: 0 0 2.5mm; }
.stand { color: #5e6670; font-size: 9pt; }
ul, ol { margin: 0 0 3mm; padding-left: 5.5mm; }
li { margin-bottom: 1.2mm; }
li > ul, li > ol, li > pre { margin: 1mm 0 0; }
li > p { margin: 1mm 0 0; }
ol > li::marker { font-weight: 600; color: #0052c2; }
.checkliste { list-style: none; padding-left: 0; }
.haken { position: relative; padding-left: 7mm; break-inside: avoid; }
.haken::before { content: ""; position: absolute; left: 0; top: 0.6mm; width: 3.6mm; height: 3.6mm; border: 0.35mm solid #0052c2; border-radius: 0.6mm; }
.haken--erledigt::before { content: "✓"; color: #0052c2; font-size: 9pt; line-height: 3.4mm; text-align: center; }
table { width: 100%; border-collapse: collapse; margin: 2mm 0 4mm; font-size: 8.8pt; }
th, td { border: 0.25mm solid #c3d3e3; padding: 1.4mm 2mm; text-align: left; vertical-align: top; }
th { background: #eef4fa; }
tr { break-inside: avoid; }
code, pre { font: 8.5pt Consolas, "Cascadia Mono", monospace; }
code { background: #eef4fa; padding: 0 0.8mm; border-radius: 0.6mm; overflow-wrap: anywhere; }
pre { background: #eef4fa; padding: 2.5mm 3mm; border-radius: 1mm; white-space: pre-wrap; break-inside: avoid; }
a { color: #0052c2; }
</style>
</head>
<body>
<div class="kopf"><span>WEKA E-Learning · Anleitung für die Live-Seite</span><span>Kotthaus Business Service</span></div>
${inhalt}
</body>
</html>
`;

function findeChrome() {
  const chrome = [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ].find((pfad) => pfad && existsSync(pfad));
  if (!chrome) throw new Error('Chrome nicht gefunden. Pfad in der Umgebungsvariable CHROME angeben.');
  return chrome;
}

const chrome = findeChrome();
mkdirSync(ausgabe, { recursive: true });
const profil = mkdtempSync(join(tmpdir(), 'weka-pdf-'));
try {
  for (const d of dokumente) {
    const text = readFileSync(join(docs, d.quelle), 'utf8');
    d.stand = stand(d, text);
    const html = join(docs, `.druck-${d.quelle}.html`);
    const pdf = join(ausgabe, d.pdf);
    writeFileSync(html, seite(d, markdown(text)));
    try {
      execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--user-data-dir=${profil}`, `--print-to-pdf=${pdf}`, pathToFileURL(html).href], { stdio: 'ignore' });
    } finally {
      rmSync(html, { force: true });
    }
    console.log(`PDF: ${pdf}`);
  }
} finally {
  rmSync(profil, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
