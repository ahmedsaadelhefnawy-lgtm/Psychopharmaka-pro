# Psychopharmaka Pro

Deutschsprachige Next.js-App für interaktive Psychopharmakotherapie.

## Funktionen
- Intelligente Anamnese-Analyse
- Medikamenten-Datenbank mit klickbaren Karten
- Interaktionscheck
- Lernmodus

## Start
```bash
npm install
npm run dev
```

Dann öffnen:
```text
http://localhost:3000
```

## Nächste Ausbaustufe
- Vollständige Extraktion aller Medikamente aus Stahl/Dreher in eine strukturierte Datenbank
- RAG-Suche über Quellen
- Rollen: Arztmodus, Lernmodus
- Export als PWA / Offline-App

## Medizinischer Hinweis
Dieses Tool ist ein Prototyp zur klinischen Entscheidungsunterstützung und ersetzt keine ärztliche Diagnose, Fachinformation, Leitlinie oder individuelle Nutzen-Risiko-Abwägung.


## PDF-Extraction Engine starten

1. PDF-Datei lokal in diesen Ordner kopieren:
```text
sources/
```

2. Python-Abhängigkeit installieren:
```bash
python3 -m pip install -r requirements.txt
```

3. Stahl-Datenbank generieren:
```bash
npm run extract:stahl
```

4. App starten:
```bash
npm run dev
```

Danach sind automatisch extrahierte Medikamente in der Medikamenten-Datenbank suchbar, z.B. Sertralin, Venlafaxin, Quetiapin usw.

Wichtig: Die Extraktion ist heuristisch. Jede Medikamentenkarte muss vor klinischer Nutzung gegen Originalquelle, Fachinformation und lokale Leitlinien geprüft werden.


## Mac Desktop App

Siehe:
- `DESKTOP_MAC_AR.md`
- `DESKTOP_MAC_DE.md`

Kurz:
```bash
xcode-select --install
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
npm install
python3 -m pip install -r requirements.txt
npm run reextract:stahl
npm run desktop:dev
```

Build:
```bash
npm run desktop:build
```


## iPhone App

Siehe:
- `IPHONE_APP_AR.md`
- `IPHONE_APP_DE.md`

Kurz:
```bash
npm install
python3 -m pip install -r requirements.txt
npm run reextract:stahl
npm run ios:init
npm run ios:sync
npm run ios:open
```
