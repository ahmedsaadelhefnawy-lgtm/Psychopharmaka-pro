# تحويل Psychopharmaka Pro إلى iPhone App شخصي

هذه الطريقة مخصصة لاستخدامك الشخصي على iPhoneك، بدون نشر على App Store.

## المتطلبات

1. Mac
2. Xcode من App Store
3. Apple ID
4. Node.js
5. المشروع الحالي Psychopharmaka Pro

## الخطوات

افتح Terminal داخل فولدر المشروع:

```bash
cd ~/Downloads/psychopharmaka-pro
```

أو لو النسخة عندك اسمها:

```bash
cd ~/Downloads/psychopharmaka-pro\ 2
```

## 1) تثبيت الحزم

```bash
npm install
```

## 2) استخراج قاعدة بيانات Stahl

تأكد أن ملف `stahl.pdf` موجود داخل:

```text
sources/stahl.pdf
```

ثم:

```bash
python3 -m pip install -r requirements.txt
npm run reextract:stahl
```

## 3) إنشاء مشروع iOS

أول مرة فقط:

```bash
npm run ios:init
```

## 4) مزامنة التطبيق مع iOS

```bash
npm run ios:sync
```

## 5) فتح المشروع في Xcode

```bash
npm run ios:open
```

## 6) تشغيله على iPhone

داخل Xcode:

1. وصل iPhone بالكابل
2. اختر iPhone من أعلى Xcode
3. من Signing & Capabilities اختر Team بحساب Apple ID
4. اضغط زر Run ▶️

سيتم تثبيت التطبيق على iPhoneك.

## بعد أي تعديل في التطبيق

كل مرة تعدّل الكود أو تستخرج بيانات جديدة:

```bash
npm run ios:sync
npm run ios:open
```

ثم Run من Xcode.

## ملاحظات مهمة

- بدون Apple Developer مدفوع، التطبيق يكون للاستخدام الشخصي وقد يحتاج إعادة توقيع كل فترة.
- للنشر على App Store تحتاج Apple Developer Account مدفوع.
- التطبيق سيحمل البيانات داخل app bundle، يعني يشتغل بدون إنترنت بعد البناء.
- استخدام محتوى الكتب يجب أن يبقى شخصيًا وخاصًا فقط.
