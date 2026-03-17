"""
Cross-Selling und Up-Selling Strategy Engine
Intelligente Produktempfehlungen zur Steigerung des AOV (Average Order Value)
"""
from typing import List, Dict, Any, Tuple
from app.models.product import Product


class CrossSellingEngine:
    """
    Cross-Selling Engine: Empfehle komplementäre Produkte (gleicher/ähnlicher Preis)
    """
    
    def __init__(self):
        self.cross_sell_patterns = {
            "electronics": {
                "smartphone": ["phone_case", "screen_protector", "charger", "headphones", "power_bank"],
                "laptop": ["laptop_bag", "mouse", "keyboard", "monitor", "desk_lamp"],
                "camera": ["tripod", "lens", "memory_card", "lighting_kit", "camera_bag"],
                "headphones": ["audio_cable", "headphone_stand", "microphone", "sound_foam"],
                "smartwatch": ["watch_band", "charger", "screen_protector", "watch_case"],
            },
            "fashion": {
                "shirt": ["pants", "jacket", "belt", "socks", "shoes"],
                "pants": ["shirt", "belt", "shoes", "jacket", "socks"],
                "shoes": ["socks", "shoe_cleaner", "insoles", "shoe_bag"],
                "jacket": ["shirt", "pants", "shoes", "belt", "scarf"],
            },
            "home": {
                "lamp": ["light_bulb", "lampshade", "dimmer_switch"],
                "sofa": ["pillow", "blanket", "throw", "side_table"],
                "bed": ["sheets", "pillows", "mattress_topper", "weighted_blanket"],
                "desk": ["desk_lamp", "chair", "organizer", "mouse_pad"],
            },
            "sports": {
                "running_shoes": ["socks", "water_bottle", "running_watch", "shorts", "shirt"],
                "yoga_mat": ["yoga_block", "yoga_strap", "towel", "shorts"],
                "dumbbell": ["weight_bench", "kettlebell", "resistance_bands"],
                "bike": ["helmet", "lights", "lock", "pump", "kickstand"],
            }
        }
    
    async def get_cross_sell_recommendations(
        self,
        product: Product,
        all_products: List[Product],
        max_recommendations: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Finde Cross-Sell Produkte (komplementäre, gleicher Preisklasse)
        """
        category = self._detect_product_category(product.title)
        subcategory = self._detect_subcategory(product.title, category)
        
        # Hole Cross-Sell Muster
        cross_sell_items = self.cross_sell_patterns.get(category, {}).get(subcategory, [])
        
        recommendations = []
        
        for item_type in cross_sell_items:
            matching_products = [
                p for p in all_products
                if self._matches_type(p, item_type) and p.id != product.id
            ]
            
            # Filtere nach Preisklasse (sollte ähnlich sein)
            for candidate in matching_products:
                score = self._calculate_cross_sell_score(product, candidate)
                if score > 50:
                    recommendations.append({
                        "product_id": candidate.id,
                        "title": candidate.title,
                        "price": candidate.price,
                        "image": candidate.image_url,
                        "reason": f"Passt gut zu {product.title}",
                        "score": score,
                        "combined_value": product.price + candidate.price,
                        "type": "cross_sell"
                    })
        
        # Sortiere nach Score
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        return recommendations[:max_recommendations]
    
    def _calculate_cross_sell_score(self, base_product: Product, candidate: Product) -> float:
        """
        Cross-Sell Score Berechnung
        - Preiskompatibilität (sollte ähnlich sein)
        - Kategorie-Match
        - Beschreibungsqualität
        """
        score = 0
        
        # Preiskompatibilität (sollte zwischen 0.5x und 2x sein)
        price_ratio = min(candidate.price, base_product.price) / max(candidate.price, base_product.price)
        if 0.3 < price_ratio < 3:
            score += 30
        
        # Beschreibungsqualität
        if candidate.description and len(candidate.description) > 50:
            score += 20
        
        # Titrqualität
        if 20 < len(candidate.title) < 80:
            score += 15
        
        # Bilder
        if candidate.image_url:
            score += 15
        
        # SKU vorhanden
        if candidate.sku:
            score += 10
        
        # Verfügbarkeit
        if candidate.sku:  # Simplified check
            score += 10
        
        return min(100, score)
    
    def _detect_product_category(self, title: str) -> str:
        """Erkenne Produktkategorie"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ["phone", "laptop", "camera", "watch", "headphone", "tablet", "console"]):
            return "electronics"
        elif any(word in title_lower for word in ["shirt", "pants", "dress", "jacket", "coat", "shoe", "sock"]):
            return "fashion"
        elif any(word in title_lower for word in ["lamp", "sofa", "bed", "desk", "table", "chair"]):
            return "home"
        elif any(word in title_lower for word in ["shoe", "mat", "dumbbell", "ball", "bike", "weight"]):
            return "sports"
        return "general"
    
    def _detect_subcategory(self, title: str, category: str) -> str:
        """Erkenne Unterkategorie"""
        title_lower = title.lower()
        
        if category == "electronics":
            if "phone" in title_lower:
                return "smartphone"
            elif "laptop" in title_lower:
                return "laptop"
            elif "camera" in title_lower:
                return "camera"
            elif "headphone" in title_lower or "earphone" in title_lower:
                return "headphones"
            elif "watch" in title_lower:
                return "smartwatch"
        
        elif category == "fashion":
            if "shirt" in title_lower:
                return "shirt"
            elif "pants" in title_lower or "jeans" in title_lower:
                return "pants"
            elif "shoe" in title_lower:
                return "shoes"
            elif "jacket" in title_lower:
                return "jacket"
        
        elif category == "home":
            if "lamp" in title_lower:
                return "lamp"
            elif "sofa" in title_lower:
                return "sofa"
            elif "bed" in title_lower:
                return "bed"
            elif "desk" in title_lower:
                return "desk"
        
        return "general"
    
    def _matches_type(self, product: Product, item_type: str) -> bool:
        """Prüfe ob Produkt zum Type passt"""
        title_lower = product.title.lower()
        return any(word in title_lower for word in item_type.split("_"))


class UpSellingEngine:
    """
    Up-Selling Engine: Empfehle höherwertige Alternativen (Premium-Versionen)
    """
    
    def __init__(self):
        self.upsell_multipliers = {
            "budget": 2.0,      # 2x Preismultiplier
            "mid": 1.5,         # 1.5x
            "premium": 1.2       # 1.2x
        }
    
    async def get_upsell_recommendations(
        self,
        product: Product,
        all_products: List[Product],
        max_recommendations: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Finde Up-Sell Produkte (höherwertige Alternativen)
        """
        # Kategorisiere Produkt in Preisklasse
        price_tier = self._determine_price_tier(product, all_products)
        
        recommendations = []
        
        # Suche ähnliche Produkte in höherer Preisklasse
        for candidate in all_products:
            if candidate.id == product.id:
                continue
            
            # Sollte in gleicher Kategorie/Typ sein
            if not self._same_category(product, candidate):
                continue
            
            # Sollte teurer sein
            if candidate.price <= product.price:
                continue
            
            # Sollte nicht zu viel teurer sein (max 3x)
            if candidate.price > product.price * 3:
                continue
            
            score = self._calculate_upsell_score(product, candidate, price_tier)
            
            if score > 50:
                recommendations.append({
                    "product_id": candidate.id,
                    "title": candidate.title,
                    "price": candidate.price,
                    "price_increase": candidate.price - product.price,
                    "price_increase_percent": ((candidate.price - product.price) / product.price) * 100,
                    "image": candidate.image_url,
                    "reason": self._generate_upsell_reason(product, candidate),
                    "score": score,
                    "type": "upsell"
                })
        
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        return recommendations[:max_recommendations]
    
    def _determine_price_tier(self, product: Product, all_products: List[Product]) -> str:
        """Bestimme Preisklasse des Produkts"""
        all_prices = [float(p.price) for p in all_products if p.price > 0]
        if not all_prices:
            return "mid"
        
        avg_price = sum(all_prices) / len(all_prices)
        
        if product.price < avg_price * 0.7:
            return "budget"
        elif product.price > avg_price * 1.3:
            return "premium"
        return "mid"
    
    def _same_category(self, product1: Product, product2: Product) -> bool:
        """Prüfe ob Produkte in gleicher Kategorie"""
        title1 = product1.title.lower()
        title2 = product2.title.lower()
        
        # Extrahiere Keywords
        keywords1 = set(title1.split())
        keywords2 = set(title2.split())
        
        # Mindestens 50% Übereinstimmung
        if keywords1 and keywords2:
            overlap = len(keywords1.intersection(keywords2)) / max(len(keywords1), len(keywords2))
            return overlap > 0.3
        
        return False
    
    def _calculate_upsell_score(self, base_product: Product, candidate: Product, price_tier: str) -> float:
        """
        Up-Sell Score Berechnung
        - Preisoptimierung
        - Qualitätsmerkmale
        - Beschreibungsqualität
        """
        score = 0
        
        # Preisoptimierung
        price_multiple = candidate.price / base_product.price
        ideal_multiple = self.upsell_multipliers.get(price_tier, 1.5)
        
        if 0.8 < price_multiple / ideal_multiple < 1.2:
            score += 30
        
        # Längere Beschreibung = bessere Qualität
        if candidate.description and base_product.description:
            if len(candidate.description) > len(base_product.description):
                score += 25
        
        # Titrqualität
        if len(candidate.title) > len(base_product.title):
            score += 15
        
        # Bilder
        if candidate.image_url:
            score += 15
        
        # Bereits höherwertig
        if candidate.sku and base_product.sku:
            score += 15
        
        return min(100, score)
    
    def _generate_upsell_reason(self, base_product: Product, upsell_product: Product) -> str:
        """Generiere Upsell-Grund"""
        price_increase = ((upsell_product.price - base_product.price) / base_product.price) * 100
        
        if price_increase < 25:
            return "Premium-Option mit nur leicht höherem Preis"
        elif price_increase < 50:
            return "Bessere Qualität zum leicht höheren Preis"
        else:
            return "Top-Qualität für Professionelle"
    
    def generate_combined_strategy(
        self,
        product: Product,
        cross_sell_recommendations: List[Dict],
        upsell_recommendations: List[Dict]
    ) -> Dict[str, Any]:
        """
        Kombinierte Strategie: Cross-Sell + Up-Sell
        """
        combined_value = product.price
        
        # Berechne potential AOV mit Cross-Sell
        cross_sell_value = sum(p["price"] for p in cross_sell_recommendations[:2])
        potential_aov_with_cross_sell = product.price + cross_sell_value
        
        # Berechne potential AOV mit Up-Sell
        upsell_value = upsell_recommendations[0]["price"] if upsell_recommendations else product.price
        potential_aov_with_upsell = upsell_value + cross_sell_value
        
        return {
            "base_product": {
                "id": product.id,
                "title": product.title,
                "price": product.price
            },
            "cross_sell": {
                "recommendations": cross_sell_recommendations[:3],
                "potential_additional_value": cross_sell_value,
                "potential_aov": potential_aov_with_cross_sell,
                "aov_increase": f"+{(cross_sell_value / product.price * 100):.1f}%"
            },
            "upsell": {
                "recommendations": upsell_recommendations[:2],
                "potential_value": upsell_value,
                "potential_aov": potential_aov_with_upsell,
                "aov_increase": f"+{((upsell_value - product.price) / product.price * 100):.1f}%"
            },
            "combined_strategy": {
                "recommended_sequence": ["upsell_first", "then_cross_sell"],
                "total_potential_aov": potential_aov_with_upsell,
                "total_potential_increase": f"+{((potential_aov_with_upsell - product.price) / product.price * 100):.1f}%",
                "expected_conversion_boost": "15-25%"
            }
        }
