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

  // FODMAP badge
  "fodmap.low": "Low FODMAP",
  "fodmap.moderate": "Moderate FODMAP",
  "fodmap.high": "High FODMAP",
  "fodmap.unknown": "FODMAP unknown",

  // Symptom severity
  "severity.none": "No symptoms",
  "severity.mild": "Mild",
  "severity.moderate": "Moderate",
  "severity.severe": "Severe",

  // Symptom types (display labels — internal values stay English)
  "symptom.bloating": "bloating",
  "symptom.abdominal pain": "abdominal pain",
  "symptom.cramps": "cramps",
  "symptom.gas": "gas",
  "symptom.diarrhea": "diarrhea",
  "symptom.constipation": "constipation",
  "symptom.nausea": "nausea",
  "symptom.urgency": "urgency",

  // AI confidence
  "confidence.low": "low",
  "confidence.medium": "medium",
  "confidence.high": "high",

  // Settings (extra)
  "settings.account.anonymous": "Anonymous account",
  "settings.account.signedIn": "Signed in",
  "settings.account.localOnly": "Local-only device",
  "settings.account.signInHint": "Sign in with Google to keep your meal history safe across devices.",
  "settings.signInGoogle": "Sign in with Google",
  "settings.signOut": "Sign out",
  "settings.signedInToast": "Signed in with Google",
  "settings.signedOutToast": "Signed out",
  "settings.signInError": "Couldn't sign in with Google",
  "settings.signOutError": "Couldn't sign out",
  "settings.replayOnboarding": "Replay onboarding",
  "settings.deleteAll": "Delete all my data",
  "settings.deleteConfirm": "Delete ALL your meal data? This cannot be undone.",
  "settings.deleteError": "Couldn't delete data",
  "settings.deleteSuccess": "All data deleted",
  "settings.disclaimer.title": "Important disclaimer",
  "settings.disclaimer.body": "This app is a personal tracking tool. It does {not} provide medical diagnosis, treatment, or advice. Estimates based on photos and descriptions can be inaccurate. Always consult a qualified healthcare professional for any IBS-related concerns.",
  "settings.disclaimer.not": "not",
  "settings.about.title": "About FODMAPs",
  "settings.about.body": "FODMAPs are short-chain carbohydrates that can trigger IBS symptoms. The low-FODMAP approach is one widely studied dietary tool. Your individual tolerance may vary.",

  // Triggers log
  "triggers.kicker": "Trigger log",
  "triggers.title": "Ingredients you've reacted to",
  "triggers.range.7d": "7 days",
  "triggers.range.14d": "14 days",
  "triggers.range.1m": "Last month",
  "triggers.range.all": "All time",
  "triggers.intro": "Tagged from meals where you logged symptoms. FODMAP scores are general — your reactions are personal.",
  "triggers.empty.title": "No triggers in this period",
  "triggers.empty.allBody": "Log meals with symptoms to start building your trigger profile.",
  "triggers.empty.body": "Try a longer period — or great news, no reactions here!",
  "triggers.tolerated": "tolerated",
  "triggers.reacted.one": "Reacted 1 time",
  "triggers.reacted.many": "Reacted {count} times",
  "triggers.unmark": "Unmark",
  "triggers.tolerate": "I tolerate it",
  "triggers.toleratedToast": "\"{item}\" marked as tolerated",
  "triggers.untoleratedToast": "Removed \"{item}\" from tolerated list",
  "triggers.viewMeals.one": "View 1 meal",
  "triggers.viewMeals.many": "View {count} meals",
  "triggers.foot": "Observational tracking only — not a clinical diagnosis.",

  // Report
  "report.kicker": "Summary",
  "report.title": "Report for doctor / dietitian",
  "report.intro": "Share this overview with your healthcare provider. It includes meal trends, suspected triggers, bowel movements and lifestyle averages — all observational, not diagnostic.",
  "report.download": "Download (.md)",
  "report.copy": "Copy",
  "report.copied": "Copied",
  "report.copiedToast": "Copied to clipboard",
  "report.copyError": "Couldn't copy",
  "report.downloaded": "Report downloaded",
  "report.preview": "Preview",
  "report.foot": "Report is generated locally — no data leaves your device unless you share it.",

  // AddMeal
  "add.kicker": "New entry",
  "add.title": "Add a meal",
  "add.photo.cta": "Take or upload a photo",
  "add.photo.hint": "Optional, but improves accuracy",
  "add.photo.alt": "meal preview",
  "add.photo.remove": "Remove photo",
  "add.photo.tooLarge": "Photo too large (max 5 MB)",
  "add.photo.uploadError": "Couldn't upload photo",
  "add.desc.label": "Description",
  "add.desc.optional": "(optional)",
  "add.desc.placeholder": "E.g. lentil curry with rice and yogurt",
  "add.ing.label": "Ingredients",
  "add.ing.optional": "(optional, improves accuracy)",
  "add.ing.placeholder": "Add ingredient",
  "add.ing.tooLong": "Ingredient too long",
  "add.ing.remove": "Remove {item}",
  "add.needInput": "Add a photo or a description first",
  "add.sessionLoading": "Setting up your session — try again in a moment",
  "add.analysisFailed": "Analysis failed",
  "add.saveError": "Couldn't save meal",
  "add.cta.analyzing": "Analyzing meal…",
  "add.cta.analyze": "Analyze meal",
  "add.disclaimer": "Estimates may be imperfect. Not medical advice.",

  // EditMeal
  "edit.title": "Edit meal",
  "edit.field.title": "Title",
  "edit.field.description": "Description",
  "edit.field.ingredients": "Ingredients",
  "edit.titleRequired": "Title is required",
  "edit.savedToast": "Meal updated",
  "edit.saveError": "Couldn't save",
  "edit.fodmapNote": "The FODMAP level is set by the analysis and can't be edited here.",
  "edit.save": "Save changes",

  // SymptomLog
  "symptomLog.kicker": "Symptom log",
  "symptomLog.feeling": "How are you feeling?",
  "symptomLog.which": "Which symptoms?",
  "symptomLog.started": "When did symptoms start?",
  "symptomLog.notes": "Notes",
  "symptomLog.notes.optional": "(optional)",
  "symptomLog.notes.placeholder": "Anything else to remember",
  "symptomLog.save": "Save symptoms",
  "symptomLog.savedToast": "Symptoms saved",
  "symptomLog.saveError": "Couldn't save",

  // Onboarding
  "onboarding.welcome": "Welcome",
  "onboarding.headlinePart1": "Understand what your gut",
  "onboarding.headlineHighlight": "really",
  "onboarding.headlinePart2": "tolerates.",
  "onboarding.intro": "Track meals with photos, get instant insights on FODMAPs and possible IBS triggers, and spot patterns over time.",
  "onboarding.f1.title": "Snap or describe a meal",
  "onboarding.f1.body": "We'll identify the dish and likely ingredients.",
  "onboarding.f2.title": "FODMAP & symptom insights",
  "onboarding.f2.body": "Evidence-based and anecdotal info, side by side.",
  "onboarding.f3.title": "Log symptoms in seconds",
  "onboarding.f3.body": "Add or update reactions, even hours later.",
  "onboarding.important": "Important:",
  "onboarding.disclaimer": "This app does not provide medical diagnosis or treatment. Estimates can be imperfect — especially when analyzing food from images. Always consult a qualified healthcare professional.",
  "onboarding.cta": "I understand — let's start",

  // Common
  "common.back": "Back",
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

  // FODMAP badge
  "fodmap.low": "Lav FODMAP",
  "fodmap.moderate": "Moderat FODMAP",
  "fodmap.high": "Høj FODMAP",
  "fodmap.unknown": "FODMAP ukendt",

  // Symptom severity
  "severity.none": "Ingen symptomer",
  "severity.mild": "Milde",
  "severity.moderate": "Moderate",
  "severity.severe": "Svære",

  // Symptom types (display labels)
  "symptom.bloating": "oppustethed",
  "symptom.abdominal pain": "mavesmerter",
  "symptom.cramps": "kramper",
  "symptom.gas": "luft i maven",
  "symptom.diarrhea": "diarré",
  "symptom.constipation": "forstoppelse",
  "symptom.nausea": "kvalme",
  "symptom.urgency": "akut afføringstrang",

  // AI confidence
  "confidence.low": "lav",
  "confidence.medium": "middel",
  "confidence.high": "høj",

  // Settings (extra)
  "settings.account.anonymous": "Anonym konto",
  "settings.account.signedIn": "Logget ind",
  "settings.account.localOnly": "Kun på denne enhed",
  "settings.account.signInHint": "Log ind med Google for at gemme din måltidshistorik på tværs af enheder.",
  "settings.signInGoogle": "Log ind med Google",
  "settings.signOut": "Log ud",
  "settings.signedInToast": "Logget ind med Google",
  "settings.signedOutToast": "Logget ud",
  "settings.signInError": "Kunne ikke logge ind med Google",
  "settings.signOutError": "Kunne ikke logge ud",
  "settings.replayOnboarding": "Vis introduktion igen",
  "settings.deleteAll": "Slet alle mine data",
  "settings.deleteConfirm": "Slet ALLE dine måltidsdata? Det kan ikke fortrydes.",
  "settings.deleteError": "Kunne ikke slette data",
  "settings.deleteSuccess": "Alle data slettet",
  "settings.disclaimer.title": "Vigtig disclaimer",
  "settings.disclaimer.body": "Denne app er et personligt værktøj til registrering. Den giver {not} medicinsk diagnose, behandling eller rådgivning. Estimater baseret på billeder og beskrivelser kan være upræcise. Konsultér altid en kvalificeret sundhedsprofessionel ved IBS-relaterede bekymringer.",
  "settings.disclaimer.not": "ikke",
  "settings.about.title": "Om FODMAPs",
  "settings.about.body": "FODMAPs er kortkædede kulhydrater, som kan udløse IBS-symptomer. Lav-FODMAP-tilgangen er ét af de mest studerede kostværktøjer. Din individuelle tolerance kan variere.",

  // Triggers log
  "triggers.kicker": "Triggerlog",
  "triggers.title": "Ingredienser du har reageret på",
  "triggers.range.7d": "7 dage",
  "triggers.range.14d": "14 dage",
  "triggers.range.1m": "Sidste måned",
  "triggers.range.all": "Al tid",
  "triggers.intro": "Tagget fra måltider, hvor du har logget symptomer. FODMAP-scorer er generelle — dine reaktioner er personlige.",
  "triggers.empty.title": "Ingen triggere i denne periode",
  "triggers.empty.allBody": "Log måltider med symptomer for at opbygge din triggerprofil.",
  "triggers.empty.body": "Prøv en længere periode — eller godt nyt, ingen reaktioner her!",
  "triggers.tolerated": "tåles",
  "triggers.reacted.one": "Reagerede 1 gang",
  "triggers.reacted.many": "Reagerede {count} gange",
  "triggers.unmark": "Fjern markering",
  "triggers.tolerate": "Jeg tåler det",
  "triggers.toleratedToast": "\"{item}\" markeret som tålt",
  "triggers.untoleratedToast": "Fjernede \"{item}\" fra tålte",
  "triggers.viewMeals.one": "Se 1 måltid",
  "triggers.viewMeals.many": "Se {count} måltider",
  "triggers.foot": "Kun observationel tracking — ikke en klinisk diagnose.",

  // Report
  "report.kicker": "Resumé",
  "report.title": "Rapport til læge / diætist",
  "report.intro": "Del dette overblik med din sundhedsprofessionelle. Det indeholder måltidsmønstre, mistænkte triggere, afføring og livsstilsgennemsnit — alt observationelt, ikke diagnostisk.",
  "report.download": "Download (.md)",
  "report.copy": "Kopiér",
  "report.copied": "Kopieret",
  "report.copiedToast": "Kopieret til udklipsholder",
  "report.copyError": "Kunne ikke kopiere",
  "report.downloaded": "Rapport downloadet",
  "report.preview": "Forhåndsvisning",
  "report.foot": "Rapporten genereres lokalt — ingen data forlader din enhed, medmindre du deler den.",

  // AddMeal
  "add.kicker": "Ny registrering",
  "add.title": "Tilføj et måltid",
  "add.photo.cta": "Tag eller upload et billede",
  "add.photo.hint": "Valgfrit, men forbedrer nøjagtigheden",
  "add.photo.alt": "forhåndsvisning af måltid",
  "add.photo.remove": "Fjern billede",
  "add.photo.tooLarge": "Billede for stort (maks. 5 MB)",
  "add.photo.uploadError": "Kunne ikke uploade billede",
  "add.desc.label": "Beskrivelse",
  "add.desc.optional": "(valgfri)",
  "add.desc.placeholder": "Fx linsecurry med ris og yoghurt",
  "add.ing.label": "Ingredienser",
  "add.ing.optional": "(valgfri, forbedrer nøjagtigheden)",
  "add.ing.placeholder": "Tilføj ingrediens",
  "add.ing.tooLong": "Ingrediens er for lang",
  "add.ing.remove": "Fjern {item}",
  "add.needInput": "Tilføj et billede eller en beskrivelse først",
  "add.sessionLoading": "Opsætter din session — prøv igen om et øjeblik",
  "add.analysisFailed": "Analyse mislykkedes",
  "add.saveError": "Kunne ikke gemme måltid",
  "add.cta.analyzing": "Analyserer måltid…",
  "add.cta.analyze": "Analysér måltid",
  "add.disclaimer": "Estimater kan være upræcise. Ikke medicinsk rådgivning.",

  // EditMeal
  "edit.title": "Redigér måltid",
  "edit.field.title": "Titel",
  "edit.field.description": "Beskrivelse",
  "edit.field.ingredients": "Ingredienser",
  "edit.titleRequired": "Titel er påkrævet",
  "edit.savedToast": "Måltid opdateret",
  "edit.saveError": "Kunne ikke gemme",
  "edit.fodmapNote": "FODMAP-niveauet sættes af analysen og kan ikke redigeres her.",
  "edit.save": "Gem ændringer",

  // SymptomLog
  "symptomLog.kicker": "Symptomlog",
  "symptomLog.feeling": "Hvordan har du det?",
  "symptomLog.which": "Hvilke symptomer?",
  "symptomLog.started": "Hvornår startede symptomerne?",
  "symptomLog.notes": "Noter",
  "symptomLog.notes.optional": "(valgfri)",
  "symptomLog.notes.placeholder": "Andet værd at huske",
  "symptomLog.save": "Gem symptomer",
  "symptomLog.savedToast": "Symptomer gemt",
  "symptomLog.saveError": "Kunne ikke gemme",

  // Onboarding
  "onboarding.welcome": "Velkommen",
  "onboarding.headlinePart1": "Forstå hvad din mave",
  "onboarding.headlineHighlight": "virkelig",
  "onboarding.headlinePart2": "tåler.",
  "onboarding.intro": "Track måltider med billeder, få øjeblikkelige indsigter om FODMAPs og mulige IBS-triggere, og se mønstre over tid.",
  "onboarding.f1.title": "Tag billede eller beskriv et måltid",
  "onboarding.f1.body": "Vi identificerer retten og de sandsynlige ingredienser.",
  "onboarding.f2.title": "FODMAP & symptom-indsigter",
  "onboarding.f2.body": "Evidensbaseret og anekdotisk info side om side.",
  "onboarding.f3.title": "Log symptomer på sekunder",
  "onboarding.f3.body": "Tilføj eller opdatér reaktioner — også flere timer senere.",
  "onboarding.important": "Vigtigt:",
  "onboarding.disclaimer": "Denne app stiller ikke medicinske diagnoser eller behandling. Estimater kan være upræcise — særligt ved analyse af mad fra billeder. Konsultér altid en kvalificeret sundhedsprofessionel.",
  "onboarding.cta": "Forstået — lad os starte",

  // Common
  "common.back": "Tilbage",
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
