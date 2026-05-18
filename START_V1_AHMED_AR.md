# Psychopharmaka Pro v1 Ahmed

نسخة نظيفة تعتمد على AI:

- لا توجد أدوية ثابتة قديمة.
- لا يوجد Stahl أو Dreher في الواجهة.
- Medikamenten-Datenbank تعمل بالـ AI.
- Interaktionscheck يعمل بالـ AI.
- AI Tools تعمل بالـ AI.
- تم إزالة سبب شائع لخطأ: The string did not match the expected pattern.

## التشغيل

```bash
cd ~/Downloads/psychopharmaka-pro
npm install
nano .env.local
```

ضع API Key في سطر واحد فقط:

```text
OPENAI_API_KEY=sk-proj-NEWKEY
```

احفظ:
Control + O
Enter
Control + X

ثم:

```bash
npm run dev
```

افتح:

```text
http://localhost:3000
```

## الاستخدام

### Medikamenten-Datenbank
اكتب اسم دواء مثل:
- Sertralin
- Aripiprazol
- Pregabalin
ثم اضغط:
✨ Medikament mit AI suchen

### Interaktionscheck
اكتب:
```text
Citalopram + Tramadol + Ibuprofen
```

### AI Tools
اختر الأداة واكتب النص.

## ملاحظة
النتائج AI-generiert ويجب مراجعة Fachinformation/Leitlinie قبل الاستخدام السريري.
