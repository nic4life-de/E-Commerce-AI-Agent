# Backend API Endpoints Documentation

## Neue API Endpoints für erweiterte Analysen

Alle Endpoints sind in der `routes/advanced.py` Datei implementiert.

---

## 1. SEO-Analyse (Detailed)

### Endpoint
```
POST /api/advanced/detailed-seo-analysis
```

### Beschreibung
Führt eine detaillierte SEO-Analyse eines Produkts durch mit spezifischen Empfehlungen für:
- Meta-Tags (Title, Description)
- Content-Struktur
- Keywords
- Links
- Schema Markup

### Request Body
```json
{
  "product_id": "prod_12345",
  "title": "Wireless Bluetooth Earbuds Pro Max",
  "description": "High-quality wireless earbuds with noise cancellation and 24h battery life",
  "category": "electronics",
  "price": 129.99,
  "current_meta": "Wireless Earbuds",
  "current_content": "Our premium wireless earbuds..."
}
```

### Response
```json
{
  "analysis": {
    "overall_seo_score": 78,
    "title": {
      "score": 85,
      "current_title": "Wireless Bluetooth Earbuds Pro Max",
      "current_title_length": 33,
      "optimized_title": "Best Wireless Bluetooth Earbuds Pro Max 2024 - Noise Cancellation",
      "optimized_title_length": 61,
      "issues": [
        "Title könnte 5-10 Zeichen länger sein (ideal: 50-60)"
      ],
      "recommendations": [
        "Füge das Modifierword '' hinzu",
        "Verwende spezifische Keywords wie 'Advanced', 'Premium', 'Professional'",
        "Include eine Nummer (2024, bestseller rating)"
      ]
    },
    "meta": {
      "score": 72,
      "current_meta": "Wireless Earbuds",
      "current_meta_length": 17,
      "optimized_meta": "Premium Wireless Earbuds with ANC & 24h Battery. Top-rated for sound quality. Free shipping!",
      "optimized_meta_length": 87,
      "has_cta": false,
      "recommendations": [
        "Erweitern Sie um Call-to-Action (z.B. 'Jetzt kaufen')",
        "Verwenden Sie actionorientierte Worte"
      ]
    },
    "content": {
      "score": 65,
      "word_count": 245,
      "has_h1": true,
      "h1_count": 1,
      "has_h2": false,
      "h2_count": 0,
      "has_lists": false,
      "keyword_density": 2.1,
      "recommendations": [
        "Erhöhen Sie Word-Count auf min. 300 Wörter",
        "Fügen Sie 2-3 H2-Überschriften hinzu",
        "Verwenden Sie Bullet Points für Features"
      ]
    },
    "keywords": {
      "score": 82,
      "detected_keywords": [
        {"keyword": "wireless earbuds", "count": 5, "density": 2.0},
        {"keyword": "bluetooth", "count": 3, "density": 1.2},
        {"keyword": "noise cancellation", "count": 2, "density": 0.8}
      ],
      "high_value_keywords": [
        "best wireless earbuds",
        "noise cancelling earbuds",
        "long battery life",
        "professional grade sound"
      ],
      "recommendations": [
        "Fokussiere auf 5-7 High-Value Keywords",
        "Variiere mit Long-Tail Keywords"
      ]
    },
    "links": {
      "score": 58,
      "internal_links": 3,
      "external_links": 0,
      "recommendations": [
        "Fügen Sie 2-3 relevante externe Links hinzu",
        "Verbinden Sie zu ähnlichen Produkten intern"
      ]
    },
    "structured_data": {
      "score": 0,
      "has_json_ld": false,
      "has_product_schema": false,
      "has_price_schema": false,
      "has_rating_schema": false,
      "recommendations": [
        "Implementieren Sie Product JSON-LD Schema",
        "Fügen Sie Price und Rating Schema ein"
      ]
    },
    "recommendations": [
      {
        "priority": "critical",
        "issue": "Meta-Description zu kurz",
        "description": "Die Meta-Description ist nur 17 Zeichen statt ideal 150-160",
        "action": "Verwenden Sie: 'Premium Wireless Earbuds mit ANC & 24h Akku. Top-bewertet für Soundqualität. Versand frei!'"
      },
      {
        "priority": "high",
        "issue": "Content zu kurz",
        "description": "245 Wörter statt ideal 300-500",
        "action": "Erweitern Sie Produktbeschreibung mit Features, Benefits, Technical Specs"
      },
      {
        "priority": "high",
        "issue": "Keine Schema.org Markup",
        "description": "Fehlt Product, Price, und Rating Schema",
        "action": "Implementieren Sie JSON-LD Structured Data für bessere SERP-Anzeige"
      }
    ]
  }
}
```

### Status Codes
- `200`: Erfolgreich analysiert
- `400`: Ungültige Request-Parameter
- `404`: Produkt nicht gefunden
- `500`: Analysie-Fehler

---

## 2. Cross-Sell / Up-Sell Strategie

### Endpoint
```
POST /api/advanced/cross-sell-upsell-strategy
```

