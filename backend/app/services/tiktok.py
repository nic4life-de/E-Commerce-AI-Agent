"""
Service für TikTok API Integration - Trend- und Nachfrageanalyse
"""
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings


class TikTokService:
    def __init__(self):
        self.api_key = settings.TIKTOK_API_KEY
        self.base_url = "https://open.tiktok.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def search_hashtags(self, keyword: str) -> Dict[str, Any]:
        """Nach Hashtags mit dem Keyword suchen"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/hashtag/search?keywords={keyword}",
                    headers=self.headers
                )
                return response.json() if response.status_code == 200 else {}
        except Exception as e:
            print(f"TikTok API Error: {e}")
            return {}
    
    async def get_trending_topics(self) -> Dict[str, Any]:
        """Aktuelle Trends auf TikTok abrufen"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/explore/trending_topics",
                    headers=self.headers
                )
                return response.json() if response.status_code == 200 else {}
        except Exception as e:
            print(f"TikTok API Error: {e}")
            return {}
    
    async def analyze_product_trend(self, product_keyword: str) -> Dict[str, Any]:
        """
        Trendanalyse für ein Produkt auf TikTok
        Gibt Anzahl erwähnungen, Trend-Score, Videos
        """
        try:
            hashtag_data = await self.search_hashtags(product_keyword)
            
            return {
                "keyword": product_keyword,
                "mentions": hashtag_data.get("challenge_info", {}).get("challenge", {}).get("stats", {}).get("video_count", 0),
                "trend_score": self._calculate_trend_score(hashtag_data),
                "related_hashtags": [
                    h.get("name") 
                    for h in hashtag_data.get("related_hashtag_list", [])[:10]
                ]
            }
        except Exception as e:
            print(f"TikTok Trend Analysis Error: {e}")
            return {
                "keyword": product_keyword,
                "mentions": 0,
                "trend_score": 0,
                "related_hashtags": []
            }
    
    def _calculate_trend_score(self, data: Dict) -> int:
        """Trend-Score berechnen (0-100)"""
        try:
            stats = data.get("challenge_info", {}).get("challenge", {}).get("stats", {})
            video_count = stats.get("video_count", 0)
            view_count = stats.get("view_count", 0)
            
            # Vereinfachte Berechnung: Je mehr Views, desto höher der Score
            if video_count == 0:
                return 0
            
            avg_views = view_count / video_count
            # Normalisiert auf 0-100
            trend_score = min(100, int((avg_views / 1000000) * 100))
            return trend_score
        except:
            return 0
