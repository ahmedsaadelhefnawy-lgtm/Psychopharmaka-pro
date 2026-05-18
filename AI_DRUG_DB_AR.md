# Psychopharmaka Pro v13 – AI Drug Database

هذه النسخة تلغي الاعتماد على Stahl extraction كمصدر للـ drug cards.

بدل ذلك:
- تكتب اسم الدواء
- تضغط AI Medikamentensuche
- التطبيق يولد Medikamentenkarte بنفس العناوين الموجودة في التطبيق

العناوين:
- Indikationen
- Wirkmechanismus
- Dosierung
- Häufige Nebenwirkungen
- Gefährliche Nebenwirkungen / Warnhinweise
- Gewicht
- Sedierung
- Interaktionen
- Monitoring
- Schwangerschaft / Stillzeit
- Geriatrie
- Klinische Pearls
- Quellenbasis

## التشغيل

```bash
cd ~/Downloads/psychopharmaka-pro-7
npm install
nano .env.local
```

ضع:

```text
OPENAI_API_KEY=sk-proj-NEWKEY
```

ثم:

```bash
npm run dev
```

## الاستخدام

افتح:
```text
http://localhost:3000
```

ثم:
Medikamenten-Datenbank → AI Medikamentensuche

مثال:
- Sertralin
- Aripiprazol
- Pregabalin
- Mirtazapin
- Venlafaxin

## ملاحظة طبية

الكروت مولدة بالذكاء الاصطناعي وتحتاج مراجعة Fachinformation/Leitlinie قبل الاستخدام السريري.
