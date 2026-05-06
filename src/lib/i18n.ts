import { useEffect, useState } from "react";

export type Lang = "en" | "da";

const LS_KEY = "ibs-lang";

export const getLang = (): Lang => {
  try {
    const v = localStorage.getItem(LS_KEY);
    if (v === "da" || v === "en") return v;
  } catch {
    /* ignore */
  }
  return "en";
};

export const setLang = (lang: Lang) => {
  try {
    localStorage.setItem(LS_KEY, lang);
    window.dispatchEvent(new Event("ibs-lang-changed"));
  } catch {
    /* ignore */
  }
};

type Dict = Record<string, string>;

const en: Dict = {
  // Nav
  "nav.home": "Home",
  "nav.history": "History",
  "nav.add": "Add",
  "nav.daily": "Daily",
  "nav.insights": "Insights",

  // History
  "history.kicker": "Your log",
  "history.title": "Meal history",
  "history.search.placeholder": "Search meals or ingredients",
  "history.empty.title": "No meals match",
  "history.empty.body": "Try a different search or add a new meal.",
  "history.edited": "edited",

  // Index
  "index.kicker": "IBS Food Tracker",
  "index.greeting": "Hi there 👋",
  "index.subtitle": "Tracking your meals helps you spot what your gut tolerates.",
  "index.hero.kicker": "Smart insights",
  "index.hero.title": "Snap a photo. Understand your meal.",
  "index.hero.body": "Get an instant FODMAP estimate and possible IBS triggers.",
  "index.hero.cta": "Add meal",
  "index.stat.recent": "Recent meals",
  "index.stat.symptomFree": "Symptom-free",
  "index.daily.title": "Today's daily log",
  "index.daily.body": "Stress, sleep, bowel movements — context matters.",
  "index.recent": "Recent meals",
  "index.viewAll": "View all",
  "index.empty.title": "No meals yet",
  "index.empty.body": "Add your first meal to start tracking.",
  "index.disclaimer":
    "This app does not provide medical diagnosis. Estimates from photos may be imperfect. Always consult a healthcare professional.",

  // Meal detail
  "meal.notFound": "Meal not found",
  "meal.delete.confirm": "Delete this meal entry? This cannot be undone.",
  "meal.delete.error": "Couldn't delete",
  "meal.delete.success": "Meal deleted",
  "meal.back": "Back",
  "meal.edit": "Edit",
  "meal.edited": "edited",
  "meal.allTriggersTolerated": "all triggers tolerated",
  "meal.moreInfo.title": "More info needed",
  "meal.moreInfo.body": "Add more details and re-analyze for a better estimate.",
  "meal.summary.title": "Meal summary",
  "meal.confidence": "confidence",
  "meal.ingredients.title": "Likely ingredients",
  "meal.triggers.title": "Possible IBS triggers in this meal",
  "meal.tolerated.toast": "\"{item}\" marked as tolerated",
  "meal.tolerated.button": "I tolerate it",
  "meal.tolerated.title": "I tolerate this ingredient",
  "meal.tolerated.note": "Mark anything you tolerate well — it won't be flagged as a trigger.",
  "meal.evidence.title": "Documented · evidence-based",
  "meal.anecdotal.title": "Anecdotal · commonly reported",
  "meal.anecdotal.note": "Reported by IBS users; not clinically proven.",
  "meal.symptoms.title": "Symptoms",
  "meal.symptoms.body": "Log how you felt — even hours later.",
  "meal.symptoms.add": "Add",
  "meal.symptoms.update": "Update",
  "meal.symptoms.started": "Started",
  "meal.disclaimer": "Not a medical diagnosis. Always consult a healthcare professional.",

  // Insights
  "insights.kicker": "Patterns",
  "insights.title": "Insights",
  "insights.subtitle": "Trends across your tracked meals.",
  "insights.empty.title": "No data yet",
  "insights.empty.body": "Track a few meals to start seeing patterns.",
  "insights.stat.tracked": "Meals tracked",
  "insights.stat.free": "Symptom-free",
  "insights.stat.with": "With symptoms",
  "insights.stat.high": "High FODMAP",
  "insights.alarm.title": "Please consider seeing a doctor",
  "insights.alarm.body": "You've logged symptoms that aren't typical for IBS alone:",
  "insights.alarm.foot":
    "These don't mean something is wrong, but they should be evaluated by a healthcare professional.",
  "insights.corr.title": "Possible correlations",
  "insights.corr.body": "Patterns from your data — not certainties. More entries = better signal.",
  "insights.corr.reacted": "Reacted",
  "insights.corr.exposures": "exposures",
  "insights.corr.tip": "Tip: try not to test multiple suspect foods on the same day.",
  "insights.triggers.title": "Ingredients that seem to trigger symptoms",
  "insights.triggers.body": "Today's view — tap for full log (7d / 14d / 1m / all time)",
  "insights.triggers.empty": "No symptom triggers logged today. Tap to see your full history.",
  "insights.triggers.cta": "View full trigger log →",
  "insights.tolerated.title": "Foods you seem to tolerate well",
  "insights.tolerated.body":
    "Whitelisted ingredients won't be flagged as triggers — even if their FODMAP score is high.",
  "insights.tolerated.placeholder": "Add an ingredient (e.g. garlic)",
  "insights.tolerated.add": "Add",
  "insights.tolerated.observed": "Observed from your symptom-free meals:",
  "insights.symptoms.title": "Symptom frequency",
  "insights.symptoms.empty": "No symptoms logged yet — that's great!",
  "insights.report.title": "Generate doctor / dietitian report",
  "insights.report.body": "Markdown summary you can download or share.",
  "insights.foot":
    "Insights are observational and not a clinical diagnosis. IBS is individual — patterns take time to identify.",

  // Analyzer
  "analyzer.title": "Smart trigger analyzer",
  "analyzer.subtitle":
    "Scores possible food–symptom links across 10 criteria: dose, timing, symptom match, bowel data, confounders, reproducibility and more.",
  "analyzer.minData.title": "More data = better analysis",
  "analyzer.minData.body":
    "We recommend at least 14 days of meal + symptom logging before drawing conclusions. Right now you have {days} day(s) of data and {meals} meal(s) logged.",
  "analyzer.minData.warn":
    "Less than 14 days — the analysis will run, but treat results as exploratory.",
  "analyzer.run": "Run analysis",
  "analyzer.running": "Analyzing your data…",
  "analyzer.again": "Run again",
  "analyzer.disclaimer":
    "This is a pattern-spotting tool, not a diagnosis. Always discuss findings with a qualified clinician.",
  "analyzer.empty": "Run the analyzer to get personalised pattern hypotheses.",
  "analyzer.error": "Analysis failed. Please try again.",
  "analyzer.noData": "Add at least a few meals with symptoms before running the analyzer.",
  "analyzer.confidence": "Confidence",
  "analyzer.why": "Why",
  "analyzer.weakens": "What weakens this",
  "analyzer.next": "Next best step",
  "analyzer.dataQuality": "Overall data quality",
  "analyzer.summary": "Summary",
  "analyzer.redFlags": "Red flags noticed",

  // Settings
  "settings.kicker": "Account",
  "settings.title": "Settings",
  "settings.lang.title": "Language",
  "settings.lang.en": "English",
  "settings.lang.da": "Dansk",

  // Daily log
  "daily.kicker": "Daily log",
  "daily.title": "How was your day?",
  "daily.today": "(today)",
  "daily.intro": "Stress, sleep and other factors often influence IBS symptoms. Tracking them helps separate food triggers from confounders.",
  "daily.stress": "Stress level",
  "daily.stress.left": "Calm",
  "daily.stress.right": "Very stressed",
  "daily.anxiety": "Anxiety",
  "daily.anxiety.left": "None",
  "daily.anxiety.right": "High",
  "daily.sleep": "Sleep",
  "daily.sleep.hours": "Hours slept",
  "daily.sleep.hours.placeholder": "e.g. 7.5",
  "daily.sleep.quality": "Sleep quality",
  "daily.sleep.quality.left": "Poor",
  "daily.sleep.quality.right": "Excellent",
  "daily.exercise": "Exercise (minutes)",
  "daily.exercise.placeholder": "e.g. 30",
  "daily.factors": "Other factors",
  "daily.factors.alcohol": "Alcohol",
  "daily.factors.caffeine": "Caffeine",
  "daily.factors.illness": "Illness / infection",
  "daily.factors.menstrual": "Menstrual cycle",
  "daily.medication": "Medication today",
  "daily.medication.placeholder": "e.g. probiotic, antispasmodic",
  "daily.notes": "Notes",
  "daily.notes.placeholder": "Anything else worth remembering",
  "daily.bm.title": "Bowel movements",
  "daily.bm.type": "Type",
  "daily.bm.log": "Log a movement",
  "daily.bm.scale": "Bristol Stool Scale",
  "daily.bm.urgency": "Urgency",
  "daily.bm.painful": "Painful",
  "daily.bm.incomplete": "Incomplete evacuation",
  "daily.bm.relief": "Felt relief after",
  "daily.bm.alarm": "Blood or mucus present",
  "daily.bm.alarm.note": "Blood or mucus in stool should be evaluated by a doctor.",
  "daily.bm.button": "Log movement",
  "daily.bm.saved": "Bowel movement logged",
  "daily.bm.tag.urgency": "urgency",
  "daily.bm.tag.painful": "painful",
  "daily.bm.tag.incomplete": "incomplete",
  "daily.bm.tag.relief": "relief after",
  "daily.bm.tag.alarm": "⚠ blood/mucus",
  "daily.foot": "Daily entries are saved to this device. They power your trigger insights.",
  "daily.bristol.1": "Separate hard lumps (constipation)",
  "daily.bristol.2": "Lumpy and sausage-like",
  "daily.bristol.3": "Sausage with cracks",
  "daily.bristol.4": "Smooth, soft sausage (ideal)",
  "daily.bristol.5": "Soft blobs with clear edges",
  "daily.bristol.6": "Mushy, ragged edges",
  "daily.bristol.7": "Entirely liquid (diarrhea)",
};

