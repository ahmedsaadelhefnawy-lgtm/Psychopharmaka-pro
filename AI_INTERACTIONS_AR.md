# Psychopharmaka Pro v14 – AI Interaktionscheck

هذه النسخة تجعل Interaktionscheck يعمل بالذكاء الاصطناعي.

## الاستخدام

داخل التطبيق:
Interaktionscheck → اكتب الأدوية مثل:

```text
Citalopram + Tramadol + Ibuprofen
```

ويمكن إضافة Patientenkontext:

```text
72 Jahre, CKD, QTc verlängert, Polypharmazie
```

سيظهر:
- Risiko-Level
- Haupt-Risiken
- Mechanismen
- Klinische Konsequenzen
- Monitoring
- Empfehlungen
- Red Flags
- Safer alternatives
- Ärztlicher Hinweis

## التشغيل

```bash
cd ~/Downloads/psychopharmaka-pro
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

## ملاحظة

AI Interaktionscheck مساعد فقط، ولا يغني عن Fachinformation / Leitlinien / EKG / Labor / Apothekercheck.
