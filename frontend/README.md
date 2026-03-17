# E-Commerce AI Agent - Frontend

## Übersicht
Ein modernes React Dashboard für die Verwaltung und Optimierung deines E-Commerce Shops.

### Features
- 📊 **Shop-Analyse Dashboard**: Erhalte Erkenntnisse über SEO, UX und Conversion
- 🔍 **Marktforschung**: Analysiere Produktchancen auf Web, eBay und TikTok
- ⚙️ **Konfiguration**: Einfache Einrichtung aller API-Integrationen
- 📱 **Responsive Design**: Vollständig optimiert für Desktop und Mobile
- 🚀 **Modern Stack**: React, Tailwind CSS, Lucide Icons

## Installation

### Voraussetzungen
- Node.js 14+
- npm oder yarn

### Setup

1. **Abhängigkeiten installieren**:
```bash
npm install
```

2. **Umgebungsvariablen konfigurieren** (optional):
```bash
export REACT_APP_API_URL=http://localhost:8000
```

3. **Entwicklungs-Server starten**:
```bash
npm start
```

Die App läuft auf: `http://localhost:3000`

## Seiten

### 1. Shop-Analyse Dashboard
- Gesamtbewertung des Shops
- SEO-Probleme identifizieren
- UX-Verbesserungen
- Revenue-Chancen
- Konkrete Empfehlungen

### 2. Marktforschung
- Web-Nachfrage Schätzung
- eBay Marktanalyse
- TikTok Trend-Score
- Umsatzpotenzial Berechnung
- Marktlücken erkennen

### 3. Einstellungen
- API-Konfigurationsanleitung
- Backend & Frontend Setup
- Umgebungsvariablen

## Technologien

- **React 18**: UI-Framework
- **React Router**: Navigation
- **Axios**: HTTP-Client
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Chart.js / Recharts**: Datenvisualisierung

## Komponenten

```
src/
├── components/
│   ├── ShopAnalysisReport.jsx      # Shop-Analyse Bericht
│   ├── MarketOpportunitiesCard.jsx # Marktchancen Karte
│   └── MarketResearchPanel.jsx     # Marktforschungs- Panel
├── pages/
│   ├── Dashboard.jsx               # Shop-Analyse Seite
│   ├── MarketResearch.jsx          # Marktforschungs-Seite
│   └── Settings.jsx                # Einstellungs-Seite
├── services/
│   └── api.js                      # API-Aufrufe
├── App.jsx                         # Hauptanwendung
└── index.jsx                       # Entry Point
```

## Build für Produktion

```bash
npm run build
```

Die optimierte App wird im `build/` Verzeichnis erstellt.

## Deployment

### Mit Vercel (kostenlos)
```bash
npm install -g vercel
vercel
```

### Mit Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Mit Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Umgebungsvariablen

```
REACT_APP_API_URL=http://localhost:8000
```

## Troubleshooting

### CORS-Fehler
Stelle sicher, dass das Backend die richtige CORS-Konfiguration hat:
```python
# backend/app/main.py
CORS_URLS = ["http://localhost:3000"]
```

### API nicht erreichbar
Prüfe ob der Backend-Server läuft:
```bash
curl http://localhost:8000/api/health
```

### Dependencies Fehler
Lösche node_modules und package-lock.json und installiere neu:
```bash
rm -rf node_modules package-lock.json
npm install
```
