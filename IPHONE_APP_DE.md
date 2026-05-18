# Psychopharmaka Pro als persönliche iPhone App

## Voraussetzungen

- Mac
- Xcode
- Apple ID
- Node.js
- Projektordner

## Befehle

```bash
npm install
python3 -m pip install -r requirements.txt
npm run reextract:stahl
npm run ios:init
npm run ios:sync
npm run ios:open
```

In Xcode:
1. iPhone anschließen
2. iPhone als Target auswählen
3. Signing Team auswählen
4. Run drücken

Nach Änderungen:

```bash
npm run ios:sync
npm run ios:open
```