### Beschreibung
Generiert eine optimierte Cross-Sell und Up-Sell Strategie für ein Produkt zur AOV-Steigerung.

### Request Body
```json
{
  "product_id": "prod_12345",
  "product_title": "Wireless Earbuds Pro",
  "product_price": 129.99,
  "product_category": "electronics",
  "sku": "WEB-001",
  "include_bundles": true,
  "include_warranties": true
}
```

### Response
```json
{
  "base_product": {
    "id": "prod_12345",
    "title": "Wireless Earbuds Pro",
    "price": 129.99,
    "category": "electronics"
  },
  "cross_sell": {
    "potential_aov": 164.98,
    "aov_increase": "+27%",
    "recommendations": [
      {
        "id": "prod_54321",
        "title": "Premium Phone Case",
        "price": 34.99,
        "score": 95,
        "reason": "Protects valuable investment",
        "image_url": "...",
        "fit_score": 0.92
      },
      {
        "id": "prod_54322",
        "title": "USB-C Fast Charger",
        "price": 24.99,
        "score": 88,
        "reason": "Complement to wireless charging",
        "image_url": "...",
        "fit_score": 0.85
      }
    ]
  },
  "upsell": {
    "potential_aov": 194.99,
    "aov_increase": "+50%",
    "recommendations": [
      {
        "id": "prod_99999",
        "title": "Wireless Earbuds Pro Max Ultra",
        "price": 199.99,
        "score": 92,
        "price_increase_percent": 54,
        "reason": "Premium version with more features",
        "image_url": "..."
      },
      {
        "id": "prod_99998",
        "title": "Professional Studio Earbuds",
        "price": 249.99,
        "score": 85,
        "price_increase_percent": 92,
        "reason": "Premium alternative for audiophiles",
        "image_url": "..."
      }
    ]
  },
  "combined_strategy": {
    "total_potential_aov": 229.97,
    "total_potential_increase": "+77%",
    "expected_conversion_boost": "+22%",
    "recommended_sequence": [
      "1. Show Up-Sell First (Higher Margin)",
      "2. Then Cross-Sell (Accessory Bundle)",
      "3. Offer 10% Bundle Discount"
    ],
    "bundle_options": [
      {
        "name": "Complete Setup",
        "items": ["prod_12345", "prod_54321", "prod_54322"],
        "regular_price": 189.97,
        "bundle_price": 169.97,
        "savings": "10%"
      }
    ]
  }
}
```

### Status Codes
- `200`: Erfolgreich analysiert
- `400`: Ungültige Kategorie oder Produkt
- `404`: Produkt nicht gefunden
- `500`: Strategie-Generierungs-Fehler

---

## 3. Trend-Produkt Entdeckung

### Endpoint
```
POST /api/advanced/trend-product-discovery
```

### Beschreibung
Analysiert eBay und TikTok Trends zur Identifikation hochprofitabler, trendiger Produkte mit Revenue-Potenzial.

### Request Body
```json
{
  "store_url": "https://example.myshopify.com",
  "store_type": "shopify",
  "limit": 15,
  "min_confidence": 0.75,
  "categories": ["electronics", "home", "fashion"],
  "exclude_competition": ["high"]
}
```

### Response
```json
{
  "trending_products": [
    {
      "keyword": "Wireless Earbuds",
      "trend_type": "rising",
      "confidence_score": 92,
      "ebay_data": {
        "total_listings": 5000,
        "growth_percentage": 45,
        "avg_price": 79.99,
        "demand_trend": "↑ Increasing (+45% YoY)",
        "top_sellers": "5-10"
      },
      "tiktok_data": {
        "mentions": 250000,
        "engagement_rate": 8.5,
        "trend_score": 89,
        "hashtag_reach": "500M+ views"
      },
      "revenue_potential": {
        "monthly": 133333,
        "annual": 1600000,
        "calculation": "5000 listings × 1.45 growth × $79.99 × 1.5 tiktok_boost"
      },
      "competition_level": "medium",
      "competition_count": 1200,
      "risk_level": "low",
      "trend_categories": ["electronics", "audio", "wireless"],
      "catalog_fit": {
        "is_fit": true,
        "reason": "Passt zu Deinem electronics/audio Katalog",
        "related_products": ["prod_12345", "prod_54321"]
      },
      "risk_assessment": {
        "risks": [
          "Seasonality: Höher im Urlaubs-/Geschenke-Saison",
          "Competition: Könnte schnell erhöht werden",
          "Price Pressure: Average selling price könnte sinken"
        ],
        "mitigations": [
          "Differenziertes Produktangebot (Bundles, Zubehör)",
          "Premium-Positionierung",
          "Customer Reviews & Testimonials"
        ]
      },
      "recommendations": [
        "Schnell: Bestand aufbauen bevor Competitor einsteigen",
        "Marketing: TikTok Ad Campaign launchen",
        "Product: Add accessories (cases, chargers)",
        "Pricing: Wettbewerbsfähig aber nicht am unteren Ende"
      ]
    },
    {
      "keyword": "Smart Home Speakers",
      "trend_type": "emerging",
      "confidence_score": 85,
      // ... similar structure
    },
    // ... mehr Trends (bis zu 15)
  ],
  "market_summary": {
    "total_potential_annual_revenue": 24000000,
    "high_confidence_opportunities": 12,
    "emerging_trends": 8,
    "average_confidence_score": 87,
    "top_categories": ["electronics", "smart_home", "audio"]
  }
}
```

