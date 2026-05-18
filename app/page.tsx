'use client';

import { useMemo, useState } from 'react';
import { drugs as curatedDrugs } from '@/data/drugs';
import { generatedDrugs } from '@/data/generatedDrugs';
import { analyzeAnamnese } from '@/lib/anamnese';
import { checkInteraction } from '@/lib/interactions';
import { Drug } from '@/types/drug';
import { conditions, ConditionRecommendation } from '@/data/conditions';
import { fetchDrugInfo, fetchInteractionCheck } from '@/lib/openai-client';

type Tab = 'anamnese' | 'erkrankungen' | 'medikamente' | 'interaktionen' | 'aiTools' | 'lernen';

function List({ title, items }: { title: string; items: string[] }) {
  return <div className="section"><h3>{title}</h3>{items.map((x, i) => <span className="pill" key={i}>{x}</span>)}</div>;
}

const emptyDrug: Drug = {
  id: 'ai-placeholder',
  name: 'AI Medikamentensuche',
  klasse: 'Bitte Medikament eingeben',
  indikationen: [],
  mechanismus: 'Hier erscheinen die AI-generierten Informationen.',
  dosierung: 'Fachinformation/Leitlinie pruefen.',
  nebenwirkungen: [],
  gefaehrlicheNebenwirkungen: [],
  gewicht: '—',
  sedierung: '—',
  interaktionen: [],
  monitoring: [],
  schwangerschaft: 'Fachinformation/Leitlinie pruefen.',
  geriatrie: 'Start low, go slow.',
  klinischePearls: [],
  quellen: ['AI-generiert']
};

function DrugCard({ drug }: { drug: Drug }) {
  return <div className="card">
    <h2>{drug.name}</h2>
    <p className="muted">{drug.klasse}</p>
    <List title="Indikationen" items={drug.indikationen} />
    <div className="section"><h3>Wirkmechanismus</h3><p>{drug.mechanismus}</p></div>
    <div className="section"><h3>Dosierung</h3><p>{drug.dosierung}</p></div>
    <List title="Haeufige Nebenwirkungen" items={drug.nebenwirkungen} />
    <List title="Gefaehrliche Nebenwirkungen" items={drug.gefaehrlicheNebenwirkungen} />
    <div className="two section">
      <div><h3>Gewicht</h3><p>{drug.gewicht}</p></div>
      <div><h3>Sedierung</h3><p>{drug.sedierung}</p></div>
    </div>
    <List title="Interaktionen" items={drug.interaktionen} />
    <List title="Monitoring" items={drug.monitoring} />
    <div className="two section">
      <div><h3>Schwangerschaft</h3><p>{drug.schwangerschaft}</p></div>
      <div><h3>Geriatrie</h3><p>{drug.geriatrie}</p></div>
    </div>
    <List title="Klinische Pearls" items={drug.klinischePearls} />
    <List title="Quellen" items={drug.quellen} />
  </div>;
}

function ConditionCard({ condition }: { condition: ConditionRecommendation }) {
  return <div className="card">
    <h2>{condition.name}</h2>
    <List title="Leitsymptome" items={condition.leitsymptome} />
    <List title="Diagnostik" items={condition.diagnostik} />
    <List title="Pharmakotherapie" items={condition.pharmakotherapie} />
    <List title="Vermeiden" items={condition.vermeiden} />
    <List title="Monitoring" items={condition.monitoring} />
    <List title="Notizen" items={condition.notizen} />
    <List title="Quellen" items={condition.quellen} />
  </div>;
}

