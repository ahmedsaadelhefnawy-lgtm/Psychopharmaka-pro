import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = (process.env.OPENAI_API_KEY || '').replace(/\s/g, '');

    const body = await req.json();
    const medications = String(body.medications || body.text || '').trim();
    const patientContext = String(body.patientContext || '').trim();

    if (!medications) {
      return NextResponse.json({ error: 'Keine Medikamente eingegeben' }, { status: 400 });
    }

    const prompt = `
Analysiere diese Arzneimittelinteraktionen auf Deutsch:

Medikation:
${medications}

Patientenkontext:
${patientContext || 'Nicht angegeben'}

Antworte exakt mit diesen Überschriften:
Risikostufe:
Hauptinteraktionen:
Mechanismus:
Klinische Risiken:
Monitoring:
Empfehlungen:
Red Flags:
Hinweis:
`;

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Du bist ein deutschsprachiger klinischer Psychopharmakologie-Assistent für Interaktionschecks.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    const data = await r.json();

    if (!r.ok) {
      return NextResponse.json({ error: data.error?.message || 'OpenAI Fehler' }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content || '';

    const getSection = (title: string) => {
      const regex = new RegExp(`${title}:([\\s\\S]*?)(?=Risikostufe:|Hauptinteraktionen:|Mechanismus:|Klinische Risiken:|Monitoring:|Empfehlungen:|Red Flags:|Hinweis:|$)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    return NextResponse.json({
      interaction: {
        summary: getSection('Hauptinteraktionen') || text,
        riskLevel: getSection('Risikostufe'),
        majorRisks: [getSection('Klinische Risiken')].filter(Boolean),
        mechanisms: [getSection('Mechanismus')].filter(Boolean),
        clinicalConsequences: [getSection('Klinische Risiken')].filter(Boolean),
        monitoring: [getSection('Monitoring')].filter(Boolean),
        recommendations: [getSection('Empfehlungen')].filter(Boolean),
        redFlags: [getSection('Red Flags')].filter(Boolean),
        saferAlternatives: [],
        arztHinweis: getSection('Hinweis') || 'Fachinformation/Leitlinie prüfen.'
      }
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
