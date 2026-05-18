const fs = require('fs');
const path = require('path');

const input = path.join(process.cwd(), 'data', 'stahl.txt');
const outIndex = path.join(process.cwd(), 'data', 'stahlIndex.json');
const outDrugs = path.join(process.cwd(), 'data', 'generatedDrugs.ts');

const drugNames = [
  "Acamprosate",
  "Agomelatine",
  "Alprazolam",
  "Amisulpride",
  "Amitriptyline",
  "Amoxapine",
  "Aripiprazole",
  "Armodafinil",
  "Asenapine",
  "Atomoxetine",
  "Baclofen",
  "Benztropine",
  "Brexpiprazole",
  "Bromazepam",
  "Bupropion",
  "Buspirone",
  "Carbamazepine",
  "Chlordiazepoxide",
  "Chlorpromazine",
  "Citalopram",
  "Clomipramine",
  "Clonazepam",
  "Clonidine",
  "Clozapine",
  "Desipramine",
  "Desvenlafaxine",
  "Diazepam",
  "Donepezil",
  "Doxepin",
  "Duloxetine",
  "Escitalopram",
  "Eszopiclone",
  "Fluoxetine",
  "Fluphenazine",
  "Fluvoxamine",
  "Gabapentin",
  "Galantamine",
  "Guanfacine",
  "Haloperidol",
  "Hydroxyzine",
  "Imipramine",
  "Ketamine",
  "Lamotrigine",
  "Lisdexamfetamine",
  "Lithium",
  "Lorazepam",
  "Loxapine",
  "Lurasidone",
  "Maprotiline",
  "Melatonin",
  "Memantine",
  "Methylphenidate",
  "Mirtazapine",
  "Modafinil",
  "Naltrexone",
  "Nortriptyline",
  "Olanzapine",
  "Oxazepam",
  "Oxcarbazepine",
  "Paliperidone",
  "Paroxetine",
  "Phenelzine",
  "Pregabalin",
  "Propranolol",
  "Quetiapine",
  "Reboxetine",
  "Risperidone",
  "Rivastigmine",
  "Selegiline",
  "Sertraline",
  "Trazodone",
  "Tranylcypromine",
  "Trimipramine",
  "Valproate",
  "Valproic acid",
  "Venlafaxine",
  "Vilazodone",
  "Vortioxetine",
  "Ziprasidone",
  "Zolpidem",
  "Zopiclone",
  "Zuclopenthixol",
  "Perphenazine",
  "Prochlorperazine",
  "Promethazine",
  "Pimozide",
  "Sulpiride",
  "Tiapride",
  "Cariprazine",
  "Varenicline",
  "Topiramate"
];

function guessClass(text) {
  const t = text.toLowerCase();
  if (t.includes('ssri') || t.includes('serotonin reuptake')) return 'SSRI / serotonerges Antidepressivum';
  if (t.includes('snri') || t.includes('norepinephrine reuptake')) return 'SNRI / duales Antidepressivum';
  if (t.includes('antipsychotic') || t.includes('dopamine') || t.includes('schizophrenia')) return 'Antipsychotikum';
  if (t.includes('benzodiazepine') || t.includes('gaba')) return 'Benzodiazepin / Anxiolytikum';
  if (t.includes('mood stabilizer') || t.includes('bipolar') || t.includes('mania')) return 'Stimmungsstabilisierer / Phasenprophylaktikum';
  if (t.includes('stimulant') || t.includes('adhd') || t.includes('wake')) return 'Stimulans / Wakefulness-Promoting Agent';
  if (t.includes('hypnotic') || t.includes('sleep')) return 'Hypnotikum / Schlafmittel';
  return 'Aus Stahl extrahiert / nicht automatisch klassifiziert';
}

function excerptAround(text, name) {
  const lower = text.toLowerCase();
  const needle = name.toLowerCase();
  let idx = lower.indexOf('\n' + needle.toLowerCase());
  if (idx === -1) idx = lower.indexOf(needle);
  if (idx === -1) return '';
  const start = Math.max(0, idx - 1200);
  const end = Math.min(text.length, idx + 5000);
  return text.slice(start, end).replace(/\n{3,}/g, '\n\n').trim();
}

function chunksForSearch(text, size = 2500, overlap = 350) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push({ id: chunks.length, text: text.slice(i, i + size) });
  }
  return chunks;
}

function esc(s) {
  return JSON.stringify(String(s || ''));
}

if (!fs.existsSync(input)) {
  console.error('Missing data/stahl.txt. Run: pdftotext sources/stahl.pdf data/stahl.txt');
  process.exit(1);
}

const text = fs.readFileSync(input, 'utf8');
const found = [];

for (const name of drugNames) {
  const excerpt = excerptAround(text, name);
  if (!excerpt) continue;
  found.push({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name,
    klasse: guessClass(excerpt),
    excerpt
  });
}

const index = {
  createdAt: new Date().toISOString(),
  source: 'sources/stahl.pdf -> data/stahl.txt',
  drugs: found,
  chunks: chunksForSearch(text)
};

fs.writeFileSync(outIndex, JSON.stringify(index, null, 2));

const drugsTs = `import { Drug } from '@/types/drug';

export const generatedDrugs: Drug[] = [
${found.map(d => `  {
    id: ${esc(d.id)},
    name: ${esc(d.name)},
    klasse: ${esc(d.klasse)},
    indikationen: ['Aus Stahl-Kontext extrahiert'],
    mechanismus: ${esc(d.excerpt.slice(0, 1200))},
    dosierung: 'Siehe Stahl-Kontext / Fachinformation. Automatisch extrahierte Daten ärztlich prüfen.',
    nebenwirkungen: ['Siehe Stahl-Kontext'],
    gefaehrlicheNebenwirkungen: ['Siehe Stahl-Kontext; QT, Sedierung, metabolische und serotonerge Risiken individuell prüfen.'],
    gewicht: 'Siehe Stahl-Kontext',
    sedierung: 'Siehe Stahl-Kontext',
    interaktionen: ['Siehe Stahl-Kontext; CYP, QT, Sedierung, Serotoninsyndrom und Polypharmazie prüfen.'],
    monitoring: ['Klinische Wirksamkeit', 'Nebenwirkungen', 'Interaktionen', 'Risikofaktoren'],
    schwangerschaft: 'Fachinformation / Leitlinie prüfen.',
    geriatrie: 'Start low, go slow; Stürze, Kognition, QT und Polypharmazie beachten.',
    klinischePearls: ['Automatisch aus Stahl-Textindex erzeugt; Details über AI Tools/Stahl-Kontext prüfen.'],
    quellen: ['Stahl PDF local extraction']
  }`).join(',\n')}
];
`;

fs.writeFileSync(outDrugs, drugsTs);
console.log(`✅ Stahl index created: ${found.length} drug entries, ${index.chunks.length} text chunks`);
console.log('✅ Wrote data/stahlIndex.json');
console.log('✅ Wrote data/generatedDrugs.ts');
