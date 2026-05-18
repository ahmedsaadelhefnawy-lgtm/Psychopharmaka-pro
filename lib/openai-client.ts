const OPENAI_API_KEY = 'sk-proj-FJP-JyIz0Qb8wCgTPU2fJtftuJr0qABfJLmd0WbToNoQeZvphESKl3iYo9ZP_T3BlbkFJP-JyIz0Qb8wCgTPU2fJtftuJr0qABfJLmd0WbToNoQe';

export async function fetchDrugInfo(drugName: string) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Erstelle eine kurze Medikamentenkarte fuer ' + drugName + ' auf Deutsch. Antworte NUR als JSON: {"name":"' + drugName + '","klasse":"","indikationen":[],"mechanismus":"","dosierung":"","nebenwirkungen":[],"gefaehrlicheNebenwirkungen":[],"gewicht":"","sedierung":"","interaktionen":[],"monitoring":[],"schwangerschaft":"","geriatrie":"","klinischePearls":[],"quellen":["AI-generiert"]}' }],
      temperature: 0.2
    })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || 'OpenAI Fehler');
  let text = data.choices[0].message.content || '{}';
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text);
}

export async function fetchInteractionCheck(medications: string, patientContext: string) {
  const prompt = 'Analysiere diese Arzneimittelinteraktionen auf Deutsch.\n\nMedikation:\n' + medications + '\n\nPatientenkontext:\n' + (patientContext || 'Nicht angegeben') + '\n\nAntworte exakt mit diesen Abschnitten:\nRisikostufe:\nHauptinteraktionen:\nMechanismus:\nKlinische Risiken:\nMonitoring:\nEmpfehlungen:\nRed Flags:\nHinweis:';
  
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Du bist ein deutschsprachiger klinischer Psychopharmakologie-Assistent.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    })
  });
  
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || 'OpenAI Fehler');
  const text = data.choices?.[0]?.message?.content || '';

  function getSection(title: string) {
    const idx = text.indexOf(title + ':');
    if (idx === -1) return '';
    const start = idx + title.length + 1;
    const sections = ['Risikostufe:', 'Hauptinteraktionen:', 'Mechanismus:', 'Klinische Risiken:', 'Monitoring:', 'Empfehlungen:', 'Red Flags:', 'Hinweis:'];
    let end = text.length;
    for (const s of sections) {
      const i = text.indexOf(s, start);
      if (i !== -1 && i < end) end = i;
    }
    return text.slice(start, end).trim();
  }

  return {
    summary: getSection('Hauptinteraktionen') || text,
    riskLevel: getSection('Risikostufe'),
    majorRisks: [getSection('Klinische Risiken')].filter(Boolean),
    mechanisms: [getSection('Mechanismus')].filter(Boolean),
    monitoring: [getSection('Monitoring')].filter(Boolean),
    recommendations: [getSection('Empfehlungen')].filter(Boolean),
    redFlags: [getSection('Red Flags')].filter(Boolean),
    saferAlternatives: [],
    arztHinweis: getSection('Hinweis') || 'Fachinformation pruefen.'
  };
}