### Status Codes
- `200`: Erfolgreich analysiert
- `400`: Ungültige Store URL oder Type
- `422`: Unverarbeitbare Entity (z.B. keine Daten verfügbar)
- `500`: Trend-Analyse-Fehler

---

## 4. Fehlerdiagnose

### Endpoint
```
POST /api/advanced/diagnose-shop
```

### Beschreibung
Führt automatische Diagnose des Shops auf kritische Fehler, UX-Probleme und Optimierungsmöglichkeiten durch.

### Request Body
```json
{
  "store_url": "https://example.myshopify.com",
  "store_type": "shopify",
  "full_audit": true
}
```

### Response Format
Siehe `ErrorDiagnosisReport` Component Dokumentation

### Status Codes
- `200`: Erfolgreich diagnostiziert
- `400`: Ungültige Store URL
- `500`: Diagnose-Fehler

---

## 5. Produktempfehlungen

### Endpoint
```
POST /api/advanced/product-recommendations
```

### Beschreibung
Generiert KI-gestützte Produktempfehlungen für komplementäre Produkte und Bundles.

### Request Body
```json
{
  "product_id": "prod_12345",
  "product_title": "Wireless Earbuds Pro",
  "product_category": "electronics",
  "include_bundles": true,
  "limit": 10
}
```

### Response Format
Siehe `ProductRecommendationsCard` Component Dokumentation

### Status Codes
- `200`: Erfolgreich empfehlungen generiert
- `404`: Produkt nicht gefunden
- `500`: Empfehlungs-Fehler

---

## Error Handling

### Standard Error Response
```json
{
  "detail": "Product not found",
  "error_code": "PRODUCT_NOT_FOUND",
  "status_code": 404,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Häufige Error Codes
- `INVALID_REQUEST`: Ungültige Request-Parameter
- `PRODUCT_NOT_FOUND`: Produkt existiert nicht
- `STORE_NOT_FOUND`: Store URL ungültig/nicht erreichbar
- `API_RATE_LIMIT`: Rate Limit überschritten (warte 60 Sekunden)
- `EXTERNAL_SERVICE_ERROR`: eBay/TikTok API temporär nicht verfügbar
- `ANALYSIS_ERROR`: Fehler bei Analyse durchführen

---

## Authentication

Alle Endpoints erfordern API-Key Authentication:

```bash
curl -X POST "http://localhost:8000/api/advanced/detailed-seo-analysis" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "product_id": "prod_12345" }'
```

### API Key Konfiguration
```python
# backend/config.py
API_KEY = os.getenv("E_COMMERCE_API_KEY", "your-default-key")
```

---

## Rate Limiting

- **Standard**: 100 requests/minute pro IP
- **Burst**: 500 requests/hour
- **Headers**: 
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 99`
  - `X-RateLimit-Reset: 1705323000`

---

## Performance Tips

1. **Caching**: SEO-Analysen werden 24h gecacht
2. **Batch Requests**: Nutze `/api/advanced/bulk-analyze` für mehrere Produkte
3. **Async**: Alle Endpoints sind async-optimiert
4. **Timeouts**: Set Client-Side Timeout zu 30 Sekunden

---

## Testing

### Test Script mit curl
```bash
#!/bin/bash

# Test 1: SEO Analysis
curl -X POST "http://localhost:8000/api/advanced/detailed-seo-analysis" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "test_001",
    "title": "Test Product",
    "description": "Test...",
    "category": "electronics"
  }'

# Test 2: Cross-Sell Strategy
curl -X POST "http://localhost:8000/api/advanced/cross-sell-upsell-strategy" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "test_001",
    "product_title": "Test Product",
    "product_price": 99.99,
    "product_category": "electronics"
  }'

# Test 3: Trend Discovery
curl -X POST "http://localhost:8000/api/advanced/trend-product-discovery" \
  -H "Content-Type: application/json" \
  -d '{
    "store_url": "https://example.com",
    "store_type": "shopify",
    "limit": 5
  }'
```

---

## Webhook Support (Zukünftig)

```python
# Konfiguriere Webhooks für asynchrone Benachrichtigungen
POST /api/webhooks/configure
{
  "url": "https://your-app.com/webhooks/analysis",
  "events": ["analysis.complete", "error.occurred"]
}
```

---

## Changelog

### Version 2.0
- ✅ SEO-Analyse mit Meta-Tag Recommendations
- ✅ Cross-Sell/Up-Sell Strategie
- ✅ Trend-Produkt Entdeckung
- ✅ Error Handling & Rate Limiting
- ✅ Webhook Support (Beta)

---

**Dokument Version**: 2.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅
