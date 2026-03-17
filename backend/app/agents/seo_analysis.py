"""
Detaillierte SEO-Analyse Engine mit spezifischen Meta-Tag Empfehlungen
"""
from typing import List, Dict, Any, Tuple
import re


class SEOAnalysisEngine:
    """
    Vollständige SEO-Analyse mit:
    - Title Tag Optimierung
    - Meta Description Optimierung
    - Keyword Analyse
    - Content Qualität
    - Interne Verlinkung
    - Strukturierte Daten
    """
    
    def __init__(self):
        self.ideal_title_length = (50, 60)
        self.ideal_meta_length = (150, 160)
        self.ideal_heading_count = (2, 5)
        self.high_value_keywords = self._load_keywords()
    
    def _load_keywords(self) -> Dict[str, List[str]]:
        """Lade High-Value Keywords pro Kategorie"""
        return {
            "electronics": [
                "best", "top", "review", "guide", "how to", "buy", "discount",
                "price", "features", "specifications", "warranty", "quality"
            ],
            "fashion": [
                "style", "trend", "collection", "design", "quality", "comfortable",
                "perfect", "best", "ideal", "shipping", "return"
            ],
            "home": [
                "modern", "design", "quality", "durable", "comfortable", "style",
                "living", "bedroom", "kitchen", "decor", "furniture"
            ],
            "sports": [
                "professional", "quality", "performance", "fit", "comfort", "workout",
                "training", "best", "review", "guide", "equipment"
            ]
        }
    
    async def analyze_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analysiere ein Produkt auf SEO-Potenzial
        """
        analysis = {
            "product_id": product_data.get("id"),
            "product_title": product_data.get("title"),
            "overall_seo_score": 0,
            "title_tag_analysis": self._analyze_title(product_data),
            "meta_description_analysis": self._analyze_meta_description(product_data),
            "content_analysis": self._analyze_content(product_data),
            "keyword_analysis": self._analyze_keywords(product_data),
            "link_analysis": self._analyze_links(product_data),
            "structured_data_analysis": self._analyze_structured_data(product_data),
            "recommendations": []
        }
        
        # Berechne Overall Score
        scores = [
            analysis["title_tag_analysis"]["score"] * 0.25,
            analysis["meta_description_analysis"]["score"] * 0.20,
            analysis["content_analysis"]["score"] * 0.25,
            analysis["keyword_analysis"]["score"] * 0.15,
            analysis["structured_data_analysis"]["score"] * 0.15,
        ]
        analysis["overall_seo_score"] = int(sum(scores))
        
        # Generiere Empfehlungen
        analysis["recommendations"] = self._generate_recommendations(analysis)
        
        return analysis
    
    def _analyze_title(self, product_data: Dict) -> Dict[str, Any]:
        """Analysiere Title Tag"""
        title = product_data.get("title", "")
        
        analysis = {
            "current_title": title,
            "length": len(title),
            "ideal_length": f"{self.ideal_title_length[0]}-{self.ideal_title_length[1]}",
            "score": 0,
            "issues": [],
            "suggestions": []
        }
        
        # Längenkontrolle
        if len(title) < self.ideal_title_length[0]:
            analysis["issues"].append("Title zu kurz (weniger SEO Gewicht)")
            analysis["score"] += 30
        elif len(title) > self.ideal_title_length[1]:
            analysis["issues"].append("Title zu lang (wird in SERPs gekürzt)")
            analysis["score"] += 50
        else:
            analysis["score"] += 70
        
        # Prüfe auf Duplikat
        if len(set(title.split())) < len(title.split()) * 0.5:
            analysis["issues"].append("Zu viele Wiederholungen")
            analysis["score"] -= 10
        
        # Prüfe auf wichtige Wörter
        important_words = ["best", "top", "premium", "quality", "review", "guide"]
        if any(word in title.lower() for word in important_words):
            analysis["score"] += 20
        
        # Prüfe auf Modifier (adjektive, Zahlen)
        if any(char.isdigit() for char in title):
            analysis["score"] += 15
        
        # Generiere suggestions
        if len(title) < self.ideal_title_length[0]:
            category = self._detect_category(title)
            suggested_title = self._generate_optimized_title(title, category)
            analysis["suggestions"].append({
                "suggestion": suggested_title,
                "reason": "Nutze Modifiers und Keywords für bessere CTR",
                "expected_ctr_increase": "+8-15%"
            })
        
        return analysis
    
    def _analyze_meta_description(self, product_data: Dict) -> Dict[str, Any]:
        """Analysiere Meta Description"""
        meta = product_data.get("body_html", "") or product_data.get("description", "")
        
        # Extrahiere Text aus HTML
        text = self._extract_text(meta)
        description = text[:160] if text else ""
        
        analysis = {
            "current_description": description[:100] + "..." if len(description) > 100 else description,
            "length": len(description),
            "ideal_length": f"{self.ideal_meta_length[0]}-{self.ideal_meta_length[1]}",
            "score": 0,
            "issues": [],
            "suggestions": []
        }
        
        # Längenkontrolle
        if len(description) == 0:
            analysis["issues"].append("Keine Meta Description vorhanden")
            analysis["score"] = 0
        elif len(description) < self.ideal_meta_length[0]:
            analysis["issues"].append("Meta zu kurz (nicht genug Keyword-Raum)")
            analysis["score"] = 40
        elif len(description) > self.ideal_meta_length[1]:
            analysis["issues"].append("Meta zu lang (wird gekürzt)")
            analysis["score"] = 50
        else:
            analysis["score"] = 80
        
        # Prüfe auf CTA
        cta_words = ["buy", "discover", "save", "learn", "get", "shop", "order", "now"]
        has_cta = any(word in description.lower() for word in cta_words)
        
        if has_cta:
            analysis["score"] += 15
        else:
            analysis["issues"].append("Kein CTA (Call-to-Action)")
            analysis["suggestions"].append({
                "suggestion": "Addiere ein Action-Wort wie 'Kaufen', 'Entdecke' or 'Sparen'",
                "reason": "Erhöht CTR um 5-10%",
                "expected_ctr_increase": "+5-10%"
            })
        
        # Generiere optimale Meta Description
        if len(description) < 50 or not has_cta:
            optimized_meta = self._generate_optimized_meta(product_data)
            analysis["suggestions"].append({
                "suggestion": optimized_meta,
                "reason": "Optimiert für CTR und Keywords",
                "expected_ctr_increase": "+10-20%"
            })
        
        return analysis
    
    def _analyze_content(self, product_data: Dict) -> Dict[str, Any]:
        """Analysiere Content Qualität"""
        content = product_data.get("body_html", "") or product_data.get("description", "")
        text = self._extract_text(content)
        
        analysis = {
            "word_count": len(text.split()),
            "ideal_word_count": "300-500",
            "score": 0,
            "issues": [],
            "suggestions": []
        }
        
        # Word Count
        word_count = len(text.split())
        if word_count < 100:
            analysis["issues"].append("Content zu kurz")
            analysis["score"] = 20
        elif 100 < word_count < 300:
            analysis["issues"].append("Content könnte ausführlicher sein")
            analysis["score"] = 50
        elif 300 < word_count < 500:
            analysis["score"] = 90
        elif word_count > 500:
            analysis["score"] = 85  # Manchmal zu lang
        
        # Prüfe auf Struktur (Überschriften)
        has_h1 = "<h1" in content
        has_h2 = "<h2" in content or "<h3" in content
        
        if not has_h1:
            analysis["issues"].append("Keine H1 Überschrift")
            analysis["score"] -= 10
        
        if not has_h2:
            analysis["issues"].append("Keine H2/H3 Überschriften")
            analysis["score"] -= 5
        
        # Prüfe auf Listen
        has_list = "<ul>" in content or "<ol>" in content
        if has_list:
            analysis["score"] += 15
        else:
            analysis["suggestions"].append({
                "suggestion": "Nutze Bullet Points für Features/Vorteile",
                "reason": "Verbessert Lesbarkeit und Scannability",
                "expected_ranking_boost": "+5-10%"
            })
        
        # Prüfe auf Keywords
        title_keywords = product_data.get("title", "").lower().split()[:3]
        keyword_density = self._calculate_keyword_density(text, title_keywords)
        
        if keyword_density < 0.5:
            analysis["issues"].append("Keywords nicht ausreichend verwendet")
            analysis["score"] -= 10
        elif keyword_density > 3:
            analysis["issues"].append("Keyword Stuffing erkannt")
            analysis["score"] -= 20
        else:
            analysis["score"] += 10
        
        return analysis
    
    def _analyze_keywords(self, product_data: Dict) -> Dict[str, Any]:
        """Analysiere Keyword-Strategie"""
        title = product_data.get("title", "")
        content = self._extract_text(product_data.get("body_html", "")) or ""
        
        category = self._detect_category(title)
        category_keywords = self.high_value_keywords.get(category, [])
        
        analysis = {
            "primary_keywords": title.split()[:3],
            "found_high_value_keywords": [],
            "missing_high_value_keywords": [],
            "score": 50,
            "opportunities": []
        }
        
        # Prüfe welche High-Value Keywords vorhanden sind
        for keyword in category_keywords[:8]:
            if keyword.lower() in title.lower() or keyword.lower() in content.lower():
                analysis["found_high_value_keywords"].append(keyword)
            else:
                analysis["missing_high_value_keywords"].append(keyword)
        
        # Berechne Score
        found_count = len(analysis["found_high_value_keywords"])
        analysis["score"] = min(100, 40 + (found_count * 10))
        
        # Generiere Opportunities
        if analysis["missing_high_value_keywords"]:
            analysis["opportunities"].append({
                "keywords_to_add": analysis["missing_high_value_keywords"][:3],
                "where_to_add": ["title", "meta_description", "first_paragraph"],
                "expected_traffic_increase": f"+{len(analysis['missing_high_value_keywords']) * 5}-15%"
            })
        
        return analysis
    
    def _analyze_links(self, product_data: Dict) -> Dict[str, Any]:
        """Analysiere interne Verlinkung"""
        content = product_data.get("body_html", "") or ""
        
        # Zähle Links
        internal_links = len(re.findall(r'href="/[^"]*"', content))
        external_links = len(re.findall(r'href="https?://[^"]*"', content))
        
        analysis = {
            "internal_links": internal_links,
            "external_links": external_links,
            "score": 0,
            "issues": [],
            "recommendations": []
        }
        
        if internal_links == 0:
            analysis["issues"].append("Keine internen Links - verpasste SEO Chance")
            analysis["score"] = 30
            analysis["recommendations"].append({
                "action": "Verlinke zu 3-5 Related Products",
                "expected_benefit": "Erhöht interne Link-Equity"
            })
        else:
            analysis["score"] = 60 + min(40, internal_links * 5)
        
        if external_links == 0:
            analysis["recommendations"].append({
                "action": "Verlinke zu 1-2 Referenzen/Reviews wenn relevant",
                "expected_benefit": "Erhöht Trust Score"
            })
        
        return analysis
    
    def _analyze_structured_data(self, product_data: Dict) -> Dict[str, Any]:
        """Analysiere Strukturierte Daten (Schema Markup)"""
        content = product_data.get("body_html", "") or ""
        
        analysis = {
            "has_schema_markup": "schema" in content.lower() or "json-ld" in content.lower(),
            "has_product_schema": "Product" in content,
            "has_price_schema": "Price" in content,
            "has_rating_schema": "Rating" in content,
            "score": 0,
            "issues": [],
            "recommendations": []
        }
        
        if not analysis["has_schema_markup"]:
            analysis["score"] = 20
            analysis["issues"].append("Kein Schema Markup - Rich Snippets nicht möglich")
            analysis["recommendations"].append({
                "action": "Implementiere JSON-LD Product Schema",
                "components": ["name", "description", "price", "image", "rating"],
                "expected_benefit": "Erhöht CTR durch Rich Results um 10-30%"
            })
        else:
            analysis["score"] = 60
            
            if analysis["has_price_schema"]:
                analysis["score"] += 20
            else:
                analysis["recommendations"].append({
                    "action": "Addiere Price Schema",
                    "expected_benefit": "Zeige Preis in Google Shopping"
                })
            
            if analysis["has_rating_schema"]:
                analysis["score"] += 20
            else:
                analysis["recommendations"].append({
                    "action": "Addiere AggregateRating Schema",
                    "expected_benefit": "Zeige Bewertungssterne in Suchergebnissen"
                })
        
        return analysis
    
    def _generate_recommendations(self, analysis: Dict) -> List[Dict[str, Any]]:
        """Generiere priorisierte SEO-Empfehlungen"""
        recommendations = []
        
        # Priorität 1: Critical Fixes
        if analysis["title_tag_analysis"]["score"] < 50:
            recommendations.append({
                "priority": "critical",
                "area": "Title Tag",
                "current": analysis["title_tag_analysis"]["current_title"][:50],
                "actions": analysis["title_tag_analysis"]["suggestions"],
                "expected_impact": "+15-25% Impressions"
            })
        
        if analysis["meta_description_analysis"]["length"] == 0:
            recommendations.append({
                "priority": "critical",
                "area": "Meta Description",
                "current": "Keine vorhanden",
                "actions": analysis["meta_description_analysis"]["suggestions"],
                "expected_impact": "+20-30% CTR"
            })
        
        # Priorität 2: High Value
        if analysis["keyword_analysis"]["missing_high_value_keywords"]:
            recommendations.append({
                "priority": "high",
                "area": "Keywords",
                "current": f"{len(analysis['keyword_analysis']['found_high_value_keywords'])} von 8",
                "actions": analysis["keyword_analysis"]["opportunities"],
                "expected_impact": "+10-20% Organic Traffic"
            })
        
        if not analysis["structured_data_analysis"]["has_schema_markup"]:
            recommendations.append({
                "priority": "high",
                "area": "Schema Markup",
                "current": "Nicht implementiert",
                "actions": analysis["structured_data_analysis"]["recommendations"],
                "expected_impact": "+10-30% Rich Results CTR"
            })
        
        # Priorität 3: Medium Improvements
        if analysis["content_analysis"]["word_count"] < 300:
            recommendations.append({
                "priority": "medium",
                "area": "Content Qualität",
                "current": f"{analysis['content_analysis']['word_count']} Wörter",
                "action": "Erweitere Content auf 300-500 Wörter",
                "expected_impact": "+5-15% Ranking"
            })
        
        return recommendations
    
    def _extract_text(self, html: str) -> str:
        """Extrahiere Text aus HTML"""
        # Entferne HTML Tags
        text = re.sub('<[^<]+?>', '', html)
        # Entferne extra spaces
        text = ' '.join(text.split())
        return text
    
    def _detect_category(self, title: str) -> str:
        """Erkenne Produktkategorie"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ["phone", "laptop", "camera", "watch"]):
            return "electronics"
        elif any(word in title_lower for word in ["shirt", "pants", "dress", "jacket"]):
            return "fashion"
        elif any(word in title_lower for word in ["lamp", "sofa", "bed", "table"]):
            return "home"
        elif any(word in title_lower for word in ["shoe", "mat", "weight", "ball"]):
            return "sports"
        
        return "general"
    
    def _generate_optimized_title(self, title: str, category: str) -> str:
        """Generiere optimierten Title Tag"""
        words = title.split()
        
        # Addiere Modifier wenn nicht vorhanden
        if "best" not in title.lower() and "premium" not in title.lower():
            words.insert(0, "Best")
        
        if any(char.isdigit() for char in title):
            pass
        else:
            words.append("2024")
        
        optimized = " ".join(words[:10])  # Max 10 Wörter
        
        if len(optimized) > 60:
            optimized = " ".join(words[:8])
        
        return optimized
    
    def _generate_optimized_meta(self, product_data: Dict) -> str:
        """Generiere optimierte Meta Description"""
        title = product_data.get("title", "")
        
        # Template basiert auf Key Features
        template = f"Entdecke {title} - Hochwertig, zuverlässig & bezahlbar. Bestelle jetzt und spare bis zu 20%!"
        
        if len(template) > 160:
            template = template[:157] + "..."
        
        return template
    
    def _calculate_keyword_density(self, text: str, keywords: List[str]) -> float:
        """Berechne Keyword Density"""
        if not text or not keywords:
            return 0
        
        words = text.lower().split()
        keyword_count = 0
        
        for keyword in keywords:
            keyword_count += words.count(keyword.lower())
        
        if not words:
            return 0
        
        return (keyword_count / len(words)) * 100
