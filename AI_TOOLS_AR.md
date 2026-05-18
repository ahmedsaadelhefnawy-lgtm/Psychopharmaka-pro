# Psychopharmaka Pro v11 – AI Tools

هذه النسخة تضيف Tab جديد:

AI Tools

وفيه:
- Arztbrief-Formulierung
- Medizinisch reformulieren
- Psychopathologischer Befund
- Differentialdiagnosen
- ICD-10/ICD-11 Vorschläge
- Patientenaufklärung
- SOAP-Notiz
- Medikamentöse Überlegungen

## التشغيل

```bash
cd ~/Downloads/psychopharmaka-pro-5
npm install
nano .env.local
```

ضع:

```text
OPENAI_API_KEY=sk-proj-NEW_KEY
```

ثم:

```bash
npm run dev
```

افتح:

```text
http://localhost:3000
```

## ملاحظات

- لا تشارك API key في الصور أو الشات.
- إذا ظهرت quota exceeded، فعّل Billing أو زوّد الرصيد.
- كل نتائج AI تحتاج مراجعة طبية.
- النسخة المحلية عبر npm run dev هي الأفضل لاستخدام الـ API key بأمان.
