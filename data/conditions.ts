export type ConditionRecommendation = {
  id: string;
  name: string;
  leitsymptome: string[];
  diagnostik: string[];
  pharmakotherapie: string[];
  vermeiden: string[];
  monitoring: string[];
  notizen: string[];
  quellen: string[];
};

export const conditions: ConditionRecommendation[] = [
  {
    id: "depressive-episode",
    name: "Depressive Episode",
    leitsymptome: ["gedrückte Stimmung", "Interessenverlust", "Antriebsminderung", "Schlafstörung", "Appetit-/Gewichtsveränderung", "Suizidalität aktiv erfragen"],
    diagnostik: ["Vertrauensverhältnis herstellen", "körperliche Untersuchung", "Labor inkl. somatische Ursachen", "EKG vor QT-relevanten Substanzen", "Bipolarität ausschließen"],
    pharmakotherapie: ["SSRI/SNRI je nach Symptomprofil", "Mirtazapin bei Insomnie/Appetitverlust erwägen", "Lithium-Augmentation bei therapieresistenter Depression nach ausreichenden Behandlungsversuchen", "Bei schwerer Angst kurzzeitig Benzodiazepin nur mit Plan"],
    vermeiden: ["Antidepressivum-Monotherapie bei Verdacht auf Bipolarität", "unkritische Polypharmazie", "Benzodiazepine ohne zeitliche Begrenzung"],
    monitoring: ["Wirklatenz 2–6 Wochen erklären", "Suizidalität und Aktivierung initial engmaschig", "Nebenwirkungen/sexuelle Dysfunktion", "Natrium bei älteren Patienten"],
    notizen: ["Bei wahnhaften Depressionen EKT bzw. Kombination mit Antipsychotikum im spezialisierten Setting erwägen."],
    quellen: ["Dreher: Antidepressiva, Therapie/Depression", "Dreher: Welches Antidepressivum gebe ich wem?"]
  },
  {
    id: "generalisierte-angst-zwang",
    name: "Generalisierte Angststörung / Zwangserkrankung",
    leitsymptome: ["anhaltende Sorgen", "Grübeln", "körperliche Angstsymptome", "Vermeidung", "Zwangsgedanken/-handlungen"],
    diagnostik: ["Schweregrad erfassen", "Substanz-/Koffein-/somatische Ursachen prüfen", "Komorbidität Depression abklären", "Suizidalität erfragen"],
    pharmakotherapie: ["SSRI bei milderen Fällen", "SNRI bei schwereren Fällen erwägen", "Duloxetin/Milnacipran/Venlafaxin je nach Verträglichkeit", "Bei schwerer Zwangserkrankung Spezialstrategie mit Clomipramin nur erfahren/überwacht"],
    vermeiden: ["Langzeit-Benzodiazepine als Basistherapie", "zu schnelle Dosissteigerung bei Aktivierung", "Kombinationen ohne Interaktionscheck"],
    monitoring: ["Anfangsunruhe", "Suizidalität", "Blutdruck bei SNRI", "Serotonerge Kombinationen"],
    notizen: ["Psychotherapie/Exposition bleibt zentral, Pharmakotherapie unterstützt."],
    quellen: ["Dreher: Antidepressiva, Generalisierte Angststörung und Zwangserkrankung"]
  },
  {
    id: "psychose",
    name: "Psychose / Schizophrenie",
    leitsymptome: ["Wahn", "Halluzinationen", "Ich-Störungen", "Desorganisation", "Negativsymptome", "Agitation/Gefährdung"],
    diagnostik: ["Vertrauensverhältnis und Psychoedukation", "körperliche Untersuchung", "ausführliche Blutuntersuchungen", "Drogenscreening", "EKG", "bei Ersterkrankten cCT/cMRT erwägen"],
    pharmakotherapie: ["Atypisches Antipsychotikum nach Nebenwirkungsprofil", "Anxiolytikum/Sedierung nur nach Zielklärung", "Clozapin bei Therapieresistenz im Spezialsetting", "Depot bei Adhärenzproblemen erwägen"],
    vermeiden: ["reine Sedierung ohne antipsychotisches Therapieziel", "QT-riskante Kombinationen ohne EKG", "metabolisches Risiko ignorieren"],
    monitoring: ["Gewicht/BMI", "Glukose/HbA1c", "Lipide", "EPS/Akathisie", "Prolaktin je nach Substanz", "EKG bei QT-Risiko"],
    notizen: ["Diagnose Psychose bedeutet: ein Neuroleptikum sollte vertreten sein; die genaue Wahl richtet sich nach Beschwerden, Schwere und Nebenwirkungsprofil."],
    quellen: ["Dreher: Neuroleptika, Behandlung der Psychose", "Dreher: Psychopharmaka im Überblick"]
  },
  {
    id: "bipolare-stoerung",
    name: "Bipolare Störung",
    leitsymptome: ["manische/hypomanische Episoden", "depressive Episoden", "Schlafreduktion", "Rededrang", "Enthemmung", "Phasenverlauf"],
    diagnostik: ["Manie/Hypomanie aktiv erfragen", "Substanzinduzierte Symptome ausschließen", "Suizidalität", "somatische Basisdiagnostik", "Medikamentenanamnese"],
    pharmakotherapie: ["Langfristig Phasenprophylaktikum", "Lithium als sehr wirksame Option", "Valproat/Carbamazepin/Lamotrigin je nach Verlauf und Kontraindikationen", "Akute Manie: Phasenprophylaktikum plus Antipsychotikum", "Bipolare Depression: Phasenprophylaktikum plus vorsichtiges/niedrig dosiertes Antidepressivum nur zeitlich begrenzt"],
    vermeiden: ["Antidepressivum-Monotherapie", "Valproat bei Frauen mit Schwangerschaftspotenzial ohne strenge Indikation/Regeln", "Lithium ohne Spiegel- und Nierenmonitoring"],
    monitoring: ["Lithiumspiegel/eGFR/TSH", "Valproat: Leber/Blutbild/Schwangerschaftsrisiko", "Carbamazepin: Blutbild/Interaktionen", "Lamotrigin: Hautreaktionen"],
    notizen: ["Phasenprophylaktika reduzieren Anzahl und Schwere manischer/depressiver Episoden, verhindern sie aber nicht immer vollständig."],
    quellen: ["Dreher: Phasenprophylaxe, Behandlung der Bipolaren Störung", "Dreher: Lithium"]
  },
  {
    id: "adhs",
    name: "ADHS bei Erwachsenen",
    leitsymptome: ["Unaufmerksamkeit", "Impulsivität", "Hyperaktivität/innere Unruhe", "Beginn in Kindheit", "Funktionsbeeinträchtigung"],
    diagnostik: ["Diagnose sorgfältig sichern", "Differentialdiagnosen: Depression, Angst, Bipolarität, Substanzen", "kardiovaskuläre Risiken prüfen", "Blutdruck/Puls"],
    pharmakotherapie: ["Methylphenidat", "Lisdexamfetamin", "Atomoxetin", "Medikation nur bei gesicherter Diagnose und unzureichendem Nutzen nichtmedikamentöser Maßnahmen"],
    vermeiden: ["Stimulanzien bei unklarer Diagnose", "Substanzmissbrauchsrisiko ignorieren", "Blutdruck/Puls nicht kontrollieren"],
    monitoring: ["Blutdruck", "Herzfrequenz", "Gewicht/Appetit", "Schlaf", "Missbrauch/Weitergabe"],
    notizen: ["Nicht jeder unkonzentrierte Erwachsene hat ADHS; Diagnose steht vor Therapie."],
    quellen: ["Dreher: ADHS-Therapeutika"]
  },
  {
    id: "schlafstoerung",
    name: "Schlafstörung / Insomnie",
    leitsymptome: ["Ein-/Durchschlafstörung", "nicht erholsamer Schlaf", "Tagesmüdigkeit", "sekundär bei Depression/Manie/Angst/Substanzen"],
    diagnostik: ["Ursache klären", "Schlafhygiene", "Depression/Manie/Angst/Substanzen prüfen", "realistische Schlafdauer im Alter besprechen"],
    pharmakotherapie: ["KVT-I/Schlafhygiene zuerst", "pflanzliche Mittel/Melatonin/Antihistaminika je nach Fall", "sedierende Antidepressiva oder niedrigpotente Neuroleptika nur indikationsbezogen", "Benzodiazepine/Z-Substanzen nur kurzzeitig und streng geplant"],
    vermeiden: ["Dauerverordnung abhängig machender Schlafmittel", "Schlafmittel ohne Ursachenklärung", "Sedierung bei Delir/älteren Patienten ohne Risikoabwägung"],
    monitoring: ["Stürze", "Tagesmüdigkeit", "Abhängigkeit", "kognitive Nebenwirkungen", "Atemdepression bei Kombinationen"],
    notizen: ["Viele Schlafmittel stellen keinen physiologischen Schlaf wieder her und verlieren nach Wochen Wirkung."],
    quellen: ["Dreher: Schlafmittel, Eskalationsplan Schlafstörungen"]
  },
  {
    id: "erregungszustand",
    name: "Psychiatrischer Notfall / Erregungszustand",
    leitsymptome: ["Agitation", "Bedrohlichkeit", "akute Angst", "Psychose", "Intoxikation/Entzug", "Fremd- oder Selbstgefährdung"],
    diagnostik: ["Deeskalation zuerst", "Ursache möglichst spezifisch klären", "Vitalparameter", "Intoxikation/Delir/Entzug prüfen", "Patient soweit möglich einbeziehen"],
    pharmakotherapie: ["Orale Medikation bevorzugen", "sedierende Medikation zur Beruhigung, nicht zum Schlaf erzwingen", "Benzodiazepin bei akuter Angst/psychotischer Angst je nach Situation", "Antipsychotikum bei psychotischer Agitation"],
    vermeiden: ["unnötige i.m.-Gabe wenn oral möglich", "Über-Sedierung", "Alkohol/Opioid/BZD-Kombination ohne Atemmonitoring"],
    monitoring: ["Atemfrequenz", "Bewusstsein", "Blutdruck/Puls", "EPS", "QT-Risiko", "erneute Gefährdungsbeurteilung"],
    notizen: ["Leitprinzip bleibt Deeskalation; Pharmakotherapie soll Situation entschärfen und ursächlich sinnvoll sein."],
    quellen: ["Dreher: Notfälle, Pharmakotherapie des Erregungszustandes"]
  },
  {
    id: "gerontopsychiatrie-delir",
    name: "Gerontopsychiatrie / Verwirrtheit / Delir",
    leitsymptome: ["akute Verwirrtheit", "Desorientierung", "fluktuierende Aufmerksamkeit", "psychotisches Erleben im Alter", "Exsikkose/Infekt häufig"],
    diagnostik: ["Flüssigkeitsmangel prüfen", "Infekt/Fieber/Durchfall", "Elektrolyte", "Medikamente/Anticholinergika", "Demenzbasis vs. akute Verschlechterung"],
    pharmakotherapie: ["Ursache behandeln", "Flüssigkeit unter kontrollierten Bedingungen substituieren", "Antipsychotikum nur bei schwerer Unruhe/Gefährdung und nach Risikoabwägung", "Benzodiazepine meist vermeiden außer spezielle Indikationen"],
    vermeiden: ["anticholinerge Last", "Benzodiazepine ohne klare Indikation", "Dehydratation übersehen", "Standard-Erwachsenendosen"],
    monitoring: ["Elektrolyte", "Nierenfunktion", "Stürze", "Sedierung", "QT/EKG bei Antipsychotika"],
    notizen: ["In der Gerontopsychiatrie ist Wasser oft das wichtigste Medikament."],
    quellen: ["Dreher: Gerontopsychiatrie"]
  }
];
