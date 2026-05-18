# تحويل Psychopharmaka Pro إلى Mac Desktop App

هذه النسخة تعمل محليًا على جهازك فقط.

## 1) المتطلبات

افتح Terminal وثبّت Rust/Tauri requirements:

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

اختر الخيار الافتراضي `1`.

ثم اقفل Terminal وافتحه مرة أخرى.

## 2) داخل فولدر المشروع

```bash
cd ~/Downloads/psychopharmaka-pro
npm install
python3 -m pip install -r requirements.txt
npm run reextract:stahl
```

تأكد أن ملف Stahl PDF موجود في:

```text
psychopharmaka-pro/sources/stahl.pdf
```

## 3) تجربة Desktop App

```bash
npm run desktop:dev
```

سيفتح البرنامج كنافذة Mac App.

## 4) بناء ملف App / DMG

```bash
npm run desktop:build
```

بعد الانتهاء ستجد التطبيق غالبًا هنا:

```text
src-tauri/target/release/bundle/macos/
src-tauri/target/release/bundle/dmg/
```

## ملاحظة مهمة

إذا ظهر خطأ بسبب Rust أو Xcode، نفّذ:

```bash
xcode-select --install
```

ثم أعد المحاولة.
