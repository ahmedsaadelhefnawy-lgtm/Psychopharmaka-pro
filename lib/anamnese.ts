import { AnamneseResult } from "@/types/drug";

const has = (text: string, words: string[]) => words.some(w => text.includes(w.toLowerCase()));

export function analyzeAnamnese(input: string): AnamneseResult {
  const t = input.toLowerCase();

  const verdacht: string[] = [];
  const differentialdiagnosen: string[] = [];
  const alarmzeichen: string[] = [];
  const medikamentoeseOptionen: string[] = [];
  const hinweise: string[] = [];

  if (has(t, ["antriebslos", "depressiv", "niedergeschlagen", "interessenverlust", "appetitverlust", "schuld", "hoffnungslos", "früherwachen"])) {
    verdacht.push("Depressive Episode");
    differentialdiagnosen.push("Bipolare Depression", "Anpassungsstörung", "Hypothyreose/organische Ursache", "Substanzinduzierte depressive Symptomatik");
    medikamentoeseOptionen.push("SSRI/SNRI je nach Profil", "Mirtazapin bei Insomnie/Appetitverlust", "Augmentation erst nach Verlauf und Diagnosesicherung");
    hinweise.push("Vor Antidepressivum aktiv nach Hypomanie/Manie fragen.");
  }

  if (has(t, ["panik", "angst", "sorgen", "grübeln", "herzrasen", "vermeidung"])) {
    verdacht.push("Angststörung / Panikstörung");
    differentialdiagnosen.push("Hyperthyreose", "Substanz-/Koffein-induziert", "kardiale Ursache", "traumabezogene Störung");
    medikamentoeseOptionen.push("SSRI/SNRI als Langzeitoption", "Kurzzeitig Benzodiazepin nur bei klarer Indikation und Plan");
  }

  if (has(t, ["wahn", "halluzination", "stimmen", "verfolgung", "paranoid", "desorganisiert"])) {
    verdacht.push("Psychotische Störung");
    differentialdiagnosen.push("Substanzinduzierte Psychose", "Delir", "bipolare/manische Psychose", "wahnhafte Depression");
    medikamentoeseOptionen.push("Atypisches Antipsychotikum", "Akutsedierung nur bei Gefährdung/Erregung");
  }

  if (has(t, ["manie", "euphorisch", "größenideen", "wenig schlaf", "rededrang", "geldausgaben", "enthemmt"])) {
    verdacht.push("Manische/hypomanische Episode");
    differentialdiagnosen.push("Substanzinduzierte Manie", "ADHS", "Persönlichkeitsakzentuierung", "organische Ursache");
    medikamentoeseOptionen.push("Mood Stabilizer", "Atypisches Antipsychotikum", "Benzodiazepin kurzfristig bei Erregung/Schlafmangel");
  }

  if (has(t, ["suizid", "todeswunsch", "nicht mehr leben", "plan", "abschiedsbrief"])) {
    alarmzeichen.push("Suizidalität: sofortige strukturierte Risikoabschätzung und Sicherheitsplan/Notfallmanagement.");
  }

  if (has(t, ["fieber", "verwirrt", "desorientiert", "akut verwirrt", "delir"])) {
    alarmzeichen.push("Delir/organische Ursache möglich: Vitalparameter, Labor, Medikamente, Infekt, Exsikkose prüfen.");
  }

  if (has(t, ["schwanger", "schwangerschaft", "stillzeit"])) {
    alarmzeichen.push("Schwangerschaft/Stillzeit: jede Pharmakotherapie individuell und leitlinienbasiert abwägen.");
  }

  if (verdacht.length === 0) {
    verdacht.push("Keine klare Mustererkennung – weitere strukturierte Anamnese erforderlich");
    differentialdiagnosen.push("Affektive Störung", "Angststörung", "Psychose", "Substanzbezogene Störung", "Organische Ursache");
  }

  return {
    verdacht: [...new Set(verdacht)],
    differentialdiagnosen: [...new Set(differentialdiagnosen)],
    alarmzeichen: alarmzeichen.length ? alarmzeichen : ["Keine eindeutigen Alarmzeichen im Text erkannt – aktiv nach Suizidalität, Fremdgefährdung, Delir, Intoxikation und Manie fragen."],
    naechsteFragen: [
      "Seit wann bestehen die Symptome und wie stark ist die Funktionsbeeinträchtigung?",
      "Gab es jemals Phasen mit deutlich vermindertem Schlafbedarf, Euphorie, Reizbarkeit oder Enthemmung?",
      "Substanzkonsum: Alkohol, Cannabis, Stimulanzien, Benzodiazepine?",
      "Suizidgedanken, konkrete Pläne, frühere Versuche?",
      "Somatische Ursachen/Medikamente: Schilddrüse, Infekt, Schmerzen, Steroide, neurologische Symptome?"
    ],
    basisdiagnostik: [
      "Psychopathologischer Befund",
      "Somatischer Status, Vitalparameter",
      "Labor inkl. Blutbild, Elektrolyte, Leber/Niere, TSH je nach Fall",
      "EKG vor QT-relevanten Medikamenten oder bei kardialem Risiko",
      "Substanzscreening bei Verdacht"
    ],
    medikamentoeseOptionen: [...new Set(medikamentoeseOptionen.length ? medikamentoeseOptionen : ["Erst nach Diagnose, Schweregrad und Risikoabwägung auswählen."])],
    hinweise: [...new Set(hinweise.concat(["Dieses Tool liefert Entscheidungsunterstützung und ersetzt keine ärztliche Beurteilung."]))]
  };
}