const da: Dict = {
  // Nav
  "nav.home": "Hjem",
  "nav.history": "Historik",
  "nav.add": "Tilføj",
  "nav.daily": "Daglig",
  "nav.insights": "Indsigt",

  // History
  "history.kicker": "Din log",
  "history.title": "Måltidshistorik",
  "history.search.placeholder": "Søg i måltider eller ingredienser",
  "history.empty.title": "Ingen måltider matcher",
  "history.empty.body": "Prøv en anden søgning eller tilføj et nyt måltid.",
  "history.edited": "redigeret",

  // Index
  "index.kicker": "IBS Madtracker",
  "index.greeting": "Hej med dig 👋",
  "index.subtitle": "At tracke dine måltider hjælper dig med at se, hvad din mave tåler.",
  "index.hero.kicker": "Smarte indsigter",
  "index.hero.title": "Tag et billede. Forstå dit måltid.",
  "index.hero.body": "Få et øjeblikkeligt FODMAP-estimat og mulige IBS-triggere.",
  "index.hero.cta": "Tilføj måltid",
  "index.stat.recent": "Seneste måltider",
  "index.stat.symptomFree": "Uden symptomer",
  "index.daily.title": "Dagens log",
  "index.daily.body": "Stress, søvn, afføring — konteksten betyder noget.",
  "index.recent": "Seneste måltider",
  "index.viewAll": "Se alle",
  "index.empty.title": "Ingen måltider endnu",
  "index.empty.body": "Tilføj dit første måltid for at komme i gang.",
  "index.disclaimer":
    "Denne app stiller ikke medicinske diagnoser. Estimater ud fra billeder kan være upræcise. Konsultér altid en sundhedsprofessionel.",

  // Meal detail
  "meal.notFound": "Måltidet blev ikke fundet",
  "meal.delete.confirm": "Slet dette måltid? Det kan ikke fortrydes.",
  "meal.delete.error": "Kunne ikke slette",
  "meal.delete.success": "Måltid slettet",
  "meal.back": "Tilbage",
  "meal.edit": "Redigér",
  "meal.edited": "redigeret",
  "meal.allTriggersTolerated": "alle triggere tåles",
  "meal.moreInfo.title": "Mere info nødvendig",
  "meal.moreInfo.body": "Tilføj flere detaljer og analysér igen for et bedre estimat.",
  "meal.summary.title": "Måltidsresumé",
  "meal.confidence": "sikkerhed",
  "meal.ingredients.title": "Sandsynlige ingredienser",
  "meal.triggers.title": "Mulige IBS-triggere i dette måltid",
  "meal.tolerated.toast": "\"{item}\" markeret som tålt",
  "meal.tolerated.button": "Jeg tåler det",
  "meal.tolerated.title": "Jeg tåler denne ingrediens",
  "meal.tolerated.note": "Markér det, du tåler godt — så bliver det ikke markeret som trigger.",
  "meal.evidence.title": "Dokumenteret · evidensbaseret",
  "meal.anecdotal.title": "Anekdotisk · ofte rapporteret",
  "meal.anecdotal.note": "Rapporteret af IBS-brugere; ikke klinisk bevist.",
  "meal.symptoms.title": "Symptomer",
  "meal.symptoms.body": "Log hvordan du havde det — også flere timer senere.",
  "meal.symptoms.add": "Tilføj",
  "meal.symptoms.update": "Opdatér",
  "meal.symptoms.started": "Startede",
  "meal.disclaimer": "Ikke en medicinsk diagnose. Kontakt altid en sundhedsprofessionel.",

  // Insights
  "insights.kicker": "Mønstre",
  "insights.title": "Indsigt",
  "insights.subtitle": "Tendenser på tværs af dine logførte måltider.",
  "insights.empty.title": "Ingen data endnu",
  "insights.empty.body": "Log et par måltider for at begynde at se mønstre.",
  "insights.stat.tracked": "Måltider logget",
  "insights.stat.free": "Uden symptomer",
  "insights.stat.with": "Med symptomer",
  "insights.stat.high": "Høj FODMAP",
  "insights.alarm.title": "Overvej at se en læge",
  "insights.alarm.body": "Du har logget symptomer, der ikke er typiske for IBS alene:",
  "insights.alarm.foot":
    "Det betyder ikke nødvendigvis, at noget er galt, men det bør vurderes af en sundhedsprofessionel.",
  "insights.corr.title": "Mulige sammenhænge",
  "insights.corr.body": "Mønstre fra dine data — ikke sikkerheder. Flere registreringer = bedre signal.",
  "insights.corr.reacted": "Reagerede",
  "insights.corr.exposures": "eksponeringer",
  "insights.corr.tip": "Tip: undgå at teste flere mistænkte fødevarer samme dag.",
  "insights.triggers.title": "Ingredienser der ser ud til at trigge symptomer",
  "insights.triggers.body": "Dagens visning — tryk for fuld log (7d / 14d / 1md / al tid)",
  "insights.triggers.empty": "Ingen triggere logget i dag. Tryk for at se hele historikken.",
  "insights.triggers.cta": "Se hele triggerloggen →",
  "insights.tolerated.title": "Fødevarer du ser ud til at tåle godt",
  "insights.tolerated.body":
    "Whitelistede ingredienser markeres ikke som triggere — selv hvis deres FODMAP-score er høj.",
  "insights.tolerated.placeholder": "Tilføj en ingrediens (fx løg)",
  "insights.tolerated.add": "Tilføj",
  "insights.tolerated.observed": "Observeret fra dine symptomfri måltider:",
  "insights.symptoms.title": "Symptomhyppighed",
  "insights.symptoms.empty": "Ingen symptomer logget endnu — det er flot!",
  "insights.report.title": "Generér rapport til læge / diætist",
  "insights.report.body": "Markdown-resumé du kan downloade eller dele.",
  "insights.foot":
    "Indsigterne er observationelle og ikke en klinisk diagnose. IBS er individuelt — mønstre tager tid at identificere.",

  // Analyzer
  "analyzer.title": "Smart trigger-analyzer",
  "analyzer.subtitle":
    "Scorer mulige sammenhænge mellem mad og symptomer ud fra 10 kriterier: dosis, timing, symptommatch, afføringsdata, confounders, reproducerbarhed mv.",
  "analyzer.minData.title": "Mere data = bedre analyse",
  "analyzer.minData.body":
    "Vi anbefaler mindst 14 dages mad- og symptom-logning, før der drages konklusioner. Lige nu har du {days} dag(e) data og {meals} måltid(er) logget.",
  "analyzer.minData.warn":
    "Mindre end 14 dage — analysen kører, men resultaterne skal ses som vejledende.",
  "analyzer.run": "Kør analyse",
  "analyzer.running": "Analyserer dine data…",
  "analyzer.again": "Kør igen",
  "analyzer.disclaimer":
    "Dette er et mønstergenkendelsesværktøj, ikke en diagnose. Drøft altid fund med en kvalificeret kliniker.",
  "analyzer.empty": "Kør analyzeren for at få personlige hypoteser om mønstre.",
  "analyzer.error": "Analyse mislykkedes. Prøv venligst igen.",
  "analyzer.noData": "Tilføj mindst nogle måltider med symptomer, før du kører analyzeren.",
  "analyzer.confidence": "Konfidens",
  "analyzer.why": "Hvorfor",
  "analyzer.weakens": "Hvad svækker dette",
  "analyzer.next": "Næste bedste skridt",
  "analyzer.dataQuality": "Samlet datakvalitet",
  "analyzer.summary": "Resumé",
  "analyzer.redFlags": "Røde flag bemærket",

  // Settings
  "settings.kicker": "Konto",
  "settings.title": "Indstillinger",
  "settings.lang.title": "Sprog",
  "settings.lang.en": "English",
  "settings.lang.da": "Dansk",

  // Daily log
  "daily.kicker": "Daglig log",
  "daily.title": "Hvordan var din dag?",
  "daily.today": "(i dag)",
  "daily.intro": "Stress, søvn og andre faktorer påvirker ofte IBS-symptomer. At logge dem hjælper med at skelne madtriggere fra confounders.",
  "daily.stress": "Stressniveau",
  "daily.stress.left": "Rolig",
  "daily.stress.right": "Meget stresset",
  "daily.anxiety": "Angst",
  "daily.anxiety.left": "Ingen",
  "daily.anxiety.right": "Høj",
  "daily.sleep": "Søvn",
  "daily.sleep.hours": "Antal timers søvn",
  "daily.sleep.hours.placeholder": "fx 7,5",
  "daily.sleep.quality": "Søvnkvalitet",
  "daily.sleep.quality.left": "Dårlig",
  "daily.sleep.quality.right": "Fremragende",
  "daily.exercise": "Motion (minutter)",
  "daily.exercise.placeholder": "fx 30",
  "daily.factors": "Andre faktorer",
  "daily.factors.alcohol": "Alkohol",
  "daily.factors.caffeine": "Koffein",
  "daily.factors.illness": "Sygdom / infektion",
  "daily.factors.menstrual": "Menstruationscyklus",
  "daily.medication": "Medicin i dag",
  "daily.medication.placeholder": "fx probiotika, krampestillende",
  "daily.notes": "Noter",
  "daily.notes.placeholder": "Andet værd at huske",
  "daily.bm.title": "Afføring",
  "daily.bm.type": "Type",
  "daily.bm.log": "Log en afføring",
  "daily.bm.scale": "Bristol Stool Scale",
  "daily.bm.urgency": "Akut trang",
  "daily.bm.painful": "Smertefuld",
  "daily.bm.incomplete": "Ufuldstændig tømning",
  "daily.bm.relief": "Lettelse bagefter",
  "daily.bm.alarm": "Blod eller slim til stede",
  "daily.bm.alarm.note": "Blod eller slim i afføringen bør vurderes af en læge.",
  "daily.bm.button": "Log afføring",
  "daily.bm.saved": "Afføring logget",
  "daily.bm.tag.urgency": "akut trang",
  "daily.bm.tag.painful": "smertefuld",
  "daily.bm.tag.incomplete": "ufuldstændig",
  "daily.bm.tag.relief": "lettelse bagefter",
  "daily.bm.tag.alarm": "⚠ blod/slim",
  "daily.foot": "Daglige registreringer gemmes på denne enhed. De driver dine trigger-indsigter.",
  "daily.bristol.1": "Adskilte hårde klumper (forstoppelse)",
  "daily.bristol.2": "Klumpet og pølseformet",
  "daily.bristol.3": "Pølseform med revner",
  "daily.bristol.4": "Glat, blød pølse (ideelt)",
  "daily.bristol.5": "Bløde klatter med klare kanter",
  "daily.bristol.6": "Grødet med ujævne kanter",
  "daily.bristol.7": "Helt flydende (diarré)",
};

const dicts: Record<Lang, Dict> = { en, da };

export const useT = () => {
  const [lang, setLangState] = useState<Lang>(() => getLang());

  useEffect(() => {
    const sync = () => setLangState(getLang());
    window.addEventListener("ibs-lang-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ibs-lang-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let str = dicts[lang][key] ?? dicts.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  };

  return { t, lang, setLang: (l: Lang) => setLang(l) };
};
