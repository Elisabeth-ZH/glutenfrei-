/* Gluten-Checker – App-Logik
 * OCR (Texterkennung) läuft komplett im Browser via Tesseract.js.
 * Das Foto wird NICHT ins Internet geladen – alles bleibt auf dem Gerät.
 */

// ── DOM-Referenzen ────────────────────────────────────────────────────────
const el = (id) => document.getElementById(id);
const cameraBtn   = el("camera-btn");
const galleryBtn  = el("gallery-btn");
const cameraInput = el("camera-input");
const galleryInput= el("gallery-input");
const preview     = el("preview");
const uploadCard  = el("upload-card");
const statusBox   = el("status");
const statusText  = el("status-text");
const progressFill= el("progress-fill");
const resultBox   = el("result");
const banner      = el("banner");
const bannerIcon  = el("banner-icon");
const bannerHead  = el("banner-headline");
const bannerSub   = el("banner-sub");
const findings    = el("findings");
const ocrTextBox  = el("ocr-text");
const ocrDetails  = el("ocr-details");
const againBtn    = el("again-btn");

// ── Buttons ───────────────────────────────────────────────────────────────
cameraBtn.addEventListener("click", () => cameraInput.click());
galleryBtn.addEventListener("click", () => galleryInput.click());
cameraInput.addEventListener("change", (e) => handleFile(e.target.files[0]));
galleryInput.addEventListener("change", (e) => handleFile(e.target.files[0]));
againBtn.addEventListener("click", resetApp);

// ── Ablauf ──────────────────────────────────────────────────────────────
async function handleFile(file) {
  if (!file) return;

  // Vorschau zeigen
  const url = URL.createObjectURL(file);
  preview.src = url;
  preview.style.display = "block";

  // UI in Lade-Zustand versetzen
  resultBox.style.display = "none";
  statusBox.style.display = "block";
  statusText.textContent = "Ich lese die Zutaten…";
  progressFill.style.width = "5%";

  try {
    const text = await runOCR(file);
    const result = detectGluten(text);
    showResult(result, text);
  } catch (err) {
    console.error(err);
    showError();
  }
}

// ── OCR mit Tesseract.js ──────────────────────────────────────────────────
async function runOCR(file) {
  const { data } = await Tesseract.recognize(file, "deu+eng+fra+ita", {
    logger: (m) => {
      if (m.status === "recognizing text") {
        const pct = Math.round(m.progress * 90) + 10;
        progressFill.style.width = pct + "%";
      } else if (m.status === "loading language traineddata" || m.status === "initializing tesseract") {
        statusText.textContent = "App wird vorbereitet… (beim ersten Mal kurz)";
      }
    },
  });
  return data.text || "";
}

// ── Text normalisieren ─────────────────────────────────────────────────────
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[\n\r]+/g, " ")     // Zeilenumbrüche → Leerzeichen
    .replace(/[·•|]/g, " ")       // Trennzeichen
    .replace(/\s+/g, " ")         // Mehrfach-Leerzeichen
    .trim();
}

