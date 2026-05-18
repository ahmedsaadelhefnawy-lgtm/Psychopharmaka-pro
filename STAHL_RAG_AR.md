# Psychopharmaka Pro v12 – Stahl + AI Hybrid

هذه النسخة لا تعتمد على AI فقط. هي تعمل بنظام Hybrid:

1. كتاب Stahl PDF داخل `sources/stahl.pdf`
2. تحويله إلى نص `data/stahl.txt`
3. بناء index للأدوية والبحث `data/stahlIndex.json`
4. توليد قاعدة أدوية `data/generatedDrugs.ts`
5. AI Tools تستخدم Stahl context قبل الإجابة

## التشغيل بعد وضع stahl.pdf

```bash
cd ~/Downloads/psychopharmaka-pro-5
mkdir -p sources data
pdftotext sources/stahl.pdf data/stahl.txt
npm run build:stahl-index
npm run dev
```

أو لو تريد كل شيء مرة واحدة:

```bash
npm run stahl:prepare
npm run dev
```

## النتيجة

- Medikamenten-Datenbank ستقرأ من `generatedDrugs.ts`
- AI Tools ستبحث في `stahlIndex.json`
- أي سؤال عن دواء أو جرعة أو interaction سيُرسل معه سياق من Stahl إلى الذكاء الاصطناعي

## مهم طبيًا

- الاستخراج تلقائي وغير معتمد كمرجع نهائي.
- راجع Stahl/Fachinformation/Leitlinien قبل القرار الطبي.
- لا تضع API key في صور أو GitHub.
