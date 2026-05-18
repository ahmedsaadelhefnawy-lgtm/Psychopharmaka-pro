# Psychopharmaka Pro v10 – AI Arztbrief كامل

هذه النسخة فيها Tab جديد:

AI Arztbrief

وتستخدم OpenAI API لتحسين النصوص الطبية الألمانية.

## 1) مهم جدًا قبل التشغيل

لا ترسل صورة فيها API Key.
لو ظهر المفتاح في صورة أو في محادثة، احذفه من منصة OpenAI واعمل مفتاح جديد.

## 2) إنشاء ملف .env.local

افتح Terminal:

```bash
cd ~/Downloads/psychopharmaka-pro-v10
touch .env.local
nano .env.local
```

ضع سطر واحد فقط:

```text
OPENAI_API_KEY=sk-proj-PASTE_YOUR_REAL_KEY_HERE
```

بدون:
- علامات اقتباس
- مسافات
- أسطر إضافية داخل المفتاح

الحفظ في nano:
- Ctrl + O
- Enter
- Ctrl + X

## 3) تشغيل التطبيق

```bash
npm install
npm run dev
```

افتح:

```text
http://localhost:3000
```

ثم Tab:

```text
AI Arztbrief
```

## 4) اختبار سريع

اكتب:

```text
Patient berichtet über Schlafstörungen, innere Unruhe und Grübeln. Keine akute Suizidalität.
```

واضغط:

```text
Text verbessern
```

## 5) لو ظهر خطأ

افتح Terminal وشوف الرسالة.
الأخطاء الشائعة:

- OPENAI_API_KEY fehlt
  يعني ملف .env.local غير موجود أو السيرفر لم يُعاد تشغيله.

- Incorrect API key
  يعني المفتاح غلط أو محذوف.

- You exceeded your current quota
  يعني تحتاج Billing/رصيد في OpenAI Platform.

## 6) ملاحظة مهمة عن iPhone/Desktop

هذه النسخة تعمل AI بسهولة في وضع:

```bash
npm run dev
```

أما نسخة iPhone/Desktop النهائية تحتاج لاحقًا Backend آمن حتى لا يتم وضع API Key داخل التطبيق نفسه.
