import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = (process.env.OPENAI_API_KEY || '').replace(/\s/g, '');

    const body = await req.json();
    const drugName = String(body.drugName || body.name || '').trim();

    if (!drugName) {
      return NextResponse.json({ error: 'Kein Medikament angegeben' }, { status: 400 });
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Erstelle eine kurze Medikamentenkarte für ${drugName} auf Deutsch.
Antworte NUR als JSON:
{
"name":"${drugName}",
"klasse":"",
"indikationen":[],
"mechanismus":"",
"dosierung":"",
"nebenwirkungen":[],
"gefaehrlicheNebenwirkungen":[],
"gewicht":"",
"sedierung":"",
"interaktionen":[],
"monitoring":[],
"schwangerschaft":"",
"geriatrie":"",
"klinischePearls":[],
"quellen":["AI-generiert; Fachinformation/Leitlinie prüfen"]
}`
          }
        ],
        temperature: 0.2
      })
    });

    const data = await r.json();

    if (!r.ok) {
      return NextResponse.json({ error: data.error?.message || 'OpenAI Fehler' }, { status: 500 });
    }

    let text = data.choices[0].message.content || '{}';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const drug = JSON.parse(text);

    return NextResponse.json({ drug });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
