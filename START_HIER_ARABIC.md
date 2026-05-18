# تشغيل نسخة الاستخراج من Stahl

## 1) ضع ملف PDF
انسخ ملف Stahl PDF داخل هذا الفولدر:

```text
psychopharmaka-pro/sources/
```

## 2) ثبّت أداة قراءة PDF
من داخل فولدر المشروع في Terminal:

```bash
python3 -m pip install -r requirements.txt
```

## 3) استخرج قاعدة بيانات الأدوية
```bash
npm run extract:stahl
```

## 4) شغّل التطبيق
```bash
npm run dev
```

افتح:
```text
http://localhost:3000
```

بعد الاستخراج ابحث عن:
Sertralin, Venlafaxin, Escitalopram, Olanzapin, Risperidon...
