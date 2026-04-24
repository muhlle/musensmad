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
};

const da: Dict = {
  // Nav
  "nav.home": "Hjem",
  "nav.history": "Historik",
  "nav.add": "Tilføj",
  "nav.daily": "Daglig",
  "nav.insights": "Indsigt",

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
