'use client';

import { useMemo, useState } from 'react';
import { drugs as curatedDrugs } from '@/data/drugs';
import { generatedDrugs } from '@/data/generatedDrugs';
import { analyzeAnamnese } from '@/lib/anamnese';
import { checkInteraction } from '@/lib/interactions';
import { Drug } from '@/types/drug';
import { conditions, ConditionRecommendation } from '@/data/conditions';

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
  dosierung: 'Fachinformation/Leitlinie prüfen.',
  nebenwirkungen: [],
  gefaehrlicheNebenwirkungen: [],
  gewicht: '—',
  sedierung: '—',
  interaktionen: [],
  monitoring: [],
  schwangerschaft: 'Fachinformation/Leitlinie prüfen.',
  geriatrie: 'Start low, go slow; Polypharmazie prüfen.',
  klinischePearls: [],
  quellen: ['AI-generiert; Fachinformation/Leitlinie prüfen']
};


function DrugCard({ drug }: { drug: Drug }) {
  return <div className="card">
    <h2>{drug.name}</h2>
    <p className="muted">{drug.klasse}</p>
    <List title="Indikationen" items={drug.indikationen} />
    <div className="section"><h3>Wirkmechanismus</h3><p>{drug.mechanismus}</p></div>
    <div className="section"><h3>Dosierung</h3><p>{drug.dosierung}</p></div>
    <List title="Häufige Nebenwirkungen" items={drug.nebenwirkungen} />
    <List title="Gefährliche Nebenwirkungen / Warnhinweise" items={drug.gefaehrlicheNebenwirkungen} />
    <div className="two section">
      <div><h3>Gewicht</h3><p>{drug.gewicht}</p></div>
      <div><h3>Sedierung</h3><p>{drug.sedierung}</p></div>
    </div>
    <List title="Interaktionen" items={drug.interaktionen} />
    <List title="Monitoring" items={drug.monitoring} />
    <div className="two section">
      <div><h3>Schwangerschaft / Stillzeit</h3><p>{drug.schwangerschaft}</p></div>
      <div><h3>Geriatrie</h3><p>{drug.geriatrie}</p></div>
    </div>
    <List title="Klinische Pearls" items={drug.klinischePearls} />
    <List title="Quellenbasis" items={drug.quellen} />
  </div>
}


function ConditionCard({ condition }: { condition: ConditionRecommendation }) {
  return <div className="card">
    <h2>{condition.name}</h2>
    <List title="Leitsymptome / klinische Hinweise" items={condition.leitsymptome} />
    <List title="Diagnostik / Abklärung" items={condition.diagnostik} />
    <List title="Pharmakotherapie / Empfehlungen" items={condition.pharmakotherapie} />
    <List title="Was eher vermeiden?" items={condition.vermeiden} />
    <List title="Monitoring" items={condition.monitoring} />
    <List title="Klinische Notizen" items={condition.notizen} />
    <List title="Quellenbasis" items={condition.quellen} />
  </div>
}


