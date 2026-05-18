#!/usr/bin/env python3
"""
Stahl PDF extraction engine v5.

Fixes v4 issue:
- Stahl pages often contain drug names split from section headings, e.g. page heading
  "ACAMPROSATE" and then section title "THERAPEUTICS" in columns.
- v3 detected monographs, but field extraction was too strict.
- v4 uses table-of-contents page starts and extracts page ranges per drug.

Usage:
  python3 -m pip install -r requirements.txt
  npm run extract:stahl
  npm run dev
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

try:
    import fitz
except Exception:
    print("PyMuPDF fehlt. Bitte ausführen: python3 -m pip install -r requirements.txt")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "sources"
OUT = ROOT / "data" / "generatedDrugs.ts"

# Stahl table of contents: drug name -> printed starting page.
# PDF page index is usually printed page + 17 because monographs start at PDF page 18 for printed page 1.
TOC = [
("acamprosate",1),("agomelatine",5),("alprazolam",11),("amisulpride",17),("amitriptyline",25),
("amoxapine",33),("amphetamine (d)",39),("amphetamine (d,l)",47),("aripiprazole",55),("armodafinil",67),
("asenapine",73),("atomoxetine",81),("benztropine",87),("blonanserin",91),("bremelanotide",97),
("brexanolone",101),("brexpiprazole",105),("buprenorphine",113),("bupropion",119),("buspirone",125),
("caprylidene",129),("carbamazepine",133),("cariprazine",139),("chlordiazepoxide",147),("chlorpromazine",153),
("citalopram",159),("clomipramine",165),("clonazepam",173),("clonidine",179),("clorazepate",185),
("clozapine",191),("cyamemazine",201),("daridorexant",207),("desipramine",211),("desvenlafaxine",219),
("deutetrabenazine",225),("dexmedetomidine",229),("dextromethorphan–bupropion",233),("dextromethorphan–quinidine",239),
("diazepam",243),("diphenhydramine",249),("disulfiram",253),("donepezil",257),("dothiepin",263),
("doxepin",269),("duloxetine",277),("escitalopram",283),("esketamine",289),("estazolam",295),
("eszopiclone",299),("flibanserin",303),("flumazenil",307),("flunitrazepam",311),("fluoxetine",315),
("flupenthixol",321),("fluphenazine",327),("flurazepam",335),("fluvoxamine",339),("gabapentin",345),
("galantamine",351),("guanfacine",357),("haloperidol",361),("hydroxyzine",369),("iloperidone",373),
("imipramine",381),("isocarboxazid",389),("ketamine",397),("lamotrigine",401),("lemborexant",409),
("levetiracetam",413),("levomilnacipran",417),("lisdexamfetamine",423),("lithium",429),("lofepramine",435),
("lofexidine",441),("loflazepate",445),("lorazepam",451),("loxapine",457),("lumateperone",465),
("lurasidone",473),("maprotiline",481),("memantine",489),("methylfolate (l)",493),("methylphenidate (d)",497),
("methylphenidate (d,l)",503),("mianserin",511),("midazolam",515),("milnacipran",519),("mirtazapine",525),
("moclobemide",531),("modafinil",537),("molindone",543),("nalmefene",549),("naltrexone",553),
("naltrexone–bupropion",557),("nefazodone",563),("nortriptyline",569),("olanzapine",577),("olanzapine–samidorphan",587),
("oxazepam",595),("oxcarbazepine",601),("paliperidone",607),("paroxetine",619),("perospirone",627),
("perphenazine",633),("phenelzine",639),("phentermine–topiramate",645),("pimavanserin",651),("pimozide",655),
("pipothiazine",661),("pitolisant",667),("prazosin",671),("pregabalin",675),("propranolol",681),
("protriptyline",685),("quazepam",691),("quetiapine",695),("ramelteon",703),("reboxetine",707),
("risperidone",713),("rivastigmine",725),("selegiline",731),("serdexmethylphenidate",741),("sertindole",747),
("sertraline",753),("sildenafil",761),("sodium oxybate",765),("solriamfetol",769),("sulpiride",773),
("suvorexant",779),("tasimelteon",783),("temazepam",787),("thioridazine",791),("thiothixene",797),
("tiagabine",803),("tianeptine",809),("topiramate",813),("tranylcypromine",819),("trazodone",825),
("triazolam",831),("trifluoperazine",835),("trihexyphenidyl",841),("triiodothyronine",845),("trimipramine",849),
("valbenazine",857),("valproate",861),("varenicline",869),("venlafaxine",873),("vilazodone",879),
("viloxazine",885),("vortioxetine",891),("zaleplon",897),("ziprasidone",901),("zolpidem",909),
("zonisamide",913),("zopiclone",917),("zotepine",921),("zuclopenthixol",927)
]

GERMAN_NAMES = {
    "agomelatine":"Agomelatin","amitriptyline":"Amitriptylin","aripiprazole":"Aripiprazol","atomoxetine":"Atomoxetin",
    "bupropion":"Bupropion","carbamazepine":"Carbamazepin","citalopram":"Citalopram","clomipramine":"Clomipramin",
    "clonazepam":"Clonazepam","clozapine":"Clozapin","diazepam":"Diazepam","duloxetine":"Duloxetin",
    "escitalopram":"Escitalopram","fluoxetine":"Fluoxetin","fluvoxamine":"Fluvoxamin","haloperidol":"Haloperidol",
    "lamotrigine":"Lamotrigin","lisdexamfetamine":"Lisdexamfetamin","lithium":"Lithium","lorazepam":"Lorazepam",
    "methylphenidate (d,l)":"Methylphenidat","mirtazapine":"Mirtazapin","moclobemide":"Moclobemid","olanzapine":"Olanzapin",
    "paroxetine":"Paroxetin","pregabalin":"Pregabalin","quetiapine":"Quetiapin","risperidone":"Risperidon",
    "sertraline":"Sertralin","topiramate":"Topiramat","trazodone":"Trazodon","valproate":"Valproat",
    "venlafaxine":"Venlafaxin","vortioxetine":"Vortioxetin","ziprasidone":"Ziprasidon","zolpidem":"Zolpidem",
    "zopiclone":"Zopiclon"
}

def clean(s: str) -> str:
    s = s.replace("\u00ad", "")
    s = s.replace("￾", "")
    s = s.replace("https://doi.org/", " https://doi.org/")
    s = re.sub(r"https://doi\.org/\S+", " ", s)
    s = re.sub(r"Published online by Cambridge University Press", " ", s)
    s = re.sub(r"\b\d{1,3}\s*$", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()

def bullets(s: str, n: int = 8) -> List[str]:
    s = clean(s)
    if not s:
        return []
    # Preserve bullet list structure from PDF text.
    parts = re.split(r"\s*•\s*", s)
    if len(parts) <= 2:
        parts = re.split(r"(?<=[.;])\s+(?=[A-Z])", s)
    out = []
    for p in parts:
        p = clean(p).strip(" :-;,.")
        # remove common headings leaked into values
        p = re.sub(r"^(Brands|Generic\?|Class|Commonly Prescribed for|bold for FDA approved)\s+", "", p, flags=re.I)
        if len(p) >= 6:
            out.append(p[:280])
        if len(out) >= n:
            break
    return out or ["Nicht automatisch extrahiert"]

FIELD_HEADINGS = [
"Brands","Generic?","Class","Commonly Prescribed for","How the Drug Works","How Long Until It Works",
"If It Works","If It Doesn’t Work","If It Doesn't Work","Best Augmenting Combos","Tests","How Drug Causes Side Effects",
"Notable Side Effects","Life-Threatening or Dangerous Side Effects","Weight Gain","Sedation","Sedation (Somnolence)",
"What to Do About Side Effects","Best Augmenting Agents for Side Effects","Usual Dosage Range","Dosage Forms",
"How to Dose","Dosing Tips","Overdose","Long-Term Use","Habit Forming?","How to Stop","Pharmacokinetics",
"Drug Interactions","Other Warnings/Precautions","Other Warnings / Precautions","Do Not Use","Renal Impairment",
"Hepatic Impairment","Cardiac Impairment","Elderly","Children and Adolescents","Pregnancy","Breast Feeding",
"Potential Advantages","Potential Disadvantages","Primary Target Symptoms","Pearls","Suggested Reading",
"THERAPEUTICS","SIDE EFFECTS","DOSING AND USE","SPECIAL POPULATIONS","THE ART OF PSYCHOPHARMACOLOGY"
]
STOP = "|".join(re.escape(h) for h in sorted(FIELD_HEADINGS, key=len, reverse=True))

def grab(text: str, heading_variants: List[str]) -> str:
    # Match heading followed by text until next known heading.
    variants = "|".join(re.escape(h) for h in heading_variants)
    pattern = rf"(?:{variants})\s+(.*?)(?=\b(?:{STOP})\b|$)"
    m = re.search(pattern, text, flags=re.I | re.S)
    return clean(m.group(1)) if m else ""

def guess_class(name: str, extracted_class: str) -> str:
    if extracted_class and "Nicht" not in extracted_class:
        return extracted_class[:350]
    n = name.lower()
    ssri = {"citalopram","escitalopram","fluoxetine","fluvoxamine","paroxetine","sertraline"}
    snri = {"venlafaxine","duloxetine","desvenlafaxine","milnacipran","levomilnacipran"}
    atyp = {"quetiapine","olanzapine","risperidone","aripiprazole","clozapine","amisulpride","paliperidone","ziprasidone","lurasidone","cariprazine","asenapine"}
    benzo = {"alprazolam","clonazepam","diazepam","lorazepam","oxazepam","midazolam","temazepam","triazolam"}
    mood = {"lithium","valproate","lamotrigine","carbamazepine","oxcarbazepine"}
    if n in ssri: return "SSRI / selektiver Serotonin-Wiederaufnahmehemmer"
    if n in snri: return "SNRI / Serotonin-Noradrenalin-Wiederaufnahmehemmer"
    if n in atyp: return "Atypisches Antipsychotikum"
    if n in benzo: return "Benzodiazepin / GABA-A positiver allosterischer Modulator"
    if n in mood: return "Phasenprophylaktikum / Mood Stabilizer"
    return "Automatisch extrahierte Stahl-Monographie"

def to_drug(name: str, text: str, printed_page: int) -> Dict:
    text = clean(text)

    klasse = grab(text, ["Class"])
    indikationen = bullets(grab(text, ["Commonly Prescribed for"]), 10)
    mechanismus = grab(text, ["How the Drug Works"])[:1000]
    if not mechanismus:
        mechanismus = "Nicht automatisch extrahiert"

    dosage = " ".join([
        grab(text, ["Usual Dosage Range"])[:450],
        grab(text, ["How to Dose"])[:550],
        grab(text, ["Dosing Tips"])[:450],
    ]).strip() or "Nicht automatisch extrahiert"

    neben = bullets(grab(text, ["Notable Side Effects"]), 10)
    dangerous = bullets(grab(text, ["Life-Threatening or Dangerous Side Effects"]), 8)
    warnings = bullets(grab(text, ["Other Warnings/Precautions","Other Warnings / Precautions"]), 6)
    do_not = bullets(grab(text, ["Do Not Use"]), 6)

    gewicht = grab(text, ["Weight Gain"])[:450] or "Nicht automatisch extrahiert"
    sedierung = grab(text, ["Sedation (Somnolence)","Sedation"])[:450] or "Nicht automatisch extrahiert"
    inter = bullets(grab(text, ["Drug Interactions"]), 12)
    tests = bullets(grab(text, ["Tests"]), 8)
    schw = grab(text, ["Pregnancy"])[:900] or "Nicht automatisch extrahiert"
    ger = grab(text, ["Elderly"])[:650] or "Nicht automatisch extrahiert"
    pearls = bullets(grab(text, ["Pearls"]), 8)
    if pearls == ["Nicht automatisch extrahiert"]:
        pearls = bullets(grab(text, ["Potential Advantages"]), 5)

    drug_id = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    display = GERMAN_NAMES.get(name, name[:1].upper()+name[1:])

    return {
        "id": drug_id,
        "name": display,
        "klasse": guess_class(name, klasse),
        "indikationen": indikationen,
        "mechanismus": mechanismus,
        "dosierung": dosage,
        "nebenwirkungen": neben,
        "gefaehrlicheNebenwirkungen": (dangerous + warnings + do_not)[:14],
        "gewicht": gewicht,
        "sedierung": sedierung,
        "interaktionen": inter,
        "monitoring": tests if tests != ["Nicht automatisch extrahiert"] else ["Fachinformation/Leitlinie prüfen", "Nebenwirkungen, Interaktionen und Komorbiditäten überwachen"],
        "schwangerschaft": schw,
        "geriatrie": ger,
        "klinischePearls": pearls,
        "quellen": [f"Stahl Prescriber's Guide, 8th edition, Monographie ab Druckseite {printed_page}"]
    }

def main() -> None:
    pdfs = sorted(SOURCES.glob("*.pdf"))
    if not pdfs:
        print("Keine PDF in ./sources gefunden. Bitte Stahl-PDF in sources/ legen.")
        sys.exit(1)
    pdf = pdfs[0]
    print(f"Lese PDF: {pdf.name}")
    doc = fitz.open(pdf)

    offset = 16  # printed page 1 is PDF index 17 because PyMuPDF is 0-based: 1 + 16 = 17
    drugs = []
    for idx, (name, start_print) in enumerate(TOC):
        next_print = TOC[idx+1][1] if idx+1 < len(TOC) else 933
        start_idx = max(0, start_print + offset)
        # End before the next monograph start. Do NOT include the next drug page.
        end_idx = min(len(doc), next_print + offset)
        page_texts = []
        for pno in range(start_idx, end_idx):
            page_texts.append(doc[pno].get_text("text"))
        mono = "\n".join(page_texts)
        drugs.append(to_drug(name, mono, start_print))

    # Put key common meds first by normal alphabetical display name already enough.
    drugs.sort(key=lambda d: d["name"].lower())

    ts = "import { Drug } from '@/types/drug';\n\n"
    ts += "// AUTO-GENERATED by scripts/extract_stahl.py v5. Bitte nicht manuell bearbeiten.\n"
    ts += f"// Quelle: {pdf.name}; {len(drugs)} Monographien extrahiert.\n\n"
    ts += "export const generatedDrugs: Drug[] = "
    ts += json.dumps(drugs, ensure_ascii=False, indent=2)
    ts += ";\n"
    OUT.write_text(ts, encoding="utf-8")
    print(f"Gefundene Monographien: {len(drugs)}")
    print(f"Fertig: {OUT.relative_to(ROOT)}")
    print("Jetzt: npm run dev")

if __name__ == "__main__":
    main()