function AITools() {
  const [text, setText] = useState('Patient berichtet ueber Schlafstoerungen.');
  const [tool, setTool] = useState('arztbrief');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const aiToolOptions = [
    ['arztbrief', 'Arztbrief-Formulierung'],
    ['reformulierung', 'Medizinisch reformulieren'],
    ['befund', 'Psychopathologischer Befund'],
    ['differential', 'Differentialdiagnosen'],
    ['icd', 'ICD-10/ICD-11 Vorschlaege'],
    ['patienteninfo', 'Patientenaufklaerung'],
    ['soap', 'SOAP-Notiz'],
    ['medikation', 'Medikamentoese Ueberlegungen']
  ];

  async function runAI() {
    const input = text.trim();
    if (!input) { setError('Bitte Text eingeben.'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const apiKey = 'sk-proj-FJP-JyIz0Qb8wCgTPU2fJtftuJr0qABfJLmd0WbToNoQeZvphESKl3iYo9ZP_T3BlbkFJP-JyIz0Qb8wCgTPU2fJtftuJr0qABfJLmd0WbToNoQe';
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Du bist ein deutschsprachiger klinischer Psychiatrie-Assistent.' },
            { role: 'user', content: 'Tool: ' + tool + '\n\nText:\n' + input }
          ],
          temperature: 0.3
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'OpenAI Fehler');
      setResult(data.choices?.[0]?.message?.content || '');
    } catch (e: any) {
      setError(e?.message || 'Fehler.');
    } finally {
      setLoading(false);
    }
  }

  return <section className="grid">
    <div className="card">
      <h2>AI Tools</h2>
      <label className="muted">Tool</label>
      <select value={tool} onChange={e => setTool(e.target.value)}>
        {aiToolOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <br /><br />
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button className="button" onClick={runAI} disabled={loading}>
        {loading ? 'KI arbeitet...' : 'AI Tool ausfuehren'}
      </button>
      {error && <div className="section notice">{error}</div>}
    </div>
    <div className="card">
      <h2>Ergebnis</h2>
      {result ? <>
        <textarea value={result} onChange={e => setResult(e.target.value)} />
        <button className="button" onClick={() => navigator.clipboard.writeText(result)}>Kopieren</button>
      </> : <p className="muted">Hier erscheint das Ergebnis.</p>}
    </div>
  </section>;
}

function AIInteractionResult({ data }: { data: any }) {
  if (!data) return null;
  const pillList = (title: string, items?: string[]) => <div className="section">
    <h3>{title}</h3>
    {(items || []).length ? (items || []).map((x, i) => <span className="pill" key={i}>{x}</span>) : <p className="muted">Keine Angaben.</p>}
  </div>;
  return <div className="card">
    <h2>AI Interaktionsanalyse</h2>
    <div className="section">
      <h3>Zusammenfassung</h3>
      <p>{String(data.summary || '')}</p>
      <span className="pill">Risiko: {data.riskLevel}</span>
    </div>
    {pillList('Haupt-Risiken', data.majorRisks)}
    {pillList('Mechanismen', data.mechanisms)}
    {pillList('Monitoring', data.monitoring)}
    {pillList('Empfehlungen', data.recommendations)}
    {pillList('Red Flags', data.redFlags)}
    <div className="section">
      <h3>Hinweis</h3>
      <p>{data.arztHinweis}</p>
    </div>
  </div>;
}

