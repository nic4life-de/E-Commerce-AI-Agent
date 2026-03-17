# E-Commerce AI Agent - Quick Start Guide 🚀

Ein vollständig funktionsfähiger **AI Agent zur Optimierung deines E-Commerce Shops** mit automatischer Analyse von Fehlern, UX, SEO und Produktentdeckung.

## 📋 Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [Funktionen](#funktionen)
- [Installation](#installation)
- [Erste Schritte](#erste-schritte)
- [API Dokumentation](#api-dokumentation)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Übersicht

Der **E-Commerce AI Agent** automatisiert die Shop-Optimierung durch:

1. **Shop-Analyse**: Identifiziert SEO, UX und Conversion-Probleme
2. **Produktentdeckung**: Findet neue Produkte und deren Marktpotenzial
3. **Intelligente Empfehlungen**: Schlägt komplementäre Produkte vor
4. **Marktforschung**: Analysiert Trends auf Web, eBay und TikTok

---

## ✨ Funktionen

### 1. Automatische Shop-Analyse
- **SEO-Audits**: Prüft Titel, Beschreibungen, Meta-Tags
- **UX-Verbesserungen**: Identifiziert Navigation, Kategorisierung Probleme
- **Konversionsoptimierung**: Findet High-Potential Produkte
- **Konkrete Empfehlungen**: Priorisierte Action Items

### 2. Fehlerdiagnose-Engine
- Kritische Fehler: Fehlende Bilder, Preise, Beschreibungen
- Priorisierter Action Plan (Woche 1, 2, 3 Phasen)
- Impact-Schätzung für jede Optimierung
- Quick Wins: Die schnellsten Verbesserungen zuerst

### 3. Intelligente Produktempfehlungen
- Automatische Kategorisierung
- Komplementäre Produkte basierend auf Regeln
- Bundle-Generierung mit Rabattberechnung
- Preis-Komplementarität-Analyse

### 4. Marktforschung
- **Web-Demand**: Suchvolumen schätzen
- **eBay Analysis**: Konkurrenzpreise, Listings-Anzahl
- **TikTok Trends**: Viralitäts-Score, Erwähnungen
- **Revenue Potential**: Umsatz-Prognosen

---

## 🛠️ Installation

### Option 1: Mit Docker (Empfohlen) 🐳

#### Voraussetzungen
- Docker Desktop installiert
- Git

#### Setup (< 5 Minuten)

```bash
# Repository klonen
git clone https://github.com/your-repo/E-Commerce-AI-Agent.git
cd E-Commerce-AI-Agent

# Umgebungsvariablen generieren
cp backend/.env.example backend/.env

# API Keys in backend/.env eintragen
# SHOPIFY_API_KEY=...
# SHOPIFY_STORE_URL=...
# etc.

# Docker Compose starten
docker-compose up
```

Die App läuft dann auf:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

### Option 2: Lokal ohne Docker

#### Voraussetzungen
- Python 3.10+
- Node.js 14+
- pip & npm

#### Backend Setup

```bash
cd backend

# Virtual Environment erstellen
python -m venv venv

# Aktivieren
./venv/Scripts/activate

# Dependencies installieren
pip install -r requirements.txt

# Umgebungsvariablen
cp .env.example .env
# Bearbeite .env und füge API Keys ein

# Server starten
python main.py
```

Backend läuft auf: `http://localhost:8000`

#### Frontend Setup

```bash
cd frontend

# Dependencies installieren
npm install

# Tailwind CSS build
npm run build:css

# Frontend starten
npm start
```

Frontend läuft auf: `http://localhost:3000`

---

## 🚀 Erste Schritte

### Schritt 1: API Keys konfigurieren

Bearbeite `backend/.env`:

```env
# Shopify (oder WooCommerce)
SHOPIFY_API_KEY=sk_live_xxxxx
SHOPIFY_STORE_URL=my-store.myshopify.com

# eBay
EBAY_API_KEY=xxxxx

# TikTok
TIKTOK_API_KEY=xxxxx
```

### Schritt 2: Dashboard öffnen

1. Öffne http://localhost:3000
2. Gehe zum "Shop-Analyse Dashboard"
3. Wähle deine Shop-Plattform (Shopify/WooCommerce)
4. Klicke "Shop analysieren"

### Schritt 3: Marktforschung

1. Gehe zum "Marktforschung" Tab
2. Gib ein Produkt-Schlüsselwort ein (z.B. "Wireless Headphones")
3. Klicke "Analysieren"
4. Erhalte detaillierte Marktanalyse mit Umsatzpotenzial

### Schritt 4: Aktionsplan implementieren

1. Beachte die priorisierten Empfehlungen
2. Implementiere "Quick Wins" erste (Niedrig-Aufwand)
3. Expected Impact: +20-30% Traffic & Conversions

---

## 📊 API Dokumentation

### Health Check

```bash
GET /api/health
```

Response:
```json
{"status": "ok", "message": "E-Commerce AI Agent is running"}
```

### Shop-Analyse

```bash
POST /api/analyze-shop?store_type=shopify
```

Response:
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "overall_score": 75,
  "performance_metrics": {
    "total_products": 150,
    "with_descriptions": 120,
    "with_images": 140,
    "available_products": 145
  },
  "seo_issues": [...],
  "ux_issues": [...],
  "revenue_opportunities": [...],
  "recommendations": [
    {
      "category": "SEO",
      "priority": "high",
      "issue": "...",
      "action": "...",
      "estimated_impact": "+20-30% organischer Traffic"
    }
  ]
}
```

### Marktforschung

```bash
POST /api/market-opportunities?product_keyword=laptop
```

Response:
```json
{
  "product_id": "laptop",
  "product_name": "laptop",
  "web_demand": 10000,
  "ebay_listings": 1500,
  "ebay_avg_price": 899.99,
  "ebay_demand_trend": "up",
  "tiktok_mentions": 50000,
  "tiktok_trend_score": 75,
  "potential_revenue": 45000,
  "market_gaps": [
    "Geringe Konkurrenz auf eBay - Nischenchance",
    "Hohes TikTok-Interesse - Trend-Potenzial"
  ]
}
```

---

## 🏗️ Architektur

```
E-Commerce-AI-Agent/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── ecommerce_agent.py      # Haupt-Agent
│   │   │   ├── error_diagnosis.py      # Fehlerdiagnose
│   │   │   ├── recommendation_engine.py # Empfehlungen
│   │   │   └── integrations.py         # Extensions
│   │   ├── services/
│   │   │   ├── shopify.py
│   │   │   ├── woocommerce.py
│   │   │   ├── ebay.py
│   │   │   └── tiktok.py
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── main.py                         # FastAPI App
│   ├── config.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ShopAnalysisReport.jsx
│   │   │   ├── MarketOpportunitiesCard.jsx
│   │   │   └── MarketResearchPanel.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MarketResearch.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
│
├── docker-compose.yml
└── README.md (Dies ist die Datei)
```

---

## 🔧 Konfiguration

### Backend (.env)

```env
# APIs
OPENAI_API_KEY=sk_...
SHOPIFY_API_KEY=shppa_...
SHOPIFY_STORE_URL=my-store.myshopify.com
WOOCOMMERCE_API_KEY=ck_...
WOOCOMMERCE_API_SECRET=cs_...
WOOCOMMERCE_STORE_URL=https://my-store.com
EBAY_API_KEY=...
TIKTOK_API_KEY=...

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=False

# Database
DATABASE_URL=sqlite:///./shop_agent.db

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 📈 Typical Workflow

### Woche 1: Analyse & Quick Wins
1. Shop-Analyse durchführen
2. Critical Issues beheben (Bilder, Preise, Beschreibungen)
3. Expected Impact: +15-25% Conversions

### Woche 2-3: Performance
1. SEO-Optimierung (Titel, Meta-Tags)
2. Modale und UX-Verbesserungen
3. Expected Impact: +10-15% Traffic

### Monat 2+: Growth
1. Neue Produkte entdecken (Marktforschung)
2. Cross-Selling Strategien
3. Influencer/TikTok Kampagnen
4. Expected Impact: +20-30% Revenue

---

## 🐛 Troubleshooting

### Problem: CORS-Fehler
**Lösung**: Überprüfe `FRONTEND_URL` in `backend/.env`

```env
FRONTEND_URL=http://localhost:3000
```

### Problem: API nicht erreichbar
**Überprüfe**:
```bash
curl http://localhost:8000/api/health
```

### Problem: Docker Port bereits in Verwendung
**Lösung**:
```bash
# Port ändern in docker-compose.yml
# ports:
#   - "8001:8000"  (neue Port)
docker-compose down
docker-compose up
```

### Problem: Dependencies Fehler

```bash
# Backend
cd backend
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt --force-reinstall

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support & FAQ

**F: Wie verbinde ich mein Shopify Store?**
A: Gehe zu Shopify Admin → Apps → Custom Apps → API Credentials. Generiere einen Token und trage ihn in `.env` ein.

**F: Welche Daten wird der Agent sammeln?**
A: Nur Produktdaten (Titel, Beschreibung, Preis, Bilder). Keine Kundendaten.

**F: Wie oft sollte Ich die Analyse durchführen?**
A: Mindestens wöchentlich für laufende Optimierungen, täglich wenn du schnelle Änderungen machst.

**F: Kann ich die Empfehlungen manuell anpassen?**
A: Ja, alle Empfehlungen sind im Backend konfigurierbar (`complement_rules` in `recommendation_engine.py`).

---

## 📄 Lizenz

MIT License - Für kommerzielle Nutzung verfügbar

---

## 🚀 Next Steps

1. ✅ Installation & Setup abschließen
2. ✅ API Keys konfigurieren  
3. ✅ Erste Shop-Analyse durchführen
4. ✅ Marktforschung für neue Produkte
5. ✅ Implementiere Top 3 Empfehlungen
6. ✅ Messe Impact & Optimiere weiter

---

**Viel Erfolg bei der Optimierung deines Shops! 🎉**
