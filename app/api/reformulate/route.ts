import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = (process.env.OPENAI_API_KEY || '').replace(/\s/g, '');

    const body = await req.json();
    const text = String(body.text || '').trim();
    const tool = String(body.tool || body.mode || 'reformulierung').trim();

    if (!text) {
      return NextResponse.json({ error: 'Kein Text eingegeben' }, { status: 400 });
    }

    const prompts: Record<string, string> = {
      arztbrief: 'Formuliere einen professionellen deutschen psychiatrischen Arztbrief.',
      reformulierung: 'Verbessere den medizinischen deutschen Text sachlich und professionell.',
      befund: 'Erstelle einen psychopathologischen Befund auf Deutsch.',
      differential: 'Erstelle Differentialdiagnosen, Red Flags und nächste diagnostische Fragen.',
      icd: 'Gib mögliche ICD-10/ICD-11 Vorschläge mit Begründung.',
      patienteninfo: 'Erkläre den Text patientenfreundlich auf Deutsch.',
      soap: 'Formuliere eine SOAP-Notiz.',
      medikation: 'Gib vorsichtige medikamentöse Überlegungen, Risiken und Monitoring.'
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: prompts[tool] || prompts.reformulierung },
          { role: 'user', content: text }
        ],
        temperature: 0.2
      })
    });

    const data = await r.json();

    if (!r.ok) {
      return NextResponse.json({ error: data.error?.message || 'OpenAI Fehler' }, { status: 500 });
    }

    return NextResponse.json({
      result: data.choices?.[0]?.message?.content || ''
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
