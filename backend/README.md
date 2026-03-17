# E-Commerce AI Agent - Backend

## Übersicht
Dieser Backend-Service bietet REST-APIs für:
- **Shop-Analyse**: SEO, UX, Conversion-Optimierung
- **Marktforschung**: Produkttrendanalyse auf eBay und TikTok
- **Produktempfehlungen**: Intelligente Produktvorschläge
- **Komplementäre Produkte**: Cross-Selling-Möglichkeiten

## Setup

### Voraussetzungen
- Python 3.10+
- pip

### Installation

1. **Abhängigkeiten installieren**:
```bash
pip install -r requirements.txt
```

2. **Umgebungsvariablen einrichten**:
```bash
cp .env.example .env
# Bearbeite .env und füge deine API Keys ein
```

3. **Server starten**:
```bash
python main.py
```

Der Server läuft dann auf: `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Shop vollständig analysieren
```
POST /api/analyze-shop?store_type=shopify
```

Response:
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "shop_url": "your-store.myshopify.com",
  "overall_score": 75,
  "performance_metrics": {...},
  "seo_issues": [...],
  "ux_issues": [...],
  "revenue_opportunities": [...],
  "recommendations": [...]
}
```

### Marktchancen analysieren
```
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
  "market_gaps": [...]
}
```

## Integration mit E-Commerce Plattformen

### Shopify
- API Key: Erstelle einen privaten App in Shopify Admin
- Store URL: Format: `your-store.myshopify.com`

### WooCommerce
- API Key & Secret: Konfiguriere in WooCommerce > Settings > Advanced > REST API
- Store URL: Deine WordPress Installation URL

### eBay
- Benötigt eBay Developer Account und App

### TikTok
- Benötigt TikTok Business Account und API Access

## Architektur

```
backend/
├── app/
│   ├── agents/           # AI Agent Logik
│   ├── services/         # API Service Wrapper
│   ├── models/           # Datenmodelle
│   ├── routes/           # API Routes
│   └── utils/            # Hilfsfunktionen
├── main.py              # FastAPI Application
├── config.py            # Konfiguration
└── requirements.txt     # Python Abhängigkeiten
```

## Features

### 1. Shop-Analyse
- SEO Score pro Produkt und Shop
- UX Probleme identifizieren
- Konversionspotenzial berechnen
- Spezifische Optimierungsempfehlungen

### 2. Produktentdeckung
- Web-Demand Schätzung
- eBay Marktanalyse
- TikTok Trendanalyse
- Umsatzpotenzial Berechnung

### 3. Produktempfehlungen
- Komplementäre Produkte vorschlagen
- Cross-Selling Möglichkeiten
- Preisoptimierungen
- Inventarverwaltung

## Entwicklung

### Debug-Modus
```bash
DEBUG=True python main.py
```

### Tests
```bash
pytest tests/
```

## Deployment

### Mit Docker
```bash
docker build -t ecommerce-ai-agent .
docker run -p 8000:8000 ecommerce-ai-agent
```

### Mit Heroku
```bash
heroku create your-app-name
git push heroku main
```
