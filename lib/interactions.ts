import { InteractionResult } from "@/types/drug";

const normalize = (s: string) => s.toLowerCase().trim();

export function checkInteraction(a: string, b: string): InteractionResult {
  const x = [normalize(a), normalize(b)].sort().join("+");

  const rules: Record<string, InteractionResult> = {
    ["citalopram+tramadol"]: {
      kombination: "Citalopram + Tramadol",
      risiko: "hoch",
      mechanismus: "Additive serotonerge Wirkung; zusätzlich kann Tramadol die Krampfschwelle senken.",
      empfehlung: "Kombination möglichst vermeiden oder eng überwachen; Alternativen prüfen; Patient über Serotonin-Syndrom-Symptome informieren."
    },
    ["carbamazepin+quetiapin"]: {
      kombination: "Carbamazepin + Quetiapin",
      risiko: "hoch",
      mechanismus: "Carbamazepin induziert CYP3A4 und kann Quetiapin-Spiegel deutlich senken.",
      empfehlung: "Kombination kritisch prüfen; Wirkung kann ausbleiben. Alternative Phasenprophylaxe oder Antipsychotikum erwägen."
    },
    ["lithium+ibuprofen"]: {
      kombination: "Lithium + Ibuprofen/NSAR",
      risiko: "hoch",
      mechanismus: "NSAR können Lithiumspiegel erhöhen und Intoxikation begünstigen.",
      empfehlung: "Wenn möglich vermeiden; bei Notwendigkeit Lithiumspiegel/Nierenfunktion eng kontrollieren."
    },
    ["lorazepam+opioid"]: {
      kombination: "Lorazepam + Opioid",
      risiko: "hoch",
      mechanismus: "Additive ZNS-Dämpfung mit Risiko für Atemdepression.",
      empfehlung: "Nur bei zwingender Indikation, niedrigste Dosis, kürzeste Dauer, Monitoring und Aufklärung."
    }
  };

  return rules[x] ?? {
    kombination: `${a} + ${b}`,
    risiko: "mittel",
    mechanismus: "Keine spezifische Regel in der lokalen Demo-Datenbank gefunden. Allgemeine Risiken: CYP-Interaktion, QT-Verlängerung, Sedierung, Serotonin-Syndrom, Krampfschwelle.",
    empfehlung: "Bitte Fachinformation/Interaktionsdatenbank prüfen. Dieses MVP ersetzt keinen vollständigen Interaktionscheck."
  };
}