function ArztbriefAI() {
  const [text, setText] = useState('Patient berichtet über Schlafstörungen, innere Unruhe und Grübeln. Keine akute Suizidalität.');
  const [mode, setMode] = useState('arztbrief');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function runAI() {
    const input = text.trim();
    if (!input) {
      setError('Bitte zuerst Text eingeben.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/reformulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, mode })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Fehler bei der KI-Anfrage.');
      }

      setResult(data.result || '');
    } catch (e: any) {
      setError(e?.message || 'Unbekannter Fehler. Bitte Terminal prüfen.');
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  }

  return <section className="grid">
    <div className="card">
      <h2>AI Arztbrief / Reformulierung</h2>
      <p className="muted">Text eingeben, Modus wählen und medizinisch auf Deutsch verbessern lassen.</p>

      <label className="muted">Modus</label>
      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="arztbrief">Arztbrief-Formulierung</option>
        <option value="reformulierung">Medizinisch reformulieren</option>
        <option value="befund">Psychopathologischer Befund</option>
        <option value="kurz">Kurz zusammenfassen</option>
        <option value="patientenfreundlich">Patientenfreundlich erklären</option>
      </select>

      <br/><br/>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Hier Stichpunkte, Befund oder Arztbrieftext eingeben..."
      />

      <button className="button" onClick={runAI} disabled={loading}>
        {loading ? 'KI arbeitet...' : '✨ Text verbessern'}
      </button>

      {error && <div className="section notice">{error}</div>}
    </div>

    <div className="card">
      <h2>Ergebnis</h2>
      {result ? <>
        <textarea value={result} onChange={e => setResult(e.target.value)} />
        <button className="button" onClick={copyResult}>In Zwischenablage kopieren</button>
      </> : <p className="muted">Hier erscheint die überarbeitete Fassung.</p>}

      <div className="section">
        <h3>Hinweis</h3>
        <p className="muted">Die KI darf keine klinischen Fakten erfinden. Ergebnisse vor Nutzung im Arztbrief ärztlich prüfen.</p>
      </div>
    </div>
  </section>;
}



const aiToolOptions = [
  ['arztbrief', 'Arztbrief-Formulierung'],
  ['reformulierung', 'Medizinisch reformulieren'],
  ['befund', 'Psychopathologischer Befund'],
  ['differential', 'Differentialdiagnosen'],
  ['icd', 'ICD-10/ICD-11 Vorschläge'],
  ['patienteninfo', 'Patientenaufklärung'],
  ['soap', 'SOAP-Notiz'],
  ['medikation', 'Medikamentöse Überlegungen']
];

