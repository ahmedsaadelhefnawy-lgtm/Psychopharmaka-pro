import fs from 'fs';
import path from 'path';

type StahlDrug = {
  id: string;
  name: string;
  klasse: string;
  excerpt: string;
};

type StahlChunk = {
  id: number;
  text: string;
};

type StahlIndex = {
  drugs?: StahlDrug[];
  chunks?: StahlChunk[];
};

function loadIndex(): StahlIndex {
  try {
    const p = path.join(process.cwd(), 'data', 'stahlIndex.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch {}
  return {};
}

function score(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  let s = 0;
  for (const term of terms) {
    if (!term) continue;
    const escaped = term.toLowerCase();
    const hits = lower.split(escaped).length - 1;
    s += hits * Math.max(1, escaped.length);
  }
  return s;
}

export function searchStahl(query: string, maxChars = 6000): string {
  const q = query.trim();
  if (!q) return 'Kein Suchtext angegeben.';

  const index = loadIndex();
  const terms = q
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\- ]/gi, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2)
    .slice(0, 12);

  const candidates: { label: string; text: string; score: number }[] = [];

  for (const d of index.drugs || []) {
    const s = score([d.name, d.klasse, d.excerpt].join(' '), terms);
    if (s > 0) {
      candidates.push({
        label: `DRUG: ${d.name} (${d.klasse})`,
        text: d.excerpt,
        score: s + 100
      });
    }
  }

  for (const c of index.chunks || []) {
    const s = score(c.text, terms);
    if (s > 0) {
      candidates.push({
        label: `STAHL CHUNK ${c.id}`,
        text: c.text,
        score: s
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  if (!candidates.length) {
    return 'Keine passenden Informationen im lokalen Stahl-Index gefunden.';
  }

  let out = '';
  for (const c of candidates.slice(0, 4)) {
    const block = `\n\n### ${c.label}\n${c.text.trim()}`;
    if ((out + block).length > maxChars) break;
    out += block;
  }

  return out.trim();
}