// ── Gluten-Erkennung ────────────────────────────────────────────────────────
function detectGluten(rawText) {
  const text = normalize(rawText);

  // 1. "Glutenfrei"-Kennzeichnung? (auf dem Originaltext)
  const glutenFreeLabel = GLUTEN_FREE_LABELS.some((w) => text.includes(w));

  // 2. Nicht-mehrdeutige Vorsicht-Hinweise (z. B. "kann Spuren von Gluten")
  const cautionFound = [];
  const tracePhrases = [];
  for (const entry of CAUTION_INGREDIENTS) {
    if (entry.ambiguous) continue;
    if (entry.words.some((w) => text.includes(w))) {
      cautionFound.push(entry.label);
      tracePhrases.push(...entry.words);
    }
  }

  // 3. Masken-Text: Glutenfrei-Labels und Spuren-Hinweise entfernen,
  //    damit z. B. "gluten free" oder "Spuren von Gluten" NICHT als
  //    glutenhaltige Zutat "Gluten" gezählt werden.
  let masked = " " + text + " ";
  for (const phrase of [...GLUTEN_FREE_LABELS, ...tracePhrases]) {
    masked = masked.split(phrase).join(" ");
  }

  // 4. Sichere Gluten-Zutaten (auf dem maskierten Text)
  const glutenFound = [];
  for (const entry of GLUTEN_INGREDIENTS) {
    if (entry.words.some((w) => masked.includes(w))) {
      glutenFound.push(entry.label);
    }
  }

  // 5. Mehrdeutige Vorsicht-Zutaten (Mehl/Stärke/Hafer)
  for (const entry of CAUTION_INGREDIENTS) {
    if (!entry.ambiguous) continue;
    if (glutenFound.length > 0) continue;   // schon Gluten gefunden → nicht doppelt warnen
    // Nur eigenständiges Wort (matcht NICHT in "weizenmehl"/"reismehl")
    if (entry.words.some((w) => new RegExp("\\b" + escapeRegex(w) + "\\b").test(text))) {
      cautionFound.push(entry.label);
    }
  }

  const noTextFound = text.replace(/[^a-zäöüà-ÿ]/gi, "").length < 8;

  // ── Bewertung ──
  if (noTextFound) {
    return { level: "unknown", glutenFound, cautionFound, glutenFreeLabel };
  }
  if (glutenFound.length > 0 && glutenFreeLabel) {
    return { level: "conflict", glutenFound, cautionFound, glutenFreeLabel };
  }
  if (glutenFound.length > 0) {
    return { level: "gluten", glutenFound, cautionFound, glutenFreeLabel };
  }
  if (glutenFreeLabel) {
    return { level: "free", glutenFound, cautionFound, glutenFreeLabel };
  }
  if (cautionFound.length > 0) {
    return { level: "caution", glutenFound, cautionFound, glutenFreeLabel };
  }
  return { level: "clean", glutenFound, cautionFound, glutenFreeLabel };
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ── Ergebnis anzeigen ───────────────────────────────────────────────────────
function showResult(result, rawText) {
  statusBox.style.display = "none";
  resultBox.style.display = "block";
  findings.innerHTML = "";

  const banners = {
    gluten: {
      cls: "r-red", icon: "⚠️", head: "Enthält Gluten!",
      sub: "Dieses Produkt ist NICHT geeignet.",
    },
    conflict: {
      cls: "r-yellow", icon: "🤔", head: "Bitte genau prüfen",
      sub: "Als glutenfrei gekennzeichnet, aber es wurde eine getreidehaltige Zutat gefunden.",
    },
    caution: {
      cls: "r-yellow", icon: "⚠️", head: "Vorsicht",
      sub: "Es könnte Gluten enthalten sein. Zutatenliste genau lesen!",
    },
    free: {
      cls: "r-green", icon: "✅", head: "Glutenfrei gekennzeichnet",
      sub: "Das Produkt ist als glutenfrei markiert. 🎉",
    },
    clean: {
      cls: "r-green", icon: "🙂", head: "Kein Gluten gefunden",
      sub: "Ich habe keine glutenhaltige Zutat entdeckt – trotzdem sicherheitshalber selbst prüfen.",
    },
    unknown: {
      cls: "r-yellow", icon: "📷", head: "Text nicht lesbar",
      sub: "Ich konnte die Zutaten nicht gut erkennen. Bitte näher und schärfer fotografieren.",
    },
  };

  const b = banners[result.level];
  banner.className = "result-banner " + b.cls;
  bannerIcon.textContent = b.icon;
  bannerHead.textContent = b.head;
  bannerSub.textContent = b.sub;

  // Gefundene Gluten-Zutaten
  if (result.glutenFound.length > 0) {
    findings.innerHTML += `<div class="section-title">Gefundene glutenhaltige Zutaten</div>`;
    const ul = document.createElement("ul");
    ul.className = "found-list";
    result.glutenFound.forEach((label) => {
      ul.innerHTML += `<li>🌾 <span>${label}</span></li>`;
    });
    findings.appendChild(ul);
  }

  // Vorsicht-Hinweise
  if (result.cautionFound.length > 0) {
    findings.innerHTML += `<div class="section-title">Zum Aufpassen</div>`;
    const ul = document.createElement("ul");
    ul.className = "found-list";
    result.cautionFound.forEach((label) => {
      ul.innerHTML += `<li class="warn">👀 <span>${label}</span></li>`;
    });
    findings.appendChild(ul);
  }

  // Glutenfrei-Hinweis bei clean anzeigen
  if (result.level === "free" && result.cautionFound.length === 0) {
    findings.innerHTML += `<div class="section-title">Hinweis</div>
      <ul class="found-list"><li class="warn" style="background:#e8f5ec;color:var(--green-dark)">✅ <span>„glutenfrei" auf der Verpackung erkannt</span></li></ul>`;
  }

  // Erkannten Text zeigen
  ocrTextBox.textContent = rawText.trim() || "(kein Text erkannt)";
  ocrDetails.open = result.level === "unknown";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showError() {
  statusBox.style.display = "none";
  resultBox.style.display = "block";
  findings.innerHTML = "";
  banner.className = "result-banner r-yellow";
  bannerIcon.textContent = "😕";
  bannerHead.textContent = "Etwas ist schiefgelaufen";
  bannerSub.textContent = "Bitte versuche es noch einmal mit einem neuen Foto.";
  ocrTextBox.textContent = "";
}

function resetApp() {
  resultBox.style.display = "none";
  preview.style.display = "none";
  preview.src = "";
  cameraInput.value = "";
  galleryInput.value = "";
  progressFill.style.width = "0%";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
