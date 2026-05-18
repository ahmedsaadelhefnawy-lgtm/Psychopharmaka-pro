export type RiskLevel = "niedrig" | "mittel" | "hoch";

export type Drug = {
  id: string;
  name: string;
  klasse: string;
  indikationen: string[];
  mechanismus: string;
  dosierung: string;
  nebenwirkungen: string[];
  gefaehrlicheNebenwirkungen: string[];
  gewicht: string;
  sedierung: string;
  interaktionen: string[];
  monitoring: string[];
  schwangerschaft: string;
  geriatrie: string;
  klinischePearls: string[];
  quellen: string[];
};

export type AnamneseResult = {
  verdacht: string[];
  differentialdiagnosen: string[];
  alarmzeichen: string[];
  naechsteFragen: string[];
  basisdiagnostik: string[];
  medikamentoeseOptionen: string[];
  hinweise: string[];
};

export type InteractionResult = {
  kombination: string;
  risiko: RiskLevel;
  mechanismus: string;
  empfehlung: string;
};
