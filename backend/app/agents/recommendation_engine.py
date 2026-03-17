"""
Intelligente Produktempfehlungs-Engine mit komplementären Produkten
"""
from typing import List, Dict, Any
import asyncio
from app.models.product import Product


class ProductRecommendationEngine:
    """
    Engine zur Empfehlung komplementärer Produkte basierend auf:
    - Produktkategorien und Tags
    - Kaufmuster
    - Trendanalysen
    """
    
    def __init__(self):
        self.complement_rules = self._initialize_complement_rules()
    
    def _initialize_complement_rules(self) -> Dict[str, List[Dict[str, str]]]:
        """
        Definiere Regeln für komplementäre Produkte
        """
        return {
            "electronics": [
                {"keyword": "case", "reason": "Schutz"},
                {"keyword": "charger", "reason": "Zubehör"},
                {"keyword": "cable", "reason": "Verbindung"},
                {"keyword": "screen protector", "reason": "Schutz"},
                {"keyword": "stand", "reason": "Ergonomie"},
            ],
            "fashion": [
                {"keyword": "shoes", "reason": "Kompletter Look"},
                {"keyword": "bag", "reason": "Accessoire"},
                {"keyword": "belt", "reason": "Accessoire"},
                {"keyword": "socks", "reason": "Basis"},
                {"keyword": "watch", "reason": "Accessoire"},
            ],
            "home": [
                {"keyword": "cleaning", "reason": "Wartung"},
                {"keyword": "tools", "reason": "Installation"},
                {"keyword": "storage", "reason": "Lagerung"},
                {"keyword": "lighting", "reason": "Ambiente"},
            ],
            "sports": [
                {"keyword": "bag", "reason": "Transport"},
                {"keyword": "shoes", "reason": "Ausrüstung"},
                {"keyword": "socks", "reason": "Komfort"},
                {"keyword": "water bottle", "reason": "Hydration"},
                {"keyword": "towel", "reason": "Pflege"},
            ],
        }
    
    async def get_recommendations(
        self,
        product: Product,
        all_products: List[Product],
        top_n: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Empfehle komplementäre Produkte für ein gegebenes Produkt
        """
        recommendations = []
        
        # Erkenne Produktkategorie
        category = self._detect_category(product.title)
        
        # Hole Komplementierungsregeln
        complements = self.complement_rules.get(category, [])
        
        # Suche passende Produkte aus Katalog
        for complement in complements:
            keyword = complement["keyword"]
            matching_products = [
                p for p in all_products
                if keyword.lower() in p.title.lower() and p.id != product.id
            ]
            
            for match in matching_products[:1]:  # Bestes Match
                rec_score = self._calculate_recommendation_score(
                    product, match, complement["reason"]
                )
                
                recommendations.append({
                    "product_id": match.id,
                    "product_title": match.title,
                    "product_image": match.image_url,
                    "product_price": match.price,
                    "reason": f"{complement['reason']}: {keyword}",
                    "score": rec_score,
                    "potential_upsell": match.price + product.price
                })
        
        # Sortiere nach Score und gebe Top N zurück
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        return recommendations[:top_n]
    
    def _detect_category(self, title: str) -> str:
        """
        Erkenne Produktkategorie aus Titel
        """
        title_lower = title.lower()
        
        if any(word in title_lower for word in ["phone", "laptop", "camera", "headphone", "watch", "tablet"]):
            return "electronics"
        elif any(word in title_lower for word in ["shirt", "pants", "dress", "jacket", "coat"]):
            return "fashion"
        elif any(word in title_lower for word in ["table", "chair", "lamp", "rug", "pillow"]):
            return "home"
        elif any(word in title_lower for word in ["shoe", "ball", "racket", "weight", "yoga"]):
            return "sports"
        else:
            return "general"
    
    def _calculate_recommendation_score(
        self,
        base_product: Product,
        complement_product: Product,
        reason: str
    ) -> float:
        """
        Berechne Empfehlungs-Score (0-100)
        """
        score = 50
        
        # Preis-Komplementarität (sollten nicht zu unterschiedlich sein)
        price_ratio = min(complement_product.price, base_product.price) / max(complement_product.price, base_product.price)
        if 0.3 < price_ratio < 3:
            score += 20
        
        # Beschreibungsqualität des Ergänzungsprodukts
        if complement_product.description and len(complement_product.description) > 50:
            score += 15
        
        # Bilder vorhanden
        if complement_product.image_url:
            score += 10
        
        # SKU match (zeigt Integration an)
        if base_product.sku and complement_product.sku:
            score += 5
        
        return min(100, score)
    
    def get_recommended_bundle(
        self,
        product: Product,
        recommendations: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Erstelle ein Produktbundle mit automatischem Rabatt
        """
        if not recommendations:
            return {}
        
        bundle_products = [product] + [r for r in recommendations[:3]]
        total_price = product.price + sum(r["product_price"] for r in recommendations[:3])
        bundle_discount = total_price * 0.1  # 10% Bundle-Rabatt
        
        return {
            "bundle_name": f"{product.title} - Starter Kit",
            "products": bundle_products,
            "regular_price": total_price,
            "bundle_price": total_price - bundle_discount,
            "savings": bundle_discount,
            "savings_percent": 10
        }
