"""
Hauptagent für Shop-Analyse und Optimierungen
"""
import asyncio
from typing import Dict, List, Any, Optional
from app.services.shopify import ShopifyService
from app.services.woocommerce import WooCommerceService
from app.services.ebay import eBayService
from app.services.tiktok import TikTokService
from app.models.product import (
    ProductAnalysis, MarketAnalysis, ShopAnalysisReport
)
from datetime import datetime


class ECommerceAIAgent:
    def __init__(self, store_type: str = "shopify"):
        """
        Initialisiere den Agent
        store_type: "shopify" oder "woocommerce"
        """
        self.store_type = store_type
        
        if store_type == "shopify":
            self.store_service = ShopifyService()
        elif store_type == "woocommerce":
            self.store_service = WooCommerceService()
        else:
            raise ValueError("Unsupported store type")
        
        self.ebay_service = eBayService()
        self.tiktok_service = TikTokService()
    
    async def analyze_shop(self) -> ShopAnalysisReport:
        """
        Umfassende Shop-Analyse durchführen
        """
        try:
            shop_info = await self.store_service.get_shop_info()
            products = await self.store_service.get_products()
            
            # Analysiere einzelne Produkte
            product_analyses = []
            for product in products[:20]:  # Analysiere erste 20 Produkte
                analysis = await self._analyze_product(product)
                product_analyses.append(analysis)
            
            # Gesamtbewertung
            overall_score = self._calculate_overall_score(product_analyses)
            
            # Finde häufige Probleme
            seo_issues = self._identify_seo_issues(products)
            ux_issues = self._identify_ux_issues(shop_info, products)
            revenue_opportunities = self._identify_revenue_opportunities(product_analyses)
            recommendations = self._generate_recommendations(
                seo_issues, ux_issues, revenue_opportunities
            )
            
            return ShopAnalysisReport(
                timestamp=datetime.now(),
                shop_url=shop_info.get("myshopify_domain") if self.store_type == "shopify" else "",
                overall_score=overall_score,
                performance_metrics=self._calculate_performance_metrics(products),
                seo_issues=seo_issues,
                ux_issues=ux_issues,
                revenue_opportunities=revenue_opportunities,
                recommendations=recommendations
            )
        
        except Exception as e:
            print(f"Shop Analysis Error: {e}")
            return ShopAnalysisReport(
                timestamp=datetime.now(),
                shop_url="",
                overall_score=0,
                performance_metrics={},
                seo_issues=["Error during analysis"],
                ux_issues=[],
                revenue_opportunities=[],
                recommendations=[]
            )
    
    async def _analyze_product(self, product: Dict) -> ProductAnalysis:
        """
        Analysiere einzelnes Produkt auf SEO, UX, Conversion
        """
        product_id = str(product.get("id", ""))
        
        # Konvertiere zu standardisiertem Format
        std_product = self.store_service.convert_to_product(product)
        
        # Berechne verschiedene Scores
        seo_score = self._calculate_seo_score(product)
        description_quality = self._calculate_description_quality(product)
        price_competitiveness = await self._calculate_price_competitiveness(std_product)
        conversion_potential = self._calculate_conversion_potential(product)
        
        # Finde Probleme
        issues = self._identify_product_issues(product)
        
        # Finde komplementäre Produkte
        complementary = await self._find_complementary_products(std_product)
        
        # Generiere Empfehlungen
        recommendations = self._generate_product_recommendations(
            product, issues, seo_score, description_quality
        )
        
        return ProductAnalysis(
            product_id=product_id,
            seo_score=seo_score,
            description_quality=description_quality,
            price_competitiveness=price_competitiveness,
            conversion_potential=conversion_potential,
            complementary_products=complementary,
            issues=issues,
            recommendations=recommendations
        )
    
    async def find_market_opportunities(self, product_keyword: str) -> MarketAnalysis:
        """
        Analysiere Marktchancen für Produkte auf Web, eBay und TikTok
        """
        try:
            # eBay Analyse
            ebay_analysis = await self.ebay_service.analyze_market(product_keyword)
            
            # TikTok Analyse
            tiktok_analysis = await self.tiktok_service.analyze_product_trend(product_keyword)
            
            # Berechne Umsatzpotenzial
            potential_revenue = self._calculate_revenue_potential(
                ebay_analysis, tiktok_analysis
            )
            
            # Finde Marktlücken
            market_gaps = self._identify_market_gaps(
                product_keyword, ebay_analysis, tiktok_analysis
            )
            
            return MarketAnalysis(
                product_id=product_keyword,
                product_name=product_keyword,
                web_demand=self._estimate_web_demand(product_keyword),
                ebay_listings=ebay_analysis.get("listings_count", 0),
                ebay_avg_price=ebay_analysis.get("avg_price", 0),
                ebay_demand_trend="stable",  # Könnte aus historischen Daten berechnet werden
                tiktok_mentions=tiktok_analysis.get("mentions", 0),
                tiktok_trend_score=tiktok_analysis.get("trend_score", 0),
                potential_revenue=potential_revenue,
                market_gaps=market_gaps
            )
        except Exception as e:
            print(f"Market Analysis Error: {e}")
            return MarketAnalysis(
                product_id=product_keyword,
                product_name=product_keyword,
                web_demand=0,
                ebay_listings=0,
                ebay_avg_price=0,
                ebay_demand_trend="unknown",
                tiktok_mentions=0,
                tiktok_trend_score=0,
                potential_revenue=0,
                market_gaps=[]
            )
    
    async def _find_complementary_products(self, product) -> List[str]:
        """
        Finde komplementäre Produkte basierend auf Produktkategorie
        """
        complementary_keywords = {
            "smartphone": ["phone case", "screen protector", "charger", "headphones"],
            "laptop": ["laptop bag", "mouse", "keyboard", "monitor"],
            "camera": ["tripod", "lens", "memory card", "lighting"],
            "book": ["bookmark", "reading light", "stand"],
            "shoes": ["socks", "shoe cleaner", "insoles"],
        }
        
        title = product.title.lower()
        for category, complements in complementary_keywords.items():
            if category in title:
                return complements
        
        return []
    
    def _calculate_seo_score(self, product: Dict) -> int:
        """Berechne SEO-Score (0-100)"""
        score = 50
        
        # Prüfe auf Meta-Beschreibung
        if product.get("body_html") and len(product.get("body_html", "")) > 50:
            score += 15
        
        # Prüfe auf Bilder
        if product.get("images") and len(product.get("images", [])) > 2:
            score += 15
        
        # Prüfe auf Tags
        if product.get("tags"):
            score += 10
        
        # Prüfe auf Titel-Länge
        title = product.get("title", "")
        if 50 < len(title) < 60:
            score += 10
        
        return min(100, score)
    
    def _calculate_description_quality(self, product: Dict) -> int:
        """Berechne Beschreibungsqualität (0-100)"""
        description = product.get("body_html", "")
        
        if not description:
            return 0
        
        quality = 0
        
        # Länge
        if len(description) > 200:
            quality += 20
        elif len(description) > 100:
            quality += 10
        
        # Keywords
        keywords = ["feature", "benefit", "use", "product", "quality"]
        for keyword in keywords:
            if keyword in description.lower():
                quality += 10
        
        # Struktur
        if "<p>" in description or "<ul>" in description:
            quality += 20
        
        return min(100, quality)
    
    async def _calculate_price_competitiveness(self, product) -> float:
        """Berechne Preiskonkurrenzfähigkeit"""
        # Suche ähnliche Produkte auf eBay
        try:
            ebay_data = await self.ebay_service.search_products(product.title)
            items = ebay_data.get("itemSummaries", [])
            
            if not items:
                return 0.5  # Neutral
            
            ebay_prices = [float(item["price"]["value"]) for item in items if "price" in item]
            ebay_avg = sum(ebay_prices) / len(ebay_prices) if ebay_prices else product.price
            
            # Vergleiche Preise
            if abs(product.price - ebay_avg) < ebay_avg * 0.1:
                return 0.8  # Gut konkurrenzfähig
            elif product.price < ebay_avg:
                return 0.9  # Besser als Markt
            else:
                return 0.6  # Teurer als Markt
        
        except:
            return 0.5
    
    def _calculate_conversion_potential(self, product: Dict) -> int:
        """Berechne Konversionspotenzial (0-100)"""
        score = 50
        
        # Prüfe auf Reviews/Ratings
        if product.get("vendor"):
            score += 10
        
        # Prüfe auf verfügbare Varianten
        if len(product.get("variants", [])) > 1:
            score += 15
        
        # Prüfe auf Verfügbarkeit
        if product.get("available", False):
            score += 10
        
        # Prüfe auf niedrigen Preis
        price = float(product.get("variants", [{}])[0].get("price", 0))
        if price > 0 and price < 50:
            score += 15
        
        return min(100, score)
    
    def _identify_product_issues(self, product: Dict) -> List[str]:
        """Identifiziere Probleme mit einem Produkt"""
        issues = []
        
        # Titel zu kurz
        if len(product.get("title", "")) < 20:
            issues.append("Produkttitel zu kurz für SEO")
        
        # Keine Beschreibung
        if not product.get("body_html") or len(product.get("body_html", "")) < 50:
            issues.append("Unzureichende Produktbeschreibung")
        
        # Keine Bilder
        if not product.get("images") or len(product.get("images", [])) == 0:
            issues.append("Keine Produktbilder")
        
        # Keine Tags
        if not product.get("tags"):
            issues.append("Keine Produkt-Tags für Auffindbarkeit")
        
        # Zu viele Varianten
        if len(product.get("variants", [])) > 20:
            issues.append("Zu viele Produktvarianten")
        
        return issues
    
    def _identify_seo_issues(self, products: List[Dict]) -> List[str]:
        """Identifiziere SEO-Probleme im Shop"""
        issues = []
        
        # Analysiere durchschnittliche Metriken
        avg_title_length = sum(len(p.get("title", "")) for p in products) / len(products) if products else 0
        avg_description_length = sum(len(p.get("body_html", "")) for p in products) / len(products) if products else 0
        products_without_images = sum(1 for p in products if not p.get("images"))
        products_without_description = sum(1 for p in products if not p.get("body_html"))
        
        if avg_title_length < 30:
            issues.append("Durchschnittliche Titel-Länge zu kurz (ideal: 50-60 Zeichen)")
        
        if avg_description_length < 100:
            issues.append("Produktbeschreibungen zu kurz für SEO")
        
        if products_without_images > len(products) * 0.2:
            issues.append(f"{products_without_images} Produkte ohne Bilder")
        
        if products_without_description > len(products) * 0.3:
            issues.append(f"Über 30% der Produkte haben keine Beschreibung")
        
        return issues
    
    def _identify_ux_issues(self, shop_info: Dict, products: List[Dict]) -> List[str]:
        """Identifiziere UX-Probleme"""
        issues = []
        
        # Prüfe auf Kategorisierung
        categories = set()
        for product in products:
            for collection in product.get("collections", []):
                categories.add(collection.get("title"))
        
        if len(categories) < 3:
            issues.append("Zu wenige Produktkategorien für Navigation")
        
        # Prüfe auf Preisrange
        prices = [float(p.get("variants", [{}])[0].get("price", 0)) for p in products]
        if prices:
            price_range = max(prices) - min(prices)
            if price_range < 10:
                issues.append("Zu kleine Preisrange - weniger Produktdiversität")
        
        # Prüfe auf Verfügbarkeit
        out_of_stock = sum(1 for p in products if not p.get("available", False))
        if out_of_stock > len(products) * 0.3:
            issues.append(f"{out_of_stock} Produkte sind nicht verfügbar")
        
        return issues
    
    def _identify_revenue_opportunities(self, analyses: List[ProductAnalysis]) -> List[str]:
        """Identifiziere Umsatzchancen"""
        opportunities = []
        
        # Produkte mit hohem Konversionspotenzial aber schlechtem SEO
        low_seo_high_conversion = [
            a for a in analyses 
            if a.seo_score < 50 and a.conversion_potential > 70
        ]
        
        if low_seo_high_conversion:
            opportunities.append(
                f"{len(low_seo_high_conversion)} Produkte könnten durch SEO-Optimierung mehr Traffic generieren"
            )
        
        # Produkte ohne komplementäre Produkte
        without_complements = [a for a in analyses if not a.complementary_products]
        if without_complements:
            opportunities.append(
                f"Cross-Selling-Möglichkeiten für {len(without_complements)} Produkte"
            )
        
        # Preiswettbewerb
        low_competitiveness = [a for a in analyses if a.price_competitiveness < 0.7]
        if low_competitiveness:
            opportunities.append(
                f"{len(low_competitiveness)} Produkte könnten preislich optimiert werden"
            )
        
        return opportunities
    
    def _generate_recommendations(
        self, 
        seo_issues: List[str],
        ux_issues: List[str],
        revenue_opportunities: List[str]
    ) -> List[Dict]:
        """Generiere konkrete Empfehlungen"""
        recommendations = []
        
        for issue in seo_issues[:2]:
            recommendations.append({
                "category": "SEO",
                "priority": "high",
                "issue": issue,
                "action": "Aktualisiere Produkttitel und Beschreibungen",
                "estimated_impact": "+20-30% organischer Traffic"
            })
        
        for opportunity in revenue_opportunities[:2]:
            recommendations.append({
                "category": "Revenue",
                "priority": "high",
                "issue": opportunity,
                "action": "Implementiere Cross-Selling und Upselling",
                "estimated_impact": "+10-15% AOV (Average Order Value)"
            })
        
        for issue in ux_issues[:1]:
            recommendations.append({
                "category": "UX",
                "priority": "medium",
                "issue": issue,
                "action": "Verbessere Navigation und Kategorisierung",
                "estimated_impact": "+5-10% Konversionsrate"
            })
        
        return recommendations
    
    def _calculate_overall_score(self, analyses: List[ProductAnalysis]) -> int:
        """Berechne Gesamtbewertung basierend auf Produktanalysen"""
        if not analyses:
            return 0
        
        avg_seo = sum(a.seo_score for a in analyses) / len(analyses)
        avg_conversion = sum(a.conversion_potential for a in analyses) / len(analyses)
        avg_description = sum(a.description_quality for a in analyses) / len(analyses)
        avg_competitiveness = sum(a.price_competitiveness for a in analyses) / len(analyses) * 100
        
        overall = (avg_seo + avg_conversion + avg_description + avg_competitiveness) / 4
        return int(overall)
    
    def _calculate_performance_metrics(self, products: List[Dict]) -> Dict[str, Any]:
        """Berechne Performance-Metriken"""
        return {
            "total_products": len(products),
            "with_descriptions": sum(1 for p in products if p.get("body_html")),
            "with_images": sum(1 for p in products if p.get("images")),
            "available_products": sum(1 for p in products if p.get("available", False)),
            "avg_images_per_product": sum(len(p.get("images", [])) for p in products) / len(products) if products else 0
        }
    
    def _estimate_web_demand(self, keyword: str) -> int:
        """Schätze Web-Nachfrage (vereinfacht)"""
        # In der Realität würde hier Google Trends oder SEMrush API verwendet
        # Für jetzt eine vereinfachte Schätzung basierend auf Keyword-Länge
        keyword_length = len(keyword.split())
        base_demand = 1000
        
        if keyword_length == 1:
            return base_demand * 50
        elif keyword_length == 2:
            return base_demand * 10
        else:
            return base_demand
    
    def _calculate_revenue_potential(
        self,
        ebay_analysis: Dict,
        tiktok_analysis: Dict
    ) -> float:
        """Berechne Umsatzpotenzial"""
        ebay_listings = ebay_analysis.get("listings_count", 1)
        ebay_avg_price = ebay_analysis.get("avg_price", 1)
        tiktok_mentions = tiktok_analysis.get("mentions", 1)
        tiktok_trend_score = tiktok_analysis.get("trend_score", 1)
        
        # Vereinfachte Berechnung
        ebay_potential = ebay_listings * ebay_avg_price * 0.1
        tiktok_potential = tiktok_mentions * tiktok_trend_score * 0.01
        
        return ebay_potential + tiktok_potential
    
    def _identify_market_gaps(
        self,
        keyword: str,
        ebay_analysis: Dict,
        tiktok_analysis: Dict
    ) -> List[str]:
        """Identifiziere Marktlücken"""
        gaps = []
        
        ebay_listings = ebay_analysis.get("listings_count", 0)
        tiktok_mentions = tiktok_analysis.get("mentions", 0)
        
        if ebay_listings < 500:
            gaps.append("Geringe Konkurrenz auf eBay - Nischenchance")
        
        if tiktok_mentions > 1000000:
            gaps.append("Hohes TikTok-Interesse - Trend-Potenzial")
        
        if ebay_listings > 5000 and tiktok_mentions < 100000:
            gaps.append("Etablierter Markt auf eBay, aber niedrig auf Social Media")
        
        return gaps
    
    def _generate_product_recommendations(
        self,
        product: Dict,
        issues: List[str],
        seo_score: int,
        description_quality: int
    ) -> List[str]:
        """Generiere Produktspezifische Empfehlungen"""
        recommendations = []
        
        if seo_score < 50:
            recommendations.append("Verbessere SEO durch längere Titel und Meta-Beschreibungen")
        
        if description_quality < 50:
            recommendations.append("Schreibe detailliertere Produktbeschreibung mit Features und Vorteilen")
        
        if len(product.get("images", [])) < 3:
            recommendations.append("Füge mindestens 5 hochwertige Produktbilder hinzu")
        
        if not product.get("tags"):
            recommendations.append("Füge relevante Tags für bessere Auffindbarkeit hinzu")
        
        return recommendations