export default function Page() {
  const [tab, setTab] = useState<Tab>('anamnese');
  const [query, setQuery] = useState('');
  const [conditionQuery, setConditionQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<ConditionRecommendation>(conditions[0]);
  const allDrugs = useMemo(() => {
    const map = new Map<string, Drug>();
    [...generatedDrugs, ...curatedDrugs].forEach(d => map.set(d.id, d));
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  const [selected, setSelected] = useState<Drug>(emptyDrug);
  const [aiDrugName, setAiDrugName] = useState('');
  const [aiDrugLoading, setAiDrugLoading] = useState(false);
  const [aiDrugError, setAiDrugError] = useState('');
  const [caseText, setCaseText] = useState('Patient 32 Jahre, seit 6 Wochen antriebslos.');
  const [a, setA] = useState('Citalopram');
  const [b, setB] = useState('Tramadol');
  const [aiMeds, setAiMeds] = useState('Citalopram + Tramadol');
  const [aiPatientContext, setAiPatientContext] = useState('');
  const [aiInteraction, setAiInteraction] = useState<any>(null);
  const [aiInteractionLoading, setAiInteractionLoading] = useState(false);
  const [aiInteractionError, setAiInteractionError] = useState('');

  async function searchDrugWithAI() {
    const name = aiDrugName.trim() || query.trim();
    if (!name) { setAiDrugError('Bitte Namen eingeben.'); return; }
    setAiDrugLoading(true); setAiDrugError('');
    try {
      const d = await fetchDrugInfo(name);
      const aiDrug: Drug = {
        id: String(d.name || name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: String(d.name || name),
        klasse: String(d.klasse || 'AI-generiert'),
        indikationen: Array.isArray(d.indikationen) ? d.indikationen : [],
        mechanismus: String(d.mechanismus || ''),
        dosierung: String(d.dosierung || ''),
        nebenwirkungen: Array.isArray(d.nebenwirkungen) ? d.nebenwirkungen : [],
        gefaehrlicheNebenwirkungen: Array.isArray(d.gefaehrlicheNebenwirkungen) ? d.gefaehrlicheNebenwirkungen : [],
        gewicht: String(d.gewicht || ''),
        sedierung: String(d.sedierung || ''),
        interaktionen: Array.isArray(d.interaktionen) ? d.interaktionen : [],
        monitoring: Array.isArray(d.monitoring) ? d.monitoring : [],
        schwangerschaft: String(d.schwangerschaft || ''),
        geriatrie: String(d.geriatrie || ''),
        klinischePearls: Array.isArray(d.klinischePearls) ? d.klinischePearls : [],
        quellen: Array.isArray(d.quellen) ? d.quellen : ['AI-generiert']
      };
      setSelected(aiDrug);
    } catch (e: any) {
      setAiDrugError(e?.message || 'Fehler.');
    } finally {
      setAiDrugLoading(false);
    }
  }

  async function runAIInteractionCheck() {
    const medications = aiMeds.trim();
    if (!medications) { setAiInteractionError('Bitte Medikamente eingeben.'); return; }
    setAiInteractionLoading(true); setAiInteractionError(''); setAiInteraction(null);
    try {
      const interaction = await fetchInteractionCheck(medications, aiPatientContext);
      setAiInteraction(interaction);
    } catch (e: any) {
      setAiInteractionError(e?.message || 'Fehler.');
    } finally {
      setAiInteractionLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allDrugs.filter(d => [d.name, d.klasse, ...d.indikationen].join(' ').toLowerCase().includes(q));
  }, [query, allDrugs]);

  const filteredConditions = useMemo(() => {
    const q = conditionQuery.toLowerCase();
    return conditions.filter(c => [c.name, ...c.leitsymptome].join(' ').toLowerCase().includes(q));
  }, [conditionQuery]);

  const result = useMemo(() => analyzeAnamnese(caseText), [caseText]);
  const interaction = useMemo(() => checkInteraction(a, b), [a, b]);

  return <main className="app">
    <section className="hero">
      <h1>Psychopharmaka Pro <span style={{ fontSize: '18px', color: '#c7d2fe' }}>v1 Ahmed</span></h1>
      <p>Interaktive deutschsprachige App fuer Psychopharmakotherapie.</p>
    </section>

    <nav className="tabs">
      {[
        ['anamnese', 'Intelligente Anamnese'],
        ['erkrankungen', 'Erkrankungen'],
        ['medikamente', 'Medikamenten-Datenbank'],
        ['interaktionen', 'Interaktionscheck'],
        ['aiTools', 'AI Tools'],
        ['lernen', 'Lernmodus']
      ].map(([id, label]) => <button key={id} onClick={() => setTab(id as Tab)} className={'tab ' + (tab === id ? 'active' : '')}>{label}</button>)}
    </nav>

    {tab === 'anamnese' && <section className="grid">
      <div className="card">
        <h2>Anamnese eingeben</h2>
        <textarea value={caseText} onChange={e => setCaseText(e.target.value)} />
      </div>
      <div className="card">
        <h2>Analyse</h2>
        <List title="Verdachtsdiagnosen" items={result.verdacht} />
        <List title="Differentialdiagnosen" items={result.differentialdiagnosen} />
        <List title="Alarmzeichen" items={result.alarmzeichen} />
        <List title="Naechste Fragen" items={result.naechsteFragen} />
        <List title="Basisdiagnostik" items={result.basisdiagnostik} />
        <List title="Medikamentoese Optionen" items={result.medikamentoeseOptionen} />
        <List title="Hinweise" items={result.hinweise} />
      </div>
    </section>}

    {tab === 'erkrankungen' && <section className="grid">
      <div className="card">
        <h2>Erkrankung suchen</h2>
        <input className="input" value={conditionQuery} onChange={e => setConditionQuery(e.target.value)} placeholder="z.B. Depression, Bipolar..." />
        <div className="drug-list section">
          {filteredConditions.map(c => <div className="drug-row" key={c.id} onClick={() => setSelectedCondition(c)}><strong>{c.name}</strong></div>)}
        </div>
      </div>
      <ConditionCard condition={selectedCondition} />
    </section>}

    {tab === 'medikamente' && <section className="grid">
      <div className="card">
        <h2>Suche</h2>
        <input className="input" value={query} onChange={e => setQuery(e.target.value)} placeholder="z.B. Citalopram, SSRI..." />
        <div className="section">
          <h3>AI Medikamentensuche</h3>
          <input className="input" value={aiDrugName} onChange={e => setAiDrugName(e.target.value)} placeholder="z.B. Sertralin..." />
          <button className="button" onClick={searchDrugWithAI} disabled={aiDrugLoading}>
            {aiDrugLoading ? 'AI sucht...' : 'Medikament mit AI suchen'}
          </button>
          {aiDrugError && <div className="section notice">{aiDrugError}</div>}
        </div>
        {filtered.length > 0 && <div className="drug-list section">
          {filtered.map(d => <div className="drug-row" key={d.id} onClick={() => setSelected(d)}><strong>{d.name}</strong><br /><span className="muted">{d.klasse}</span></div>)}
        </div>}
      </div>
      <DrugCard drug={selected} />
    </section>}

    {tab === 'interaktionen' && <section className="grid">
      <div className="card">
        <h2>AI Interaktionscheck</h2>
        <label className="muted">Medikation</label>
        <textarea value={aiMeds} onChange={e => setAiMeds(e.target.value)} placeholder="z.B. Sertralin + Tramadol" />
        <label className="muted">Patientenkontext optional</label>
        <textarea value={aiPatientContext} onChange={e => setAiPatientContext(e.target.value)} placeholder="z.B. 72 Jahre, Niereninsuffizienz..." />
        <button className="button" onClick={runAIInteractionCheck} disabled={aiInteractionLoading}>
          {aiInteractionLoading ? 'AI prueft...' : 'Interaktionen mit AI pruefen'}
        </button>
        {aiInteractionError && <div className="section notice">{aiInteractionError}</div>}
        <div className="section">
          <h3>Hinweis</h3>
          <p className="muted">AI-Check ersetzt keine Fachinformation.</p>
        </div>
      </div>
      {aiInteraction ? <AIInteractionResult data={aiInteraction} /> : <div className="card">
        <h2>Ergebnis</h2>
        <p className="muted">Hier erscheint die Interaktionsanalyse.</p>
      </div>}
    </section>}

    {tab === 'aiTools' && <AITools />}

    {tab === 'lernen' && <section className="grid">
      <div className="card">
        <h2>Lernkarten</h2>
        <p><strong>SSRI</strong>: Wirklatenz typischerweise Wochen.</p>
        <p><strong>Benzodiazepine</strong>: Abhaengigkeit beachten.</p>
        <p><strong>Atypische Antipsychotika</strong>: metabolisches Monitoring.</p>
      </div>
    </section>}
  </main>;
}