function AITools() {
  const [text, setText] = useState('Patient berichtet über Schlafstörungen, innere Unruhe und Grübeln. Keine akute Suizidalität.');
  const [tool, setTool] = useState('arztbrief');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function runAI() {
    const input = text.trim();
    if (!input) {
      setError('Bitte zuerst Text eingeben.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, tool })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Fehler bei der KI-Anfrage.');
      }

      setResult(data.result || '');
    } catch (e: any) {
      setError(e?.message || 'Unbekannter Fehler. Bitte Terminal prüfen.');
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  }

  return <section className="grid">
    <div className="card">
      <h2>AI Tools</h2>
      <p className="muted">Arztbrief, Befund, Differentialdiagnosen, ICD, SOAP, Patienteninfo und Medikationsüberlegungen.</p>

      <label className="muted">Tool</label>
      <select value={tool} onChange={e => setTool(e.target.value)}>
        {aiToolOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>

      <br/><br/>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Hier Anamnese, Stichpunkte, Befund oder Arztbrieftext eingeben..."
      />

      <button className="button" onClick={runAI} disabled={loading}>
        {loading ? 'KI arbeitet...' : '✨ AI Tool ausführen'}
      </button>

      {error && <div className="section notice">{error}</div>}
    </div>

    <div className="card">
      <h2>Ergebnis</h2>
      {result ? <>
        <textarea value={result} onChange={e => setResult(e.target.value)} />
        <button className="button" onClick={copyResult}>In Zwischenablage kopieren</button>
      </> : <p className="muted">Hier erscheint das Ergebnis.</p>}

      <div className="section">
        <h3>Hinweis</h3>
        <p className="muted">KI-Ergebnisse dienen als Assistenz. Keine automatische Diagnose oder Therapieentscheidung. Ärztlich prüfen.</p>
      </div>
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
      <div className="whitespace-pre-wrap leading-7 text-sm">
  {String(data.summary || '')
    .replace(/###/g, '')
.split(/\d+\.\s/)
    .filter(Boolean)
    .map((item, index) => (
      <div key={index} className="mb-4">
        {item}
      </div>
    ))}
</div>
      <span className="pill">Risiko: {data.riskLevel}</span>
    </div>
    {pillList('Haupt-Risiken', data.majorRisks)}
    {pillList('Mechanismen', data.mechanisms)}
    {pillList('Klinische Konsequenzen', data.clinicalConsequences)}
    {pillList('Monitoring', data.monitoring)}
    {pillList('Empfehlungen', data.recommendations)}
    {pillList('Red Flags', data.redFlags)}
    {pillList('Sicherere Alternativen / Optionen', data.saferAlternatives)}
    <div className="section">
      <h3>Ärztlicher Hinweis</h3>
      <p>{data.arztHinweis || 'Fachinformation, Interaktionsdatenbank und klinische Situation prüfen.'}</p>
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
    return Array.from(map.values()).sort((a,b)=>a.name.localeCompare(b.name));
  }, []);
  const [selected, setSelected] = useState<Drug>(emptyDrug);
  const [aiDrugName, setAiDrugName] = useState('');
  const [aiDrugLoading, setAiDrugLoading] = useState(false);
  const [aiDrugError, setAiDrugError] = useState('');

  async function searchDrugWithAI() {
    const name = aiDrugName.trim() || query.trim();
    if (!name) {
      setAiDrugError('Bitte Medikamentennamen eingeben.');
      return;
    }

    setAiDrugLoading(true);
    setAiDrugError('');

    try {
      const res = await fetch('/api/drug-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drugName: name })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'AI Medikamentensuche fehlgeschlagen.');
      }

      const d = data.drug;

      const aiDrug: Drug = {
        id: String(d.id || d.name || name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: String(d.name || name),
        klasse: String(d.klasse || 'AI-generierte Medikamentenkarte'),
        indikationen: Array.isArray(d.indikationen) ? d.indikationen : [],
        mechanismus: String(d.mechanismus || ''),
        dosierung: String(d.dosierung || 'Fachinformation/Leitlinie prüfen.'),
        nebenwirkungen: Array.isArray(d.nebenwirkungen) ? d.nebenwirkungen : [],
        gefaehrlicheNebenwirkungen: Array.isArray(d.gefaehrlicheNebenwirkungen) ? d.gefaehrlicheNebenwirkungen : [],
        gewicht: String(d.gewicht || 'Fachinformation/Leitlinie prüfen.'),
        sedierung: String(d.sedierung || 'Fachinformation/Leitlinie prüfen.'),
        interaktionen: Array.isArray(d.interaktionen) ? d.interaktionen : [],
        monitoring: Array.isArray(d.monitoring) ? d.monitoring : [],
        schwangerschaft: String(d.schwangerschaft || 'Fachinformation/Leitlinie prüfen.'),
        geriatrie: String(d.geriatrie || 'Start low, go slow; Polypharmazie prüfen.'),
        klinischePearls: Array.isArray(d.klinischePearls) ? d.klinischePearls : [],
        quellen: Array.isArray(d.quellen) ? d.quellen : ['AI-generiert; Fachinformation/Leitlinie prüfen']
      };

      setSelected(aiDrug);
    } catch (e: any) {
      setAiDrugError(e?.message || 'Unbekannter Fehler. Bitte Terminal prüfen.');
    } finally {
      setAiDrugLoading(false);
    }
  }
  const [caseText, setCaseText] = useState('Patient 32 Jahre, seit 6 Wochen antriebslos, Schlafstörung, Grübeln, Appetitverlust. Keine Psychose bekannt.');
  const [a, setA] = useState('Citalopram');
  const [b, setB] = useState('Tramadol');
  const [aiMeds, setAiMeds] = useState('Citalopram + Tramadol');
  const [aiPatientContext, setAiPatientContext] = useState('');
  const [aiInteraction, setAiInteraction] = useState<any>(null);
  const [aiInteractionLoading, setAiInteractionLoading] = useState(false);
  const [aiInteractionError, setAiInteractionError] = useState('');

  async function runAIInteractionCheck() {
    const medications = aiMeds.trim();
    if (!medications) {
      setAiInteractionError('Bitte Medikamente eingeben.');
      return;
    }

    setAiInteractionLoading(true);
    setAiInteractionError('');
    setAiInteraction(null);

    try {
      const res = await fetch('/api/interaction-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications, patientContext: aiPatientContext })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'AI Interaktionscheck fehlgeschlagen.');
      }

      setAiInteraction(data.interaction);
    } catch (e: any) {
      setAiInteractionError(e?.message || 'Unbekannter Fehler. Bitte Terminal prüfen.');
    } finally {
      setAiInteractionLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allDrugs.filter(d => [d.name, d.klasse, ...d.indikationen, ...d.nebenwirkungen].join(' ').toLowerCase().includes(q));
  }, [query, allDrugs]);

  const filteredConditions = useMemo(() => {
    const q = conditionQuery.toLowerCase();
    return conditions.filter(c => [c.name, ...c.leitsymptome, ...c.pharmakotherapie, ...c.vermeiden].join(' ').toLowerCase().includes(q));
  }, [conditionQuery]);

  const result = useMemo(() => analyzeAnamnese(caseText), [caseText]);
  const interaction = useMemo(() => checkInteraction(a, b), [a, b]);

  return <main className="app">
    <section className="hero">
      <h1>Psychopharmaka Pro <span style={{fontSize:'18px', color:'#c7d2fe'}}>v1 Ahmed</span></h1>
      <p>Interaktive deutschsprachige App für Psychopharmakotherapie: Anamnese-Analyse, Medikamentenkarten, Interaktionscheck und Lernmodus. Klinische Entscheidungsunterstützung – kein Ersatz für ärztliche Verantwortung.</p>
    </section>

    <nav className="tabs">
      {[
        ['anamnese','Intelligente Anamnese'],
        ['erkrankungen','Erkrankungen & Empfehlungen'],
        ['medikamente','Medikamenten-Datenbank'],
        ['interaktionen','Interaktionscheck'],
        ['aiTools','AI Tools'],
        ['lernen','Lernmodus']
      ].map(([id,label]) => <button key={id} onClick={() => setTab(id as Tab)} className={`tab ${tab===id ? 'active' : ''}`}>{label}</button>)}
    </nav>

    {tab === 'anamnese' && <section className="grid">
      <div className="card">
        <h2>Anamnese eingeben</h2>
        <textarea value={caseText} onChange={e => setCaseText(e.target.value)} />
        <p className="muted">Tipp: Symptome, Verlauf, Alter, Substanzen, Suizidalität, Schwangerschaft, Medikamente erwähnen.</p>
      </div>
      <div className="card">
        <h2>Analyse</h2>
        <List title="Verdachtsdiagnosen" items={result.verdacht} />
        <List title="Differentialdiagnosen" items={result.differentialdiagnosen} />
        <List title="Alarmzeichen" items={result.alarmzeichen} />
        <List title="Nächste Fragen" items={result.naechsteFragen} />
        <List title="Basisdiagnostik" items={result.basisdiagnostik} />
        <List title="Medikamentöse Optionen" items={result.medikamentoeseOptionen} />
        <List title="Hinweise" items={result.hinweise} />
      </div>
    </section>}


    {tab === 'erkrankungen' && <section className="grid">
      <div className="card">
        <h2>Erkrankung suchen</h2>
        <input className="input" value={conditionQuery} onChange={e => setConditionQuery(e.target.value)} placeholder="z.B. Depression, Psychose, Bipolar, ADHS, Schlafstörung..." />
        <div className="drug-list section">
          {filteredConditions.map(c => <div className="drug-row" key={c.id} onClick={() => setSelectedCondition(c)}><strong>{c.name}</strong><br/><span className="muted">{c.pharmakotherapie.slice(0,2).join(' · ')}</span></div>)}
        </div>
      </div>
      <ConditionCard condition={selectedCondition} />
    </section>}

    {tab === 'medikamente' && <section className="grid">
      <div className="card">
        <h2>Suche</h2>
        <input className="input" value={query} onChange={e => setQuery(e.target.value)} placeholder="z.B. Citalopram, Sedierung, SSRI, Bipolar..." />

        <div className="section">
          <h3>AI Medikamentensuche</h3>
          <p className="muted">Medikament eingeben und automatisch eine strukturierte Karte mit denselben Headlines erzeugen.</p>
          <input className="input" value={aiDrugName} onChange={e => setAiDrugName(e.target.value)} placeholder="z.B. Sertralin, Aripiprazol, Pregabalin..." />
          <button className="button" onClick={searchDrugWithAI} disabled={aiDrugLoading}>
            {aiDrugLoading ? 'AI sucht...' : '✨ Medikament mit AI suchen'}
          </button>
          {aiDrugError && <div className="section notice">{aiDrugError}</div>}
        </div>

        {filtered.length > 0 && <div className="drug-list section">
          {filtered.map(d => <div className="drug-row" key={d.id} onClick={() => setSelected(d)}><strong>{d.name}</strong><br/><span className="muted">{d.klasse}</span></div>)}
        </div>}
      </div>
      <DrugCard drug={selected} />
    </section>}

    {tab === 'interaktionen' && <section className="grid">
      <div className="card">
        <h2>AI Interaktionscheck</h2>
        <p className="muted">Medikamente eingeben, z.B. „Citalopram + Tramadol + Ibuprofen“. Optional Patientenkontext ergänzen.</p>

        <label className="muted">Medikation</label>
        <textarea value={aiMeds} onChange={e => setAiMeds(e.target.value)} placeholder="z.B. Sertralin + Tramadol + Ibuprofen" />

        <label className="muted">Patientenkontext optional</label>
        <textarea value={aiPatientContext} onChange={e => setAiPatientContext(e.target.value)} placeholder="z.B. 72 Jahre, Niereninsuffizienz, QTc verlängert, Polypharmazie..." />

        <button className="button" onClick={runAIInteractionCheck} disabled={aiInteractionLoading}>
          {aiInteractionLoading ? 'AI prüft...' : '✨ Interaktionen mit AI prüfen'}
        </button>

        {aiInteractionError && <div className="section notice">{aiInteractionError}</div>}

        <div className="section">
          <h3>Hinweis</h3>
          <p className="muted">AI-Check ersetzt keine Fachinformation, klinische Prüfung, EKG/Labor oder pharmazeutische Interaktionsdatenbank.</p>
        </div>
      </div>

      {aiInteraction ? <AIInteractionResult data={aiInteraction} /> : <div className="card">
        <h2>Ergebnis</h2>
        <p className="muted">Hier erscheint die AI-gesteuerte Interaktionsanalyse.</p>
      </div>}
    </section>}

    {tab === 'aiTools' && <AITools />}

    {tab === 'lernen' && <section className="grid">
      <div className="card">
        <h2>Lernkarten</h2>
        <p><strong>SSRI</strong>: Wirklatenz typischerweise Wochen; initiale Nebenwirkungen aktiv ansprechen.</p>
        <p><strong>Benzodiazepine</strong>: schnelle Anxiolyse, aber Abhängigkeit und Atemdepression in Kombination beachten.</p>
        <p><strong>Atypische Antipsychotika</strong>: metabolisches Monitoring ist Pflicht.</p>
      </div>
      <div className="card">
        <h2>Mini-Fall</h2>
        <p>Patient mit bipolarer Störung, Schlafreduktion, Rededrang und Geldausgaben: Antidepressivum-Monotherapie vermeiden; Manie/Hypomanie behandeln.</p>
      </div>
    </section>}
  </main>;
}
