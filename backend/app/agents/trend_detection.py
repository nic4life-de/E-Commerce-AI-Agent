"""
Trend Detection & Product Discovery Engine
Identifiziere neue, vielversprechende Produkte basierend auf eBay und TikTok Trends
"""
from typing import List, Dict, Any
from datetime import datetime, timedelta


class TrendDetectionEngine:
    """
    Analysiere Trends und identifiziere neue Produktchancen
    """
    
    def __init__(self):
        self.trend_categories = {
            "rising": {
                "definition": "Stark wachsende Nachfrage",
                "min_growth": 30,  # 30% Wachstum
                "score_multiplier": 1.5
            },
            "emerging": {
                "definition": "Neue Trends mit hohem Potenzial",
                "min_mentions": 1000,
                "score_multiplier": 1.3
            },
            "seasonal": {
                "definition": "Saisonal begrenzte Chancen",
                "seasonal_peak": ["spring", "summer", "fall", "winter"],
                "score_multiplier": 1.2
            }
        }
    
    async def identify_trend_products(
        self,
        ebay_data: Dict[str, Any],
        tiktok_data: Dict[str, Any],
        current_products: List[Dict] = None
    ) -> List[Dict[str, Any]]:
        """
        Identifiziere Trend-Produkte und bewerte ihr Potenzial
        """
        trend_products = []
        
        # eBay Trend-Analyse
        ebay_trends = self._analyze_ebay_trends(ebay_data)
        
        # TikTok Trend-Analyse
        tiktok_trends = self._analyze_tiktok_trends(tiktok_data)
        
        # Kombiniere beide Datenquellen
        for ebay_product in ebay_trends[:10]:
            # Finde beste TikTok Match
            tiktok_match = self._find_tiktok_match(ebay_product, tiktok_trends)
            
            if tiktok_match:
                combined_score = (ebay_product["score"] + tiktok_match["score"]) / 2
            else:
                combined_score = ebay_product["score"]
            
            # Prüfe ob nicht bereits im Katalog
            if current_products:
                if self._product_exists(ebay_product["keyword"], current_products):
                    continue
            
            product_opportunity = {
                "product_keyword": ebay_product["keyword"],
                "product_category": self._categorize_product(ebay_product["keyword"]),
                "trend_type": ebay_product.get("trend_type", "rising"),
                "confidence_score": min(100, combined_score),
                "ebay_data": {
                    "listings": ebay_product.get("listings_count", 0),
                    "avg_price": ebay_product.get("avg_price", 0),
                    "price_range": ebay_product.get("price_range"),
                    "demand_trend": ebay_product.get("demand_trend", "stable"),
                    "competition_level": self._assess_competition(ebay_product),
                    "top_sellers": ebay_product.get("top_items", [])[:3]
                },
                "tiktok_data": tiktok_match or {
                    "mentions": 0,
                    "trend_score": 0,
                    "related_hashtags": []
                },
                "revenue_potential": self._calculate_revenue_potential(ebay_product, tiktok_match),
                "market_fit_with_current": self._assess_current_catalog_fit(ebay_product, current_products),
                "recommendation": self._generate_product_recommendation(ebay_product, tiktok_match),
                "risk_assessment": self._assess_trend_risk(ebay_product, tiktok_match)
            }
            
            trend_products.append(product_opportunity)
        
        # Sortiere nach Confidence Score
        trend_products.sort(key=lambda x: x["confidence_score"], reverse=True)
        
        return trend_products[:15]
    
    def _analyze_ebay_trends(self, ebay_data: Dict) -> List[Dict[str, Any]]:
        """
        Analysiere eBay Daten für Trends
        """
        trends = []
        
        # Simuliere eBay Trend-Daten (in Realität würde das mit echtem API-Data gefüllt)
        # Diese würden von ebay_service.py kommen
        
        # Beispiel-Trends die erkannt wurden
        trending_keywords = [
            {"keyword": "wireless earbuds", "listings": 5000, "growth": 45},
            {"keyword": "smart home speakers", "listings": 3200, "growth": 35},
            {"keyword": "portable projectors", "listings": 1500, "growth": 60},
            {"keyword": "mechanical keyboards", "listings": 2800, "growth": 40},
            {"keyword": "gaming chairs", "listings": 4000, "growth": 50},
        ]
        
        for item in trending_keywords:
            trend_type = self._determine_trend_type(item["growth"])
            
            trends.append({
                "keyword": item["keyword"],
                "listings_count": item["listings"],
                "growth_rate": item["growth"],
                "trend_type": trend_type,
                "score": self._calculate_trend_score(item["growth"]),
                "avg_price": 150 + (item["listings"] * 0.01),  # Simuliert
                "price_range": {"min": 50, "max": 500},
                "demand_trend": "up" if item["growth"] > 30 else "stable",
                "top_items": []
            })
        
        return trends
    
    def _analyze_tiktok_trends(self, tiktok_data: Dict) -> List[Dict[str, Any]]:
        """
        Analysiere TikTok Daten für Trends
        """
        trends = []
        
        # Simuliere TikTok Trend-Daten
        trending_hashtags = [
            {"hashtag": "wireless earbuds", "mentions": 285000, "trend_score": 89},
            {"hashtag": "smart home", "mentions": 450000, "trend_score": 92},
            {"hashtag": "portable projectors", "mentions": 125000, "trend_score": 78},
            {"hashtag": "mechanical keyboard gaming", "mentions": 95000, "trend_score": 85},
            {"hashtag": "gaming chair setup", "mentions": 320000, "trend_score": 88},
        ]
        
        for item in trending_hashtags:
            trends.append({
                "keyword": item["hashtag"],
                "mentions": item["mentions"],
                "trend_score": item["trend_score"],
                "popularity": "high" if item["mentions"] > 200000 else "medium",
                "viral_potential": item["trend_score"] > 80,
                "related_hashtags": []
            })
        
        return trends
    
    def _find_tiktok_match(self, ebay_product: Dict, tiktok_trends: List[Dict]) -> Dict:
        """
        Finde best-matching TikTok Trend
        """
        ebay_keyword = ebay_product["keyword"].lower()
        
        for tiktok_trend in tiktok_trends:
            tiktok_keyword = tiktok_trend["keyword"].lower()
            
            # Berechne Ähnlichkeit
            if self._keywords_similar(ebay_keyword, tiktok_keyword):
                return tiktok_trend
        
        return None
    
    def _keywords_similar(self, keyword1: str, keyword2: str) -> bool:
        """Prüfe ob Keywords ähnlich sind"""
        words1 = set(keyword1.split())
        words2 = set(keyword2.split())
        
        if not words1 or not words2:
            return False
        
        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))
        
        similarity = intersection / union if union > 0 else 0
        return similarity > 0.3
    
    def _categorize_product(self, keyword: str) -> str:
        """Kategorisiere Produkt basierend auf Keyword"""
        keyword_lower = keyword.lower()
        
        if any(word in keyword_lower for word in ["ear", "head", "speaker", "mic", "audio", "keyboard", "mouse"]):
            return "electronics"
        elif any(word in keyword_lower for word in ["chair", "desk", "lamp", "furniture"]):
            return "home"
        elif any(word in keyword_lower for word in ["shirt", "pants", "shoe", "clothing"]):
            return "fashion"
        elif any(word in keyword_lower for word in ["game", "console", "gaming"]):
            return "gaming"
        
        return "general"
    
    def _assess_competition(self, ebay_product: Dict) -> str:
        """Bewerte Konkurrenzsituation"""
        listings = ebay_product.get("listings_count", 0)
        
        if listings < 500:
            return "low"  # Nischenchance
        elif listings < 2000:
            return "medium"  # Moderater Wettbewerb
        else:
            return "high"  # Starker Wettbewerb
    
    def _calculate_revenue_potential(
        self,
        ebay_product: Dict,
        tiktok_data: Dict
    ) -> Dict[str, Any]:
        """
        Berechne Umsatzpotenzial
        """
        # Basis-Berechnung
        listings = ebay_product.get("listings_count", 1)
        avg_price = ebay_product.get("avg_price", 100)
        growth_rate = ebay_product.get("growth_rate", 0)
        
        # TikTok Boost
        tiktok_boost = 1.0
        if tiktok_data:
            mentions = tiktok_data.get("mentions", 0)
            if mentions > 200000:
                tiktok_boost = 1.5
            elif mentions > 100000:
                tiktok_boost = 1.3
        
        # Berechne monthly revenue potential
        potential_monthly_sales = (listings / 100) * (100 + growth_rate) * 10 * tiktok_boost
        potential_monthly_revenue = potential_monthly_sales * avg_price
        
        return {
            "potential_monthly_units": int(potential_monthly_sales),
            "potential_monthly_revenue": int(potential_monthly_revenue),
            "potential_annual_revenue": int(potential_monthly_revenue * 12),
            "profitability_estimate": "high" if potential_monthly_revenue > 10000 else "medium" if potential_monthly_revenue > 5000 else "low",
            "time_to_profitability": "< 3 months" if potential_monthly_revenue > 20000 else "3-6 months" if potential_monthly_revenue > 10000 else "> 6 months"
        }
    
    def _assess_current_catalog_fit(self, product: Dict, current_products: List[Dict]) -> Dict[str, Any]:
        """
        Bewerte wie gut das Produkt zum aktuellen Katalog passt
        """
        if not current_products:
            return {"fit_score": 50, "reason": "Keine aktuelle Katalog Daten"}
        
        product_category = self._categorize_product(product["keyword"])
        
        current_categories = [self._categorize_product(p.get("title", "")) for p in current_products]
        
        category_exists = product_category in current_categories
        
        return {
            "fit_score": 85 if category_exists else 60,
            "reason": f"Passt {'gut' if category_exists else 'bedingt'} zu '{product_category}' Kategorie",
            "cross_sell_potential": "high" if category_exists else "medium",
            "cannibalization_risk": "low" if not category_exists else "medium"
        }
    
    def _generate_product_recommendation(self, ebay_product: Dict, tiktok_data: Dict) -> Dict[str, str]:
        """
        Generiere Produktempfehlung
        """
        growth = ebay_product.get("growth_rate", 0)
        tiktok_mentions = tiktok_data.get("mentions", 0) if tiktok_data else 0
        listings = ebay_product.get("listings_count", 0)
        
        reasons = []
        
        if growth > 50:
            reasons.append(f"Schnell wachsender Markt (+{growth}% YoY)")
        
        if tiktok_mentions > 200000:
            reasons.append("Viral Potenzial auf TikTok erkannt")
        
        if listings < 500:
            reasons.append("Geringe Konkurrenz - schneller First-Mover Vorteil")
        
        action = "strongly_recommend" if len(reasons) >= 2 else "recommend"
        
        return {
            "action": action,
            "reasons": reasons,
            "suggested_launch_timeline": "< 1 month" if action == "strongly_recommend" else "1-3 months"
        }
    
    def _assess_trend_risk(self, ebay_product: Dict, tiktok_data: Dict) -> Dict[str, Any]:
        """
        Bewerte Trend-Risiken
        """
        risks = []
        risk_level = "low"
        
        # Hochkompetitiv?
        if ebay_product.get("listings_count", 0) > 3000:
            risks.append("Hohe Konkurrenz - schwer sich abzuheben")
            risk_level = "high"
        
        # Volatil?
        # (In realität würde man historische Daten nutzen)
        
        # Saisonalität?
        seasonal_keywords = ["christmas", "holiday", "summer", "winter", "halloween", "easter"]
        if any(kw in ebay_product["keyword"].lower() for kw in seasonal_keywords):
            risks.append("Saisonales Produkt - begrenzte Verkaufsfenster")
            risk_level = "medium"
        
        return {
            "risk_level": risk_level,
            "identified_risks": risks,
            "mitigation_strategies": self._generate_mitigation_strategies(risks)
        }
    
    def _generate_mitigation_strategies(self, risks: List[str]) -> List[str]:
        """Generiere Mitigation Strategien"""
        strategies = []
        
        for risk in risks:
            if "Konkurrenz" in risk:
                strategies.append("Fokus auf Nischen-Varianten und Unique Selling Points")
            elif "Saisonales Produkt" in risk:
                strategies.append("Diversifiziere mit komplementären Non-Seasonal Produkten")
        
        return strategies
    
    def _determine_trend_type(self, growth_rate: float) -> str:
        """Bestimme Trend-Typ"""
        if growth_rate > 50:
            return "rising"
        elif growth_rate > 30:
            return "emerging"
        else:
            return "stable"
    
    def _calculate_trend_score(self, growth_rate: float) -> float:
        """Berechne Trend Score"""
        return min(100, 50 + (growth_rate / 2))
    
    def _product_exists(self, keyword: str, current_products: List[Dict]) -> bool:
        """Prüfe ob Produkt bereits im Katalog vorhanden ist"""
        keyword_lower = keyword.lower()
        
        for product in current_products:
            title = product.get("title", "").lower()
            if self._keywords_similar(keyword_lower, title):
                return True
        
        return False
