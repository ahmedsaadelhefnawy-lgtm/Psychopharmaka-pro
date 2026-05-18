# Psychopharmaka Pro als lokale Mac Desktop App

## Voraussetzungen

```bash
xcode-select --install
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

Terminal neu öffnen.

## Start

```bash
cd ~/Downloads/psychopharmaka-pro
npm install
python3 -m pip install -r requirements.txt
npm run reextract:stahl
npm run desktop:dev
```

## Build

```bash
npm run desktop:build
```

Output:
```text
src-tauri/target/release/bundle/macos/
src-tauri/target/release/bundle/dmg/
```
