/*
 * Gluten-Datenbank
 * ----------------
 * Stichwörter, die auf glutenhaltige Zutaten hinweisen.
 * Abgedeckt: Deutsch, Englisch, Französisch, Italienisch
 * (die vier Sprachen, die auf Schweizer Verpackungen üblich sind).
 *
 * Jeder Eintrag hat:
 *   words:  Liste von Suchbegriffen (in Kleinbuchstaben, ohne Umlaut-Sonderfälle)
 *   label:  Klartext-Name, der im Ergebnis angezeigt wird
 */

// ── 1. Sicher glutenhaltige Zutaten (rot) ────────────────────────────────
const GLUTEN_INGREDIENTS = [
  { label: "Weizen",              words: ["weizen", "wheat", "ble", "blé", "frumento", "grano", "froment"] },
  { label: "Weizenmehl",          words: ["weizenmehl", "wheat flour", "farine de ble", "farine de blé", "farina di frumento", "farina di grano"] },
  { label: "Weizenstärke",        words: ["weizenstarke", "weizenstärke", "wheat starch", "amidon de ble", "amido di frumento"] },
  { label: "Weizengluten",        words: ["weizengluten", "wheat gluten", "gluten de ble", "glutine di frumento"] },
  { label: "Weizenkleie",         words: ["weizenkleie", "wheat bran", "son de ble"] },
  { label: "Weizenprotein",       words: ["weizenprotein", "wheat protein", "proteine de ble"] },
  { label: "Weizenkeime",         words: ["weizenkeim", "wheat germ", "germe de ble"] },
  { label: "Hartweizen / Durum",  words: ["hartweizen", "durum", "hartweizengriess", "hartweizengrieß", "semola di grano duro", "ble dur"] },
  { label: "Gerste",              words: ["gerste", "barley", "orge", "orzo"] },
  { label: "Gerstenmalz",         words: ["gerstenmalz", "barley malt", "malt d'orge", "malto d'orzo"] },
  { label: "Roggen",              words: ["roggen", "rye", "seigle", "segale"] },
  { label: "Roggenmehl",          words: ["roggenmehl", "rye flour", "farine de seigle", "farina di segale"] },
  { label: "Dinkel",              words: ["dinkel", "spelt", "spelz", "epeautre", "épeautre", "spelta", "farro"] },
  { label: "Grünkern",            words: ["grunkern", "grünkern"] },
  { label: "Emmer",               words: ["emmer"] },
  { label: "Einkorn",             words: ["einkorn"] },
  { label: "Kamut",               words: ["kamut", "khorasan"] },
  { label: "Triticale",           words: ["triticale"] },
  { label: "Malz / Malzextrakt",  words: ["malz", "malt", "malzextrakt", "malt extract", "extrait de malt", "malzaroma", "maltodextrin aus weizen"] },
  { label: "Gluten",              words: ["gluten", "glutine"] },
  { label: "Seitan",              words: ["seitan"] },
  { label: "Bulgur",              words: ["bulgur", "boulghour"] },
  { label: "Couscous",            words: ["couscous", "kuskus"] },
  { label: "Grieß / Griess",      words: ["griess", "grieß", "semolina", "semoule", "semola"] },
  { label: "Paniermehl / Semmelbrösel", words: ["paniermehl", "semmelbrosel", "semmelbrösel", "breadcrumb", "chapelure", "pangrattato", "panade", "paniert"] },
  { label: "Graham",              words: ["graham"] },
  { label: "Cracker / Brotwaren", words: ["knackebrot", "knäckebrot"] },
  { label: "Bier / Malzbier",     words: ["malzbier"] },
];

// ── 2. Vorsicht: mögliche Spuren / mehrdeutig (gelb) ─────────────────────
// ambiguous:true  → Begriff kann auch glutenfrei sein (z. B. Reismehl).
//                   Wird ausgeblendet, wenn bereits sicher Gluten gefunden wurde,
//                   und nur mit Wortgrenzen gesucht (matcht nicht in "weizenmehl").
const CAUTION_INGREDIENTS = [
  { label: "Kann Spuren von Gluten enthalten",  words: ["spuren von gluten", "spuren von weizen", "may contain gluten", "may contain wheat", "traces de gluten", "traces de ble", "puo contenere glutine", "kann glutenhaltige"] },
  { label: "Hergestellt in Betrieb mit Weizen", words: ["auch weizen verarbeitet", "betrieb, der auch weizen", "betrieb der auch weizen", "spuren von glutenhaltigem getreide", "spuren glutenhaltiger"] },
  { label: "Mehl (Herkunft unklar)",            ambiguous: true, words: ["mehl", "flour", "farine", "farina"] },
  { label: "Stärke (Herkunft unklar)",          ambiguous: true, words: ["starke", "stärke", "starch", "amidon", "amido"] },
  { label: "Hafer (kann verunreinigt sein)",    ambiguous: true, words: ["hafer", "haferflocken", "oat", "avoine", "avena"] },
];

// ── 3. Positiv-Hinweise: ausdrücklich glutenfrei (grün) ──────────────────
const GLUTEN_FREE_LABELS = [
  "glutenfrei", "gluten frei", "gluten-frei", "ohne gluten",
  "gluten free", "gluten-free",
  "sans gluten",
  "senza glutine",
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { GLUTEN_INGREDIENTS, CAUTION_INGREDIENTS, GLUTEN_FREE_LABELS };
}
