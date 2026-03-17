"""
Datenmodelle für Produkte und Shop-Daten
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    sku: str
    store: str  # "shopify", "woocommerce", "ebay"
    url: str
    image_url: Optional[str] = None


class Product(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime
    

class ProductAnalysis(BaseModel):
    product_id: str
    seo_score: int
    description_quality: int
    price_competitiveness: float
    conversion_potential: int
    complementary_products: List[str]
    issues: List[str]
    recommendations: List[str]


class MarketAnalysis(BaseModel):
    product_id: str
    product_name: str
    web_demand: int  # Suchvolumen
    ebay_listings: int
    ebay_avg_price: float
    ebay_demand_trend: str  # "up", "down", "stable"
    tiktok_mentions: int
    tiktok_trend_score: int
    potential_revenue: float
    market_gaps: List[str]


class ShopAnalysisReport(BaseModel):
    timestamp: datetime
    shop_url: str
    overall_score: int
    performance_metrics: dict
    seo_issues: List[str]
    ux_issues: List[str]
    revenue_opportunities: List[str]
    recommendations: List[dict]
