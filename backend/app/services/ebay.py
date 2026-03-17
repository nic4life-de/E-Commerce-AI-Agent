"""
Service für eBay API Integration - Produktrecherche und Marktanalyse
"""
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings


class eBayService:
    def __init__(self):
        self.api_key = settings.EBAY_API_KEY
        self.base_url = "https://api.ebay.com/buy/browse/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def search_products(self, keyword: str, category: Optional[str] = None) -> Dict[str, Any]:
        """eBay nach Produkten durchsuchen"""
        try:
            query = f"keyword={keyword}"
            if category:
                query += f"&category_ids={category}"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/item_summary/search?{query}&limit=50",
                    headers=self.headers
                )
                return response.json() if response.status_code == 200 else {}
        except Exception as e:
            print(f"eBay API Error: {e}")
            return {}
    
    async def analyze_market(self, product_keyword: str) -> Dict[str, Any]:
        """
        Marktanalyse für ein Produkt auf eBay
        Gibt Anzahl Listengs, Preisspanne, Nachfragetrend
        """
        try:
            results = await self.search_products(product_keyword)
            items = results.get("itemSummaries", [])
            
            if not items:
                return {
                    "keyword": product_keyword,
                    "listings_count": 0,
                    "avg_price": 0,
                    "price_range": {"min": 0, "max": 0},
                    "demand_trend": "unknown"
                }
            
            prices = [float(item["price"]["value"]) for item in items if "price" in item]
            
            return {
                "keyword": product_keyword,
                "listings_count": len(items),
                "avg_price": sum(prices) / len(prices) if prices else 0,
                "price_range": {"min": min(prices), "max": max(prices)} if prices else {"min": 0, "max": 0},
                "top_items": [
                    {
                        "title": item.get("title"),
                        "price": item.get("price", {}).get("value"),
                        "condition": item.get("condition"),
                        "seller_info": item.get("seller", {}).get("username")
                    }
                    for item in items[:10]
                ]
            }
        except Exception as e:
            print(f"eBay Market Analysis Error: {e}")
            return {}
