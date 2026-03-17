"""
Fehlerdiagnose und Optimierungsvorschlag Engine
"""
from typing import List, Dict, Any
from app.models.product import Product


class ErrorDiagnosisEngine:
    """
    Spezialisierte Engine zur Diagnose von Shop-Problemen
    und zur Generierung von automatischen Optimierungsvorschlägen
    """
    
    def __init__(self):
        self.severity_levels = {
            "critical": 100,
            "high": 75,
            "medium": 50,
            "low": 25
        }
    
    async def diagnose_shop(self, products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Umfassende Shop-Diagnose durchführen
        """
        issues = {
            "critical": [],
            "high": [],
            "medium": [],
            "low": []
        }
        
        # Bild-Probleme
        image_issues = self._diagnose_image_issues(products)
        issues["critical"].extend(image_issues["critical"])
        issues["high"].extend(image_issues["high"])
        
        # Beschreibungs-Probleme
        description_issues = self._diagnose_description_issues(products)
        issues["high"].extend(description_issues["high"])
        issues["medium"].extend(description_issues["medium"])
        
        # Preis-Probleme
        price_issues = self._diagnose_price_issues(products)
        issues["high"].extend(price_issues["high"])
        issues["medium"].extend(price_issues["medium"])
        
        # SEO-Probleme
        seo_issues = self._diagnose_seo_issues(products)
        issues["high"].extend(seo_issues["high"])
        issues["medium"].extend(seo_issues["medium"])
        issues["low"].extend(seo_issues["low"])
        
        # Kategorisierungs-Probleme
        category_issues = self._diagnose_categorization_issues(products)
        issues["medium"].extend(category_issues["medium"])
        issues["low"].extend(category_issues["low"])
        
        return issues
    
    def _diagnose_image_issues(self, products: List[Dict]) -> Dict[str, List[Dict]]:
        """Diagnose von Bildproblemen"""
        issues = {"critical": [], "high": []}
        
        products_without_images = [p for p in products if not p.get("images")]
        products_with_few_images = [p for p in products if len(p.get("images", [])) < 3]
        
        if len(products_without_images) > len(products) * 0.2:
            issues["critical"].append({
                "issue": "Zu viele Produkte ohne Bilder",
                "count": len(products_without_images),
                "impact": "Hoher Konversionsverlust (bis zu 40%)",
                "fix": "Füge Bilder für alle Produkte hinzu",
                "effort": "Mittel",
                "priority": 1
            })
        
        if len(products_with_few_images) > 0:
            issues["high"].append({
                "issue": "Unzureichende Bildanzahl",
                "count": len(products_with_few_images),
                "impact": "Reduzierte Conversion, weniger Details für Kunden",
                "fix": "Mindestens 5 qualitativ hochwertige Bilder pro Produkt",
                "effort": "Hoch",
                "priority": 2
            })
        
        return issues
    
    def _diagnose_description_issues(self, products: List[Dict]) -> Dict[str, List[Dict]]:
        """Diagnose von Beschreibungsproblemen"""
        issues = {"high": [], "medium": []}
        
        products_without_desc = [p for p in products if not p.get("body_html") or len(p.get("body_html", "")) < 50]
        products_with_poor_desc = [p for p in products if len(p.get("body_html", "")) < 200]
        
        if len(products_without_desc) > 0:
            issues["high"].append({
                "issue": "Fehlende oder zu kurze Beschreibungen",
                "count": len(products_without_desc),
                "impact": "SEO-Ranking sinkt, Kunden haben weniger Info",
                "fix": "Schreibe aussagekräftige Beschreibungen (min. 300 Wörter)",
                "effort": "Mittel",
                "priority": 3
            })
        
        if len(products_with_poor_desc) > len(products) * 0.5:
            issues["medium"].append({
                "issue": "Kurze Produktbeschreibungen",
                "count": len(products_with_poor_desc),
                "impact": "Schwächeres SEO-Ranking",
                "fix": "Erweitere Beschreibungen mit Features & Benefits",
                "effort": "Mittel",
                "priority": 4
            })
        
        return issues
    
    def _diagnose_price_issues(self, products: List[Dict]) -> Dict[str, List[Dict]]:
        """Diagnose von Preisprobleme"""
        issues = {"high": [], "medium": []}
        
        prices = [float(p.get("variants", [{}])[0].get("price", 0)) for p in products]
        prices = [p for p in prices if p > 0]
        
        if not prices:
            issues["high"].append({
                "issue": "Keine Preise definiert",
                "count": len([p for p in products if not p.get("variants", [{}])[0].get("price")]),
                "impact": "Produkte können nicht gekauft werden",
                "fix": "Füge Preise für alle Produkte hinzu",
                "effort": "Niedrig",
                "priority": 5
            })
        else:
            price_range = max(prices) - min(prices)
            if price_range < 10:
                issues["medium"].append({
                    "issue": "Zu kleine Preisspreizung",
                    "count": 1,
                    "impact": "Geringere Produktdiversität, weniger Kundenoptionen",
                    "fix": "Erweitere Produktrange in verschiedenen Preissegmenten",
                    "effort": "Hoch",
                    "priority": 6
                })
        
        return issues
    
    def _diagnose_seo_issues(self, products: List[Dict]) -> Dict[str, List[Dict]]:
        """Diagnose von SEO-Problemen"""
        issues = {"high": [], "medium": [], "low": []}
        
        # Titel-Länge
        short_titles = [p for p in products if len(p.get("title", "")) < 30]
        if len(short_titles) > 0:
            issues["high"].append({
                "issue": "Produkttitel zu kurz",
                "count": len(short_titles),
                "impact": "Schlechtere Auffindbarkeit in Google",
                "fix": "Titel sollten 50-60 Zeichen lang sein",
                "effort": "Niedrig",
                "priority": 7
            })
        
        # Meta-Beschreibung
        products_without_tags = [p for p in products if not p.get("tags")]
        if len(products_without_tags) > 0:
            issues["medium"].append({
                "issue": "Fehlende Produkt-Tags",
                "count": len(products_without_tags),
                "impact": "Schlechtere Kategorisierung & Suche",
                "fix": "Füge 5-10 relevante Tags pro Produkt hinzu",
                "effort": "Niedrig",
                "priority": 8
            })
        
        # Strukturierte Daten
        issues["low"].append({
            "issue": "Schema Markup fehlt",
            "count": len(products),
            "impact": "Rich Snippets können nicht angezeigt werden",
            "fix": "Implementiere JSON-LD Produktdaten",
            "effort": "Hoch",
            "priority": 9
        })
        
        return issues
    
    def _diagnose_categorization_issues(self, products: List[Dict]) -> Dict[str, List[Dict]]:
        """Diagnose von Kategorisierungsproblemen"""
        issues = {"medium": [], "low": []}
        
        categories = set()
        for product in products:
            for collection in product.get("collections", []):
                categories.add(collection.get("title"))
        
        if len(categories) < 3:
            issues["medium"].append({
                "issue": "Zu wenige Produktkategorien",
                "count": len(categories),
                "impact": "Navigation ist verwirrend, schlechteres UX",
                "fix": "Erstelle mindestens 5-8 relevante Kategorien",
                "effort": "Mittel",
                "priority": 10
            })
        
        products_without_category = [p for p in products if not p.get("collections")]
        if len(products_without_category) > len(products) * 0.1:
            issues["low"].append({
                "issue": "Produkte ohne Kategorie",
                "count": len(products_without_category),
                "impact": "Schwerer zu finden",
                "fix": "Kategorisiere alle Produkte logisch",
                "effort": "Niedrig",
                "priority": 11
            })
        
        return issues
    
    def generate_action_plan(self, issues: Dict[str, List[Dict]]) -> List[Dict[str, Any]]:
        """
        Generiere einen priorisierten Aktionsplan
        """
        all_issues = []
        for severity, issue_list in issues.items():
            all_issues.extend(issue_list)
        
        # Sortiere nach Priorität
        all_issues.sort(key=lambda x: x.get("priority", 99))
        
        # Gruppiere in Phasen
        action_plan = [
            {
                "phase": 1,
                "name": "Kritische Fehler beheben (Woche 1)",
                "issues": [i for i in all_issues if i.get("priority", 99) <= 3],
                "expected_impact": "+25-35% Konversionssteigerung"
            },
            {
                "phase": 2,
                "name": "Performance-Verbesserungen (Woche 2-3)",
                "issues": [i for i in all_issues if 3 < i.get("priority", 99) <= 6],
                "expected_impact": "+10-15% Traffic"
            },
            {
                "phase": 3,
                "name": "Langfristige Optimierung (Monat 2)",
                "issues": [i for i in all_issues if i.get("priority", 99) > 6],
                "expected_impact": "+20-30% SEO-Ranking"
            }
        ]
        
        return action_plan
