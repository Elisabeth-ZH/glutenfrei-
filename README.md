# 🌾🔍 Gluten-Checker

Eine kleine, kinderfreundliche Web-App: Ein Foto von der Verpackung eines
Lebensmittels machen – die App liest die Zutatenliste und sagt, ob **Gluten**
enthalten ist.

Gebaut für ein Kind mit Glutenallergie, damit es beim Einkaufen selbst
schnell prüfen kann.

## So funktioniert es

1. **Foto machen** oder ein Bild aus der Galerie auswählen.
2. Die App liest den Text auf der Verpackung per **Texterkennung (OCR)**.
3. Der erkannte Text wird gegen eine Datenbank glutenhaltiger Zutaten geprüft
   (Deutsch, Englisch, Französisch, Italienisch).
4. Ergebnis:
   - 🔴 **Enthält Gluten** – eine glutenhaltige Zutat wurde gefunden.
   - 🟡 **Vorsicht** – mögliche Spuren oder unklare Zutat (z. B. „Mehl", „Hafer").
   - 🟢 **Glutenfrei / kein Gluten gefunden**.

### Datenschutz
Die Texterkennung läuft **komplett im Browser** (Tesseract.js). Das Foto wird
**nicht** ins Internet hochgeladen und verlässt das Gerät nicht.

## Wichtiger Hinweis ⚠️
Diese App ist eine **Hilfe**, aber **kein Ersatz** für das genaue Lesen der
Verpackung. Die Texterkennung kann Fehler machen oder Text übersehen. Bei
Unsicherheit immer die Zutatenliste selbst prüfen oder einen Erwachsenen fragen.
Sie ist kein medizinisches Gerät.

## Benutzen / Starten

Es ist eine reine statische Web-App – kein Server, kein Build nötig.

**Am einfachsten (auf dem Handy nutzbar): über GitHub Pages**

1. Im GitHub-Repo: **Settings → Pages**
2. Bei „Build and deployment" → Source: **Deploy from a branch**
3. Branch **`main`** wählen und Ordner `/ (root)` → **Save**
4. Nach kurzer Zeit ist die App unter der angezeigten URL erreichbar
   (etwa `https://elisabeth-zh.github.io/glutenfrei-/`).
   Diese Adresse auf dem Handy öffnen und über „Zum Startbildschirm hinzufügen"
   wie eine echte App speichern.

**Lokal testen**

Einfach `index.html` im Browser öffnen. (Für die Kamerafunktion auf dem Handy
wird `https` benötigt – daher ist GitHub Pages der beste Weg.)

## Dateien
| Datei | Zweck |
|-------|-------|
| `index.html` | Oberfläche der App |
| `app.js` | Foto-Verarbeitung, Texterkennung, Auswertung |
| `gluten-data.js` | Datenbank der glutenhaltigen Zutaten (mehrsprachig) |
| `manifest.json` | Ermöglicht „Zum Startbildschirm hinzufügen" |

## Datenbank erweitern
Neue Zutaten oder Sprachen lassen sich einfach in `gluten-data.js` ergänzen –
je ein Eintrag mit `label` (Anzeigename) und `words` (Suchbegriffe in
Kleinbuchstaben